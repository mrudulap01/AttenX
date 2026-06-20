import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { mockGlobalAnalytics } from '../api/mockData';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export const AdminAnalyticsWidget = () => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { min: 50, max: 100, grid: { color: '#f3f4f6' }, border: { display: false } },
      x: { grid: { display: false }, border: { display: false } }
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-6 tracking-tight">Global Attendance Trends</h3>
      <div className="flex-grow w-full h-64 relative">
        <Line data={mockGlobalAnalytics} options={options} />
      </div>
    </div>
  );
};
