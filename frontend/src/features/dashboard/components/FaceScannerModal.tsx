import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, X } from 'lucide-react';
import api from '../../../api/axios';

interface FaceScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const dataURLtoFile = (dataurl: string, filename: string) => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

export const FaceScannerModal = ({ isOpen, onClose }: FaceScannerModalProps) => {
  const webcamRef = useRef<Webcam>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [sessionIdInput, setSessionIdInput] = useState('');

  const captureAndVerify = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;
    if (!sessionIdInput) {
      setError("Please enter the Live Session ID provided by your teacher");
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      if (!navigator.onLine) {
        // Handle Offline Queuing
        const { queueAttendance } = await import('../../../utils/offlineSync');
        await queueAttendance(imageSrc, sessionIdInput);
        setMessage('You are offline. Attendance securely queued for background sync!');
        setTimeout(onClose, 3000);
        return;
      }

      const formData = new FormData();
      formData.append('live_image', dataURLtoFile(imageSrc, 'live.jpg'));
      formData.append('sessionId', sessionIdInput);
      // Pass timestamp to backend
      formData.append('offlineTimestamp', Date.now().toString());

      const response = await api.post('/face/verify', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage(response.data.message || 'Attendance verified via Face ID!');
      setTimeout(onClose, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Face verification failed');
    } finally {
      setLoading(false);
    }
  }, [webcamRef, sessionIdInput, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden flex flex-col relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 bg-white rounded-full p-1 shadow-sm">
          <X className="w-6 h-6" />
        </button>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight text-center mb-4">Face Recognition</h2>
          
          {message && <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm text-center font-medium">{message}</div>}
          {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm text-center font-medium">{error}</div>}
          
          {loading ? (
            <div className="h-[300px] flex items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-sm font-medium text-indigo-600 animate-pulse">Running AI Verification...</p>
              </div>
            </div>
          ) : (
            <>
              <input 
                type="text" 
                placeholder="Enter 36-char Session UUID" 
                value={sessionIdInput}
                onChange={(e) => setSessionIdInput(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl mb-4 text-sm"
              />
              <div className="relative w-full rounded-xl overflow-hidden bg-black aspect-video mb-6">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full h-full object-cover transform scale-x-[-1]"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-40 h-56 border-2 border-dashed border-white/50 rounded-[3rem]"></div>
                </div>
              </div>
              <button 
                onClick={captureAndVerify}
                className="w-full flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors shadow-sm"
              >
                <Camera className="w-5 h-5 fill-current" /> Verify Face
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
