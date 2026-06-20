import React from 'react';
import { mockTeacherTimetable } from '../api/mockData';
import { Clock, MapPin } from 'lucide-react';
import { cn } from '../../../lib/utils';

export const TeacherTimetableWidget = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 tracking-tight">Today's Timetable</h3>
      <div className="space-y-3 flex-grow overflow-auto pr-2 custom-scrollbar">
        {mockTeacherTimetable.map((lecture) => (
          <div key={lecture.id} className="flex flex-col gap-1 bg-gray-50 p-4 rounded-xl w-full border border-gray-100 hover:border-indigo-200 transition-colors group">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">{lecture.subject}</h4>
              <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-md capitalize tracking-wide", 
                lecture.status === 'completed' ? "bg-gray-200 text-gray-700" :
                lecture.status === 'ongoing' ? "bg-emerald-100 text-emerald-700 animate-pulse" :
                "bg-indigo-50 text-indigo-700"
              )}>
                {lecture.status === 'ongoing' ? 'Now' : lecture.status}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mt-2">
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-gray-400" /> {lecture.time}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gray-400" /> {lecture.room}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
