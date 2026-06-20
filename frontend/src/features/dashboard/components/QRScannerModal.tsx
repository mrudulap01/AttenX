import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X } from 'lucide-react';
import api from '../../../api/axios';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRScannerModal = ({ isOpen, onClose }: QRScannerModalProps) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setMessage('');
      setError('');
      return;
    }

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    const onScanSuccess = async (decodedText: string) => {
      scanner.clear();
      setLoading(true);
      try {
        const response = await api.post('/attendance/qr/scan', { qrPayload: decodedText });
        setMessage(response.data.message || 'Attendance marked successfully!');
        setTimeout(onClose, 3000);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to scan QR');
      } finally {
        setLoading(false);
      }
    };

    scanner.render(onScanSuccess, () => {});

    return () => {
      scanner.clear().catch(console.error);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden flex flex-col relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 bg-white rounded-full p-1 shadow-sm">
          <X className="w-6 h-6" />
        </button>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight text-center mb-4">Scan Attendance QR</h2>
          
          {message && <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm text-center font-medium">{message}</div>}
          {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm text-center font-medium">{error}</div>}
          
          {loading ? (
            <div className="h-[250px] flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div id="qr-reader" className="w-full bg-gray-900 rounded-xl overflow-hidden border border-gray-200"></div>
          )}
        </div>
      </div>
    </div>
  );
};
