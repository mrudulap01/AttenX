import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { mockSubjectAnalytics } from '../api/mockData';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const TeacherAnalyticsWidget = () => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: { display: true, color: '#f3f4f6' },
        border: { display: false }
      },
      x: {
        grid: { display: false },
        border: { display: false }
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-6 tracking-tight">Subject Attendance Analytics</h3>
      <div className="flex-grow w-full h-48 relative">
        <Bar data={mockSubjectAnalytics} options={options} />
      </div>
    </div>
  );
};
