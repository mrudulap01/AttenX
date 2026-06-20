import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, CheckCircle2, ChevronRight, UploadCloud, X } from 'lucide-react';
import api from '../../../api/axios';

const STEPS = [
  { id: 'front', label: 'Front Face', desc: 'Look directly at the camera' },
  { id: 'left', label: 'Left Profile', desc: 'Turn your head slightly to the left' },
  { id: 'right', label: 'Right Profile', desc: 'Turn your head slightly to the right' }
];

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

interface FaceRegistrationWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FaceRegistrationWizard = ({ isOpen, onClose }: FaceRegistrationWizardProps) => {
  const webcamRef = useRef<Webcam>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [images, setImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImages(prev => ({ ...prev, [STEPS[currentStep].id]: imageSrc }));
      if (currentStep < 2) setCurrentStep(c => c + 1);
    }
  }, [webcamRef, currentStep]);

  const submitRegistration = async () => {
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('front', dataURLtoFile(images.front, 'front.jpg'));
      formData.append('left', dataURLtoFile(images.left, 'left.jpg'));
      formData.append('right', dataURLtoFile(images.right, 'right.jpg'));

      await api.post('/face/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess(true);
      setTimeout(onClose, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register face data');
    } finally {
      setLoading(false);
    }
  };

  const retake = () => {
    setImages({});
    setCurrentStep(0);
    setError('');
  };

  if (!isOpen) return null;

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full flex flex-col items-center justify-center relative">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Face ID Registered!</h2>
          <p className="text-gray-500 text-center">Your biometric data has been securely stored.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 shadow-xl max-w-2xl w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 bg-white rounded-full p-1 shadow-sm">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">Register Face ID</h2>
        
        {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm font-medium">{error}</div>}

        <div className="flex justify-between mb-8">
          {STEPS.map((step, idx) => (
            <div key={step.id} className={`flex items-center ${idx < STEPS.length - 1 ? 'flex-1' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep === idx ? 'bg-indigo-600 text-white' : images[step.id] ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                {images[step.id] ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
              </div>
              {idx < STEPS.length - 1 && <div className={`flex-1 h-1 mx-4 rounded-full ${images[step.id] ? 'bg-emerald-500' : 'bg-gray-100'}`} />}
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center">
          {Object.keys(images).length === 3 ? (
            <div className="w-full">
              <div className="grid grid-cols-3 gap-4 mb-8">
                {STEPS.map(s => (
                  <div key={s.id} className="rounded-xl overflow-hidden border-2 border-gray-100 shadow-sm">
                    <img src={images[s.id]} alt={s.label} className="w-full object-cover aspect-square" />
                    <div className="p-2 bg-gray-50 text-xs text-center font-medium text-gray-600">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                <button onClick={retake} className="flex-1 py-3 px-4 rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 font-semibold transition-colors">
                  Retake
                </button>
                <button onClick={submitRegistration} disabled={loading} className="flex-1 py-3 px-4 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                  {loading ? 'Processing AI...' : <><UploadCloud className="w-5 h-5" /> Submit Biometrics</>}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="relative w-full max-w-md rounded-2xl overflow-hidden bg-black aspect-video mb-6 shadow-inner">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full h-full object-cover transform scale-x-[-1]"
                />
                <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-2xl pointer-events-none"></div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-64 border-2 border-dashed border-white/50 rounded-full"></div>
                </div>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-lg font-bold text-gray-900">{STEPS[currentStep].label}</h3>
                <p className="text-gray-500">{STEPS[currentStep].desc}</p>
              </div>
              <button 
                onClick={capture}
                className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold transition-transform hover:scale-105 shadow-lg shadow-indigo-200"
              >
                <Camera className="w-5 h-5 fill-current" /> Capture
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
