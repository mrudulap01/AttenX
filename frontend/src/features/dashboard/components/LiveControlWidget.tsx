import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Play, Square, Users, QrCode } from 'lucide-react';
import api from '../../../api/axios';

export const LiveControlWidget = () => {
  const [isLive, setIsLive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [qrData, setQrData] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let interval: any;
    if (isLive) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    } else {
      clearInterval(interval);
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [isLive]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const startSession = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/attendance/qr/start', {
        durationMinutes: 15
      });
      setQrData(response.data.qrPayload);
      setIsLive(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to start session');
    } finally {
      setLoading(false);
    }
  };

  const stopSession = () => {
    setIsLive(false);
    setQrData('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
      <div className="p-6 pb-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-700 tracking-wide uppercase">Current Session</span>
          <h3 className="text-xl font-bold text-gray-900 mt-2">Machine Learning (Div B)</h3>
          <p className="text-sm text-gray-500">11:00 AM - 12:30 PM • Lab 2</p>
        </div>
        <div className="text-right hidden sm:block">
          <div className="flex items-center gap-2 text-gray-600 justify-end">
            <Users className="w-4 h-4" />
            <span className="font-semibold text-gray-900">12 / 60</span>
          </div>
          <p className="text-xs text-gray-500">Students Present</p>
        </div>
      </div>

      <div className="p-6 flex-grow flex flex-col md:flex-row items-center justify-center gap-8 min-h-[300px]">
        {error && <div className="absolute top-4 w-full px-6"><div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm text-center font-medium">{error}</div></div>}
        
        {isLive ? (
          <>
            <div className="flex flex-col items-center">
              <div className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
                <QRCodeSVG value={qrData} size={200} level="H" />
              </div>
              <p className="mt-4 text-sm text-gray-500 text-center max-w-[250px]">Students can scan this QR code using the AttenX app to mark attendance.</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-gray-900 font-mono mb-6">{formatTime(timer)}</div>
              <button 
                onClick={stopSession}
                className="flex items-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-semibold transition-colors shadow-sm"
              >
                <Square className="w-5 h-5 fill-current" /> Stop Attendance
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full py-8">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <QrCode className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-6 text-center">Attendance is currently inactive.</p>
            <button 
              onClick={startSession}
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-semibold transition-colors shadow-sm group"
            >
              <Play className="w-5 h-5 fill-current" /> {loading ? 'Starting...' : 'Start Attendance Session'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
