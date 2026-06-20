import React from 'react';
import { mockRecentReports } from '../api/mockData';
import { Download } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export const RecentReportsWidget = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col overflow-hidden">
      <div className="p-6 pb-4 border-b border-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800 tracking-tight">Recent Attendance Reports</h3>
        <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View All</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
            <tr>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Subject</th>
              <th className="px-6 py-3 font-medium">Present / Total</th>
              <th className="px-6 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockRecentReports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 text-gray-600 font-medium whitespace-nowrap">
                  {format(parseISO(report.date), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 text-gray-900 font-medium">
                  {report.subject}
                </td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-gray-900">{report.present}</span>
                  <span className="text-gray-400"> / {report.total}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
                    <Download className="w-4 h-4" /> PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
