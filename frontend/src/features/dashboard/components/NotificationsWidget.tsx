import React from 'react';
import { mockNotifications } from '../api/mockData';
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { cn } from '../../../lib/utils';

export const NotificationsWidget = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 tracking-tight">Alerts & Notifications</h3>
      <div className="space-y-3 flex-grow overflow-auto custom-scrollbar">
        {mockNotifications.map((note) => (
          <div key={note.id} className="flex gap-3 p-3 rounded-xl bg-gray-50 border border-transparent hover:border-gray-200 transition-colors">
            <div className={cn("flex-shrink-0 mt-0.5", 
              note.type === 'alert' ? 'text-rose-500' : 
              note.type === 'success' ? 'text-emerald-500' : 'text-indigo-500'
            )}>
              {note.type === 'alert' ? <AlertTriangle className="w-5 h-5" /> : 
               note.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : 
               <Info className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-sm text-gray-800 font-medium leading-snug">{note.message}</p>
              <p className="text-xs text-gray-500 mt-1">{note.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
