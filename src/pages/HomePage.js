// pages/HomePage.js
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Welcome to Lohan Flood Forecast</h1>
      <p>This is the go-to site for all flood-related forecasts and information for Lohan, Sabah.</p>

      <div style={{ marginTop: '20px' }}>
        <Link to="/forecast">
          <button style={{ padding: '10px 20px', fontSize: '1rem', margin: '5px' }}>Check Forecast</button>
        </Link>
        <Link to="/education">
          <button style={{ padding: '10px 20px', fontSize: '1rem', margin: '5px' }}>Learn About Floods</button>
        </Link>
        <Link to="/data">
          <button style={{ padding: '10px 20px', fontSize: '1rem', margin: '5px' }}>View Data & Charts</button>
        </Link>
        <Link to="/contact">
          <button style={{ padding: '10px 20px', fontSize: '1rem', margin: '5px' }}>Contact Us</button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
