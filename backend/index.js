const express = require('express');
const axios = require('axios');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const app = express();
app.use(cors());

const PORT = 5000;
const lat = 5.969;
const lon = 116.664;
const WEATHER_API = process.env.WEATHER_API;
const TELEGRAM_API_TOKEN = process.env.TELEGRAM_API_TOKEN;
const TELEGRAM_CHAT_ID = '-4792601476'; // Replace with your actual channel or group ID

const bot = new TelegramBot(TELEGRAM_API_TOKEN);

// ========== CACHE ==========
let cachedForecast = null;
let lastFetchTime = null;

// ========== ALERT FUNCTION ==========
const sendTelegramAlert = (message) => {
  bot.sendMessage(TELEGRAM_CHAT_ID, message);
};

// ========== DAILY TELEGRAM UPDATE ROUTE ==========

app.post('/api/sendDailyUpdate', async (req, res) => {
  const now = new Date();
  const MYtime = now.toLocaleString('en-MY', { timeZone: 'Asia/Kuching' });

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API}&units=metric`
    );

    const forecastList = response.data.list;

    // Today's rain (next 8 x 3h blocks = 24 hours)
    const todayRain = forecastList.slice(0, 8).reduce((total, hour) => {
      return total + (hour.rain?.['3h'] || 0);
    }, 0);

    // Next 3 days general rain (next 24 x 3h blocks)
    const nextDaysRain = [forecastList.slice(8, 16), forecastList.slice(16, 24), forecastList.slice(24, 32)];

    const todayRisk = todayRain > 20 ? 'Tinggi' : 'Rendah';

    const message = `
🌤️ *Kemaskini Cuaca Harian Lohan*  
📅 Tarikh: ${MYtime}

☔ *Ramalan Hari Ini*:
- Jumlah Hujan: *${todayRain.toFixed(1)} mm*
- Risiko: *${todayRisk}*

🔮 *Ramalan 3 Hari Akan Datang*:

`;

    let dayMessages = '';
    nextDaysRain.forEach((dayData, index) => {
      const dayRain = dayData.reduce((total, hour) => total + (hour.rain?.['3h'] || 0), 0);
      const risk = dayRain > 20 ? 'Tinggi' : 'Rendah';
      dayMessages += `\nHari ${index + 1}:  
        - Jumlah Hujan: *${dayRain.toFixed(1)} mm*  
        - Risiko: *${risk}*`;
    });

    const fullMessage = message + dayMessages + `

Jangan lupa untuk bersiap sedia!  
#Lohan #FloodForecast  
#YSS Sukarelawan Siswa  
https://lohan-floor-forecast-lok4.vercel.app/
    `;

    await bot.sendMessage(TELEGRAM_CHAT_ID, fullMessage, { parse_mode: 'Markdown' });

    res.status(200).send('✅ Kemaskini harian dihantar ke Telegram!');
  } catch (error) {
    console.error('❌ Ralat menghantar kemaskini harian:', error.message);
    res.status(500).send('Gagal menghantar kemaskini harian');
  }
});

// ========== MAIN FORECAST ROUTE ==========
app.get('/api/weather', async (req, res) => {
  const now = new Date();

  // Return cached forecast if same day
  if (cachedForecast && lastFetchTime && now.toDateString() === lastFetchTime.toDateString()) {
    return res.json(cachedForecast);
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API}&units=metric`
    );

    const forecastList = response.data.list;

    // Calculate rain in the next 6 hours (2 entries)
    const rainNext6Hours = forecastList.slice(0, 2).reduce((total, hour) => {
      return total + (hour.rain?.['3h'] || 0);
    }, 0);

    // Scan the next 3 days (24 entries) for high risk detection
    const next3DaysData = forecastList.slice(0, 24);
    let maxRain = 0;
    const multiDayForecast = next3DaysData.map(entry => {
      const rain = entry.rain?.['3h'] || 0;
      if (rain > maxRain) maxRain = rain;
      return {
        time: entry.dt_txt,
        rain: rain.toFixed(1),
      };
    });

    const riskLevel = maxRain > 20 ? 'High' : 'Low';

    // Chart: last 7 entries of rainfall (3-hour intervals)
    const rainfallData = forecastList.slice(0, 7).map(entry => entry.rain?.['3h'] || 0);

    // Prepare forecast object
    const forecast = {
      current: {
        rain: rainNext6Hours.toFixed(1),
        risk: rainNext6Hours > 20 ? 'High' : 'Low',
        time: now.toLocaleString('en-MY', { timeZone: 'Asia/Kuching' }),
      },
      riskNext3Days: {
        maxRain: maxRain.toFixed(1),
        level: riskLevel,
      },
      historicalRainfall: rainfallData,
      multiDayForecast: multiDayForecast,
      past: cachedForecast?.past
        ? [...cachedForecast.past, cachedForecast.current].slice(-10)
        : [],
    };

    // Cache the result
    cachedForecast = forecast;
    lastFetchTime = now;

    // Send Telegram alert only once per day
    if (riskLevel === 'High' && (!cachedForecast?.alertSent || now.toDateString() !== lastFetchTime.toDateString())) {
      sendTelegramAlert(`⚠️ High flood risk in Lohan within the next 3 days!\nMax Rainfall: ${maxRain.toFixed(1)} mm\nTime: ${forecast.current.time}`);
      cachedForecast.alertSent = true;
    }

    res.json(forecast);
  } catch (err) {
    console.error('Error fetching weather data:', err.message);
    res.status(500).send('Failed to fetch weather data');
  }
});


// ========== TEST ROUTE ==========
app.get('/', (req, res) => {
  res.send('🌧️ Lohan Rain & Flood Forecast API is running.');
});

// ========== START SERVER ==========
app.listen(PORT, () => {
  console.log(`✅ Backend server is running at http://localhost:${PORT}`);
});
