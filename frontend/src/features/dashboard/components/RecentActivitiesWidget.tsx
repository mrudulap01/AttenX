import React from 'react';
import { mockRecentActivities } from '../api/mockData';
import { Activity } from 'lucide-react';

export const RecentActivitiesWidget = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-5 h-5 text-indigo-500" />
        <h3 className="text-lg font-semibold text-gray-800 tracking-tight">System Feed</h3>
      </div>
      <div className="space-y-4 flex-grow overflow-auto custom-scrollbar pr-2">
        {mockRecentActivities.map((act) => (
          <div key={act.id} className="relative pl-6 pb-4 border-l-2 border-gray-100 last:border-transparent last:pb-0">
            <div className="absolute w-3 h-3 bg-indigo-100 border-2 border-indigo-500 rounded-full -left-[7px] top-1"></div>
            <p className="text-sm text-gray-800 leading-snug">
              <span className="font-semibold text-gray-900">{act.user}</span> {act.action} <span className="font-medium text-indigo-600">{act.target}</span>.
            </p>
            <p className="text-xs text-gray-400 mt-1">{act.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
