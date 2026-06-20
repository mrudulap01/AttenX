import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../../api/axios';

const schema = z.object({
  email: z.string().email("Invalid email address"),
});

export const ForgotPasswordForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<{ email: string }>({ resolver: zodResolver(schema) });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (data: { email: string }) => {
    try {
      const response = await api.post('/auth/forgot-password', data);
      setMessage(response.data.message);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset link');
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Reset Password</h2>
      <p className="text-sm text-gray-500 text-center mb-6">Enter your email and we'll send you a reset link.</p>
      
      {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-50 rounded-lg">{error}</div>}
      {message && <div className="p-3 mb-4 text-sm text-green-700 bg-green-50 rounded-lg">{message}</div>}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
        <input {...register('email')} className="block w-full rounded-lg border-gray-300 p-2.5 border" />
        {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>}
      </div>

      <button type="submit" className="w-full py-2.5 px-4 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700">
        Send Reset Link
      </button>
      <div className="mt-4 text-center">
        <a href="/login" className="text-sm text-indigo-600 hover:text-indigo-500">Back to login</a>
      </div>
    </form>
  );
};
