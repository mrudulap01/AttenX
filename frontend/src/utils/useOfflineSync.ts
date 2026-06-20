import { useEffect } from 'react';
import { getQueuedAttendance, removeQueuedAttendance } from './offlineSync';
import api from '../api/axios';

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

export const useOfflineSync = () => {
  useEffect(() => {
    const syncAttendance = async () => {
      if (!navigator.onLine) return;
      
      const queuedItems = await getQueuedAttendance();
      for (const item of queuedItems) {
        try {
          const formData = new FormData();
          formData.append('live_image', dataURLtoFile(item.imageSrc, 'offline_sync.jpg'));
          formData.append('sessionId', item.sessionId);
          formData.append('offlineTimestamp', item.timestamp.toString());

          await api.post('/face/verify', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          
          // If successful, remove from queue
          await removeQueuedAttendance(item.id);
          console.log(`Successfully synced offline attendance ${item.id}`);
        } catch (err: any) {
          console.error(`Failed to sync ${item.id}:`, err);
          // If 400 error (e.g., spoof detected or session invalid), we should still remove it to avoid infinite loops
          if (err.response && err.response.status === 400) {
             await removeQueuedAttendance(item.id);
          }
        }
      }
    };

    window.addEventListener('online', syncAttendance);
    
    // Also run once on mount in case they started app online with queued items
    syncAttendance();

    return () => {
      window.removeEventListener('online', syncAttendance);
    };
  }, []);
};
