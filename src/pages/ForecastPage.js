// pages/ForecastPage.js
function ForecastPage({ forecast, status, renderStatus }) {
  return (
    <div style={{ padding: '20px' }}>
      <h2>7-Day Forecast</h2>
      {renderStatus()}
      {forecast && forecast.current && (
        <div style={{ backgroundColor: '#e0f0ff', padding: '16px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3>Next 6 Hours</h3>
          <p>Rainfall: {forecast.current.rain} mm</p>
          <p>Risk Level: <span style={{ color: forecast.current.risk === 'High' ? 'red' : 'green' }}>{forecast.current.risk}</span></p>
          <p>Last Updated: {forecast.current.time}</p>
        </div>
      )}
    </div>
  );
}

export default ForecastPage;
