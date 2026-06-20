import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Download, FileText } from 'lucide-react';
import api from '../../../api/axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const AnalyticsWidget = () => {
  const [data, setData] = useState([]);
  const [timeframe, setTimeframe] = useState('DAILY');
  const [groupBy, setGroupBy] = useState('DEPARTMENT');
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await api.post('/reports/stats', { timeframe, groupBy });
      setData(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [timeframe, groupBy]);

  const downloadFile = async (format: 'excel' | 'pdf') => {
    try {
      const response = await api.post(`/reports/export/${format}`, { timeframe, groupBy }, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendance_report.${format === 'excel' ? 'xlsx' : 'pdf'}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download failed', err);
    }
  };

  const chartLabels = data.map((d: any) => d.label);
  const presentData = data.map((d: any) => d.presentCount);
  const absentData = data.map((d: any) => d.absentCount);

  const lineData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Present',
        data: presentData,
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Absent',
        data: absentData,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const barData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Present',
        data: presentData,
        backgroundColor: '#4f46e5',
        borderRadius: 4
      },
      {
        label: 'Absent',
        data: absentData,
        backgroundColor: '#ef4444',
        borderRadius: 4
      }
    ]
  };

  const pieData = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        data: [
          presentData.reduce((a, b) => a + b, 0),
          absentData.reduce((a, b) => a + b, 0)
        ],
        backgroundColor: ['#4f46e5', '#ef4444'],
        borderWidth: 0
      }
    ]
  };

  const total = presentData.reduce((a, b) => a + b, 0) + absentData.reduce((a, b) => a + b, 0);
  const attendancePercentage = total > 0 ? Math.round((presentData.reduce((a, b) => a + b, 0) / total) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 col-span-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-semibold text-gray-900 tracking-tight">Attendance Analytics (Chart.js)</h3>
          <p className="text-sm text-gray-500">KPIs and visual breakdowns</p>
        </div>
        
        <div className="flex gap-4 items-center">
          <select 
            value={groupBy} 
            onChange={(e) => setGroupBy(e.target.value)}
            className="text-sm border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2"
          >
            <option value="DEPARTMENT">By Department</option>
            <option value="STUDENT">By Student</option>
            <option value="DAILY">By Day</option>
          </select>
          
          <div className="flex gap-2">
            <button onClick={() => downloadFile('excel')} className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-sm font-medium transition-colors">
              <Download className="w-4 h-4" /> Excel
            </button>
            <button onClick={() => downloadFile('pdf')} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl text-sm font-medium transition-colors">
              <FileText className="w-4 h-4" /> PDF
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-80 w-full flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
              <h4 className="text-sm font-medium text-indigo-800">Overall Attendance</h4>
              <p className="text-2xl font-bold text-indigo-900 mt-1">{attendancePercentage}%</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
              <h4 className="text-sm font-medium text-emerald-800">Total Present</h4>
              <p className="text-2xl font-bold text-emerald-900 mt-1">{presentData.reduce((a, b) => a + b, 0)}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
              <h4 className="text-sm font-medium text-red-800">Defaulters (Absent)</h4>
              <p className="text-2xl font-bold text-red-900 mt-1">{absentData.reduce((a, b) => a + b, 0)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-64">
              <h4 className="text-sm font-semibold text-gray-700 mb-4 text-center">Trend Analysis (Line)</h4>
              <Line data={lineData} options={{ maintainAspectRatio: false }} />
            </div>
            <div className="h-64">
              <h4 className="text-sm font-semibold text-gray-700 mb-4 text-center">Comparison (Bar)</h4>
              <Bar data={barData} options={{ maintainAspectRatio: false }} />
            </div>
            <div className="h-64 flex flex-col items-center">
              <h4 className="text-sm font-semibold text-gray-700 mb-4 text-center">Distribution (Pie)</h4>
              <div className="w-1/2 h-full relative">
                <Pie data={pieData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
            {/* Heatmap skipped for brevity without complex chartjs-chart-matrix setup */}
          </div>
        </>
      )}
    </div>
  );
};
