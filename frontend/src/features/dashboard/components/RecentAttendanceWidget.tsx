import React from 'react';
import { mockRecentAttendance } from '../api/mockData';
import { cn } from '../../../lib/utils';
import { format, parseISO } from 'date-fns';

export const RecentAttendanceWidget = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col overflow-hidden">
      <div className="p-6 pb-4 border-b border-gray-50">
        <h3 className="text-lg font-semibold text-gray-800 tracking-tight">Recent Attendance</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
            <tr>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Subject</th>
              <th className="px-6 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockRecentAttendance.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 text-gray-600 font-medium">
                  {format(parseISO(record.date), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 text-gray-900 font-medium">
                  {record.subject}
                </td>
                <td className="px-6 py-4">
                  <span className={cn("px-2.5 py-1 rounded-md text-xs font-semibold",
                    record.status === 'Present' ? "bg-emerald-50 text-emerald-700" :
                    record.status === 'Absent' ? "bg-rose-50 text-rose-700" :
                    "bg-indigo-50 text-indigo-700"
                  )}>
                    {record.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-auto p-4 border-t border-gray-50 text-center">
        <a href="/student/reports" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View Full Log &rarr;</a>
      </div>
    </div>
  );
};
