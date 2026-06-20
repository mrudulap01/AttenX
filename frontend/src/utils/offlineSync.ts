import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface AttenXDB extends DBSchema {
  attendanceQueue: {
    key: string;
    value: {
      id: string;
      imageSrc: string;
      sessionId: string;
      timestamp: number;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<AttenXDB>> | null = null;

if (typeof window !== 'undefined') {
  dbPromise = openDB<AttenXDB>('attenx-offline-db', 1, {
    upgrade(db) {
      db.createObjectStore('attendanceQueue', { keyPath: 'id' });
    },
  });
}

export const queueAttendance = async (imageSrc: string, sessionId: string) => {
  if (!dbPromise) return;
  const db = await dbPromise;
  const id = crypto.randomUUID();
  await db.put('attendanceQueue', {
    id,
    imageSrc,
    sessionId,
    timestamp: Date.now(),
  });
  return id;
};

export const getQueuedAttendance = async () => {
  if (!dbPromise) return [];
  const db = await dbPromise;
  return await db.getAll('attendanceQueue');
};

export const removeQueuedAttendance = async (id: string) => {
  if (!dbPromise) return;
  const db = await dbPromise;
  await db.delete('attendanceQueue', id);
};
