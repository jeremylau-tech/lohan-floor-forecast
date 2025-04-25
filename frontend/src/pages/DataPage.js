// pages/DataPage.js
import { Line } from 'react-chartjs-2';

function DataPage() {
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Rainfall (mm)',
        data: [20, 50, 10, 30, 60, 25, 40],
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
      },
    ],
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Rainfall Data</h2>
      <Line data={data} />
    </div>
  );
}

export default DataPage;
