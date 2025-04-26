import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import EducationSection from './pages/EducationPage';  
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { FaTint, FaExclamationTriangle, FaClock, FaEnvelope, FaPhoneAlt, FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';

// Register the necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [forecast, setForecast] = useState(null);
  const [status, setStatus] = useState('loading');
  const [activeSection, setActiveSection] = useState('forecast');

  useEffect(() => {
    let timeoutId;
  
    const fetchForecast = async () => {
      try {
        // Start a timeout of 10 seconds
        timeoutId = setTimeout(() => {
          setStatus('timeout'); // If backend slow, after 10s, show "still trying..."
        }, 10000);
  
        const res = await fetch('https://lohan-floor-forecast.onrender.com/api/weather');
        if (!res.ok) throw new Error('Network response was not ok');
  
        const data = await res.json();
        clearTimeout(timeoutId); // Cancel the timeout if success
        setForecast(data);
        setStatus('loaded');
      } catch (err) {
        console.error(err);
        clearTimeout(timeoutId);
        setStatus('error'); // Only true error
      }
    };
  
    fetchForecast();
  
    // Cleanup timeout if component unmounts
    return () => clearTimeout(timeoutId);
  }, []);
  

  const renderStatus = () => {
    if (status === 'loading') return <p style={{ color: 'orange' }}>⏳ Loading forecast... Please wait.</p>;
    if (status === 'timeout') return <p style={{ color: 'orange' }}>⚠️ Backend slow... still trying to load.</p>;
    if (status === 'error') return <p style={{ color: 'red' }}>❌ Failed to load forecast. Please refresh later.</p>;
    return null;
  };

  const sendDailyUpdate = async () => {
    try {
      const res = await fetch('https://lohan-floor-forecast.onrender.com/api/sendDailyUpdate', {
        method: 'POST',
        headers: {
          'Authorization': 'Lohan123',  // Replace with your actual secret password
        },
      });
      if (res.ok) {
        alert('✅ Daily update sent to Telegram!');
      } else {
        alert('❌ Failed to send daily update.');
      }
    } catch (error) {
      console.error('Error sending daily update:', error);
      alert('❌ Error occurred while sending daily update.');
    }
  };

  const renderForecast = () => {
    if (!forecast || !forecast.current || !forecast.historicalRainfall || !forecast.multiDayForecast) {
      return <p>Loading forecast...</p>;
    }
  
    const riskLevel = forecast.current.risk;
    const futureRisk = forecast.riskNext3Days?.level || 'Low';
    const futureRiskColor = futureRisk === 'High' ? '#ff4d4d' : '#4CAF50';
  
    const chartData = {
      labels: Array.from({ length: 7 }, (_, i) => `Day ${i + 1}`),
      datasets: [
        {
          label: 'Rainfall (mm)',
          data: forecast.historicalRainfall,
          fill: true,
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          borderColor: '#007BFF',
          tension: 0.2,
          pointRadius: 4,
          pointBackgroundColor: '#007BFF',
        },
      ],
    };
  
    return (
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
          marginBottom: '24px',
          fontFamily: 'Segoe UI, sans-serif',
        }}
      >
        {/* Current Rain Forecast */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <FaTint size={24} color="#007BFF" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>Rain Forecast (Next 6 Hours)</h2>
        </div>
  
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ fontSize: '1.25rem', color: '#007BFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaTint /> <strong>{forecast.current.rain} mm</strong>
          </div>
  
          <div
            style={{
              padding: '6px 12px',
              backgroundColor: riskLevel === 'High' ? '#ff4d4d' : '#4CAF50',
              color: '#fff',
              borderRadius: '20px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <FaExclamationTriangle /> Now: {riskLevel} Risk
          </div>
  
          <div style={{ fontSize: '0.9rem', color: '#777', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FaClock /> Last Updated: {forecast.current.time}
          </div>
        </div>
  
        <hr style={{ margin: '24px 0', borderTop: '1px solid #eee' }} />
  
        {/* 3-Day Risk Summary */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#333', marginBottom: '8px' }}>🗓️ Risk Summary (Next 3 Days)</h3>
          <div
            style={{
              padding: '10px 16px',
              backgroundColor: futureRiskColor,
              color: '#fff',
              borderRadius: '8px',
              fontWeight: 'bold',
              display: 'inline-block',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            }}
          >
            Max Detected Risk: {futureRisk} ({forecast.riskNext3Days.maxRain} mm peak)
          </div>
        </div>
  
        {/* Multi-Day Forecast Cards */}
        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#333' }}>📅 Detailed 3-Day Forecast</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
  {forecast.multiDayForecast.map((entry, index) => {
    const rain = parseFloat(entry.rain);

    // Define color by threshold
    let bgColor = '#e0f7e9'; // Green
    if (rain >= 1.0 && rain < 5.0) bgColor = '#fff4cc'; // Yellow
    if (rain >= 5.0) bgColor = '#ffe6e6'; // Light Red

    return (
      <div
        key={index}
        style={{
          flex: '1 0 120px',
          padding: '12px',
          backgroundColor: bgColor,
          border: '1px solid #ccc',
          borderRadius: '8px',
          fontSize: '0.85rem',
        }}
      >
        <strong>
          {new Date(entry.time).toLocaleString('en-MY', {
            timeZone: 'Asia/Kuching',
            weekday: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </strong>
        <p style={{ margin: '4px 0' }}>🌧 {rain} mm</p>
      </div>
    );
  })}
</div>

        </div>
  
        {/* Historical Rainfall Chart */}
        <div style={{ marginTop: '32px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '12px', color: '#333' }}>📊 Past Rainfall Trend</h3>
          <Line data={chartData} />
        </div>
      </div>
    );
  };
  

  const renderEducationSection = () => {
    return <EducationSection />;
  };
  
  const renderDataSection = () => {
    if (!forecast || !forecast.historicalRainfall) return <p>Loading data...</p>;
  
    // Chart.js Data
    const chartData = {
      labels: Array.from({ length: 7 }, (_, i) => `Day ${i + 1}`), // Days 1 to 7
      datasets: [
        {
          label: 'Rainfall (mm)',
          data: forecast.historicalRainfall, // Rainfall data for 7 days
          fill: false,
          borderColor: '#0056b3',
          tension: 0.1,
        },
      ],
    };
  
    return (
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Data & Charts</h2>
        <p>Here you can view the data on past rainfall and flood occurrences in Lohan, Sabah.</p>
        <Line data={chartData} />
      </div>
    );
  };
  

  const renderContactSection = () => {
    return (
      <div style={{
        backgroundColor: '#f5faff',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        fontFamily: 'Segoe UI, sans-serif'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '12px' }}>📬 Contact Us</h2>
        <p style={{ marginBottom: '20px' }}>
          Have questions or need assistance? Reach out to us using the contact details below:
        </p>
        <ul style={{ listStyleType: 'none', padding: 0, lineHeight: '1.8' }}>
          <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaEnvelope color="#007BFF" /> 
            <a href="mailto:lohanfloodinfo@gmail.com" style={{ color: '#007BFF', textDecoration: 'none' }}>
              lohanfloodinfo@gmail.com
            </a>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaPhoneAlt color="#007BFF" />
            <a href="tel:+601170775282" style={{ color: '#007BFF', textDecoration: 'none' }}>
              +60 11 7077 5282
            </a>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px' }}>
            <span>Follow us:</span>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: '#4267B2' }}>
              <FaFacebookF />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: '#E1306C' }}>
              <FaInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: '#1DA1F2' }}>
              <FaTwitter />
            </a>
          </li>
        </ul>
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', color: '#222', padding: '24px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '16px' }}>🌧️ Lohan Rain & Flood Forecast</h1>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', marginBottom: '16px' }}>
        <button
          onClick={() => setActiveSection('forecast')}
          style={{
            padding: '10px 20px',
            fontSize: '1rem',
            marginRight: '10px',
            backgroundColor: activeSection === 'forecast' ? '#0056b3' : '#e0e0e0',
            color: activeSection === 'forecast' ? '#fff' : '#333',
            borderRadius: '5px',
            border: 'none',
          }}
        >
          Forecast
        </button>
        <button
          onClick={() => setActiveSection('education')}
          style={{
            padding: '10px 20px',
            fontSize: '1rem',
            marginRight: '10px',
            backgroundColor: activeSection === 'education' ? '#0056b3' : '#e0e0e0',
            color: activeSection === 'education' ? '#fff' : '#333',
            borderRadius: '5px',
            border: 'none',
          }}
        >
          Education
        </button>
        {/* <button
          onClick={() => setActiveSection('data')}
          style={{
            padding: '10px 20px',
            fontSize: '1rem',
            marginRight: '10px',
            backgroundColor: activeSection === 'data' ? '#0056b3' : '#e0e0e0',
            color: activeSection === 'data' ? '#fff' : '#333',
            borderRadius: '5px',
            border: 'none',
          }}
        >
          Data & Charts
        </button> */}
        <button
          onClick={() => setActiveSection('contact')}
          style={{
            padding: '10px 20px',
            fontSize: '1rem',
            backgroundColor: activeSection === 'contact' ? '#0056b3' : '#e0e0e0',
            color: activeSection === 'contact' ? '#fff' : '#333',
            borderRadius: '5px',
            border: 'none',
          }}
        >
          Contact
        </button>
      </div>

      {/* Display the active section */}
      {activeSection === 'forecast' && (
        <div>
          {renderStatus()}
          {forecast && forecast.current && renderForecast()}

          {/* Button to send Telegram daily update */}
          <button
            onClick={sendDailyUpdate}
            style={{
              marginTop: '20px',
              padding: '12px 24px',
              fontSize: '1rem',
              backgroundColor: '#28a745',
              color: '#fff',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            📬 Send Today's Update to Telegram
          </button>
        </div>
      )}
      {activeSection === 'education' && renderEducationSection()}
      {activeSection === 'data' && renderDataSection()}
      {activeSection === 'contact' && renderContactSection()}
    </div>
  );
}

export default App;
