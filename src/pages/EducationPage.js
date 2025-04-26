import React, { useState } from 'react';
import {
  FaMapMarkedAlt, FaBoxOpen, FaBroadcastTower, FaRunning, FaBan,
  FaBullhorn, FaBolt, FaHome, FaPumpSoap, FaPhoneAlt, FaUniversity
} from 'react-icons/fa';

const tips = [
  {
    icon: <FaMapMarkedAlt />,
    en: 'Know your nearest evacuation routes and centers.',
    ms: 'Kenali laluan dan pusat pemindahan terdekat anda.'
  },
  {
    icon: <FaBoxOpen />,
    en: 'Prepare an emergency kit (torchlight, food, water, documents, meds).',
    ms: 'Sediakan kit kecemasan (lampu suluh, makanan, air, dokumen, ubat).'
  },
  {
    icon: <FaBroadcastTower />,
    en: 'Follow official alerts from MetMalaysia & NADMA.',
    ms: 'Ikuti maklumat rasmi dari MetMalaysia & NADMA.'
  },
];

const during = [
  {
    icon: <FaRunning />,
    en: 'Move to high ground immediately.',
    ms: 'Segera berpindah ke kawasan tinggi.'
  },
  {
    icon: <FaBan />,
    en: 'Avoid crossing floodwaters – even 15cm can knock you over.',
    ms: 'Elakkan merentas air banjir – paras rendah pun boleh bahaya.'
  },
  {
    icon: <FaBullhorn />,
    en: 'Follow instructions from RELA, police, or BOMBA.',
    ms: 'Ikut arahan dari RELA, polis, atau BOMBA.'
  }
];

const after = [
  {
    icon: <FaBolt />,
    en: 'Beware of electrical hazards and broken infrastructure.',
    ms: 'Waspada terhadap kejutan elektrik dan kerosakan struktur.'
  },
  {
    icon: <FaHome />,
    en: 'Return home only when declared safe.',
    ms: 'Pulang ke rumah hanya jika disahkan selamat.'
  },
  {
    icon: <FaPumpSoap />,
    en: 'Disinfect all surfaces, especially food areas.',
    ms: 'Nyahkuman semua permukaan, terutama tempat makanan.'
  }
];

const resources = [
  {
    icon: <FaUniversity />,
    en: 'Local evacuation centers',
    ms: 'Pusat pemindahan tempatan',
    link: '#'
  },
  {
    icon: <FaPhoneAlt />,
    en: 'Emergency: 999 (Fire, Police, Ambulance)',
    ms: 'Kecemasan: 999 (Bomba, Polis, Ambulan)'
  },
  {
    icon: <FaBroadcastTower />,
    en: 'Updates: Public Info Banjir, MetMalaysia',
    ms: 'Kemas kini: Public Info Banjir, MetMalaysia',
    links: [
      { name: 'Public Info Banjir', href: 'https://publicinfobanjir.water.gov.my/' },
      { name: 'MetMalaysia', href: 'https://www.met.gov.my/' }
    ]
  }
];

const EducationSection = () => {
  const [lang, setLang] = useState('en');
  const t = (en, ms) => (lang === 'en' ? en : ms);

  const renderItems = (items) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
          <span>{t(item.en, item.ms)}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '24px', fontFamily: 'Segoe UI, sans-serif' }}>
      <h2 style={{ fontSize: '1.8rem', fontWeight: '700' }}>🌧️ {t('Flood Safety Guide', 'Panduan Keselamatan Banjir')}</h2>
      <p style={{ marginBottom: '16px' }}>
        {t(
          'Stay informed and prepared with official flood safety steps for Lohan, Sabah — based on NADMA and international best practices.',
          'Sentiasa peka dan bersedia dengan langkah keselamatan banjir rasmi untuk Lohan, Sabah — berdasarkan garis panduan NADMA dan amalan antarabangsa.'
        )}
      </p>

      <button
        onClick={() => setLang(lang === 'en' ? 'ms' : 'en')}
        style={{
          marginBottom: '24px',
          backgroundColor: '#0056b3',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          padding: '10px 20px',
          cursor: 'pointer'
        }}
      >
        {lang === 'en' ? 'Tukar ke Bahasa Melayu' : 'Switch to English'}
      </button>

      {/* Sections */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: '600' }}>🛑 {t('Before a Flood', 'Sebelum Banjir')}</h3>
        {renderItems(tips)}
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: '600' }}>⚠️ {t('During a Flood', 'Semasa Banjir')}</h3>
        {renderItems(during)}
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: '600' }}>✅ {t('After a Flood', 'Selepas Banjir')}</h3>
        {renderItems(after)}
      </div>

      <div>
        <h3 style={{ fontSize: '1.3rem', fontWeight: '600' }}>📌 {t('Important Resources', 'Sumber Penting')}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {resources.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
              <span>
                {item.link ? (
                  <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color: '#0056b3' }}>
                    {t(item.en, item.ms)}
                  </a>
                ) : item.links ? (
                  item.links.map((l, j) => (
                    <a
                      key={j}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#0056b3', marginRight: '8px' }}
                    >
                      {l.name}
                    </a>
                  ))
                ) : (
                  t(item.en, item.ms)
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EducationSection;
