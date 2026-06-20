import React from 'react';
import { useAuthStore } from '../../auth/store/authStore';
import { format } from 'date-fns';

export const WelcomeWidget = () => {
  const { firstName } = useAuthStore();
  const today = new Date();

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-sm flex flex-col justify-center h-full relative overflow-hidden">
      {/* Decorative circle */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
      
      <p className="text-indigo-100 font-medium mb-1 text-sm uppercase tracking-wider">{format(today, 'EEEE, MMMM do, yyyy')}</p>
      <h2 className="text-3xl font-bold mb-3 tracking-tight">Welcome back, {firstName || 'Student'}! 👋</h2>
      <p className="text-indigo-100 opacity-90 max-w-lg leading-relaxed">
        You have 3 lectures scheduled for today. Keep up the good work, your overall attendance is on track!
      </p>
    </div>
  );
};
