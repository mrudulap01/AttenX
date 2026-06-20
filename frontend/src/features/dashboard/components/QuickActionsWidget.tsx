import React from 'react';
import { QrCode, FileText, Calendar, Bell, Camera } from 'lucide-react';
import { useAuthStore } from '../../auth/store/authStore';

interface QuickActionsWidgetProps {
  onScanClick?: () => void;
  onSetupFaceClick?: () => void;
  onVerifyFaceClick?: () => void;
}

export const QuickActionsWidget = ({ onScanClick, onSetupFaceClick, onVerifyFaceClick }: QuickActionsWidgetProps) => {
  const { firstName, email } = useAuthStore();
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-50">
        <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xl shadow-inner">
          {firstName ? firstName.charAt(0).toUpperCase() : 'S'}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 tracking-tight">{firstName || 'Student'}</h3>
          <p className="text-sm text-gray-500">{email || 'student@attenx.edu'}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-3 mt-auto">
        <button onClick={onScanClick} className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-indigo-50 transition-colors group">
          <div className="bg-gray-50 p-3 rounded-full mb-2 group-hover:bg-indigo-100 transition-colors">
            <QrCode className="w-5 h-5 text-gray-600 group-hover:text-indigo-600" />
          </div>
          <span className="text-xs font-medium text-gray-600 group-hover:text-indigo-700">Scan QR</span>
        </button>
        <button onClick={onSetupFaceClick} className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-indigo-50 transition-colors group">
          <div className="bg-gray-50 p-3 rounded-full mb-2 group-hover:bg-indigo-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 group-hover:text-indigo-600"><path d="M3 7V5a2 2 0 0 1 2-2h2"></path><path d="M17 3h2a2 2 0 0 1 2 2v2"></path><path d="M21 17v2a2 2 0 0 1-2 2h-2"></path><path d="M7 21H5a2 2 0 0 1-2-2v-2"></path><rect width="10" height="14" x="7" y="5" rx="2"></rect><path d="M12 12h.01"></path></svg>
          </div>
          <span className="text-xs font-medium text-gray-600 group-hover:text-indigo-700">Setup Face</span>
        </button>
        <button onClick={onVerifyFaceClick} className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-indigo-50 transition-colors group">
          <div className="bg-gray-50 p-3 rounded-full mb-2 group-hover:bg-indigo-100 transition-colors">
            <Camera className="w-5 h-5 text-gray-600 group-hover:text-indigo-600" />
          </div>
          <span className="text-xs font-medium text-gray-600 group-hover:text-indigo-700">Verify Face</span>
        </button>
        <button className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-indigo-50 transition-colors group">
          <div className="bg-gray-50 p-3 rounded-full mb-2 group-hover:bg-indigo-100 transition-colors">
            <Bell className="w-5 h-5 text-gray-600 group-hover:text-indigo-600" />
          </div>
          <span className="text-xs font-medium text-gray-600 group-hover:text-indigo-700">Alerts</span>
        </button>
      </div>
    </div>
  );
};
