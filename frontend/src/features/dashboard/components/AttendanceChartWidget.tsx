import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { mockAttendanceData } from '../api/mockData';

ChartJS.register(ArcElement, Tooltip, Legend);

export const AttendanceChartWidget = () => {
  const { attended, absent, excused, overallPercentage } = mockAttendanceData;

  const data = {
    labels: ['Attended', 'Absent', 'Excused'],
    datasets: [
      {
        data: [attended, absent, excused],
        backgroundColor: ['#10b981', '#f43f5e', '#6366f1'],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    cutout: '75%',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => ` ${context.label}: ${context.raw} classes`
        }
      }
    },
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 tracking-tight">Attendance Overview</h3>
      <div className="relative flex-grow flex items-center justify-center">
        <div className="w-48 h-48 relative">
          <Doughnut data={data} options={options} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-800">{overallPercentage}%</span>
            <span className="text-xs text-gray-500 font-medium">Overall</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-6 text-sm px-2">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div><span className="text-gray-600 font-medium">Present</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-500"></div><span className="text-gray-600 font-medium">Absent</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-indigo-500"></div><span className="text-gray-600 font-medium">Excused</span></div>
      </div>
    </div>
  );
};
