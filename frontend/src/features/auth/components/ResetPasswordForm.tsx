import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../../api/axios';
import { useSearchParams, useNavigate } from 'react-router-dom';

const schema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetFormValues = z.infer<typeof schema>;

export const ResetPasswordForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ResetFormValues>({ resolver: zodResolver(schema) });
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (data: ResetFormValues) => {
    try {
      const response = await api.post('/auth/reset-password', { token, newPassword: data.newPassword });
      setMessage(response.data.message);
      setError('');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password');
      setMessage('');
    }
  };

  if (!token) return <div className="text-center p-8">Invalid or missing reset token.</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create New Password</h2>
      
      {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-50 rounded-lg">{error}</div>}
      {message && <div className="p-3 mb-4 text-sm text-green-700 bg-green-50 rounded-lg">{message}</div>}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
        <input type="password" {...register('newPassword')} className="block w-full rounded-lg border-gray-300 p-2.5 border" />
        {errors.newPassword && <span className="text-red-500 text-xs mt-1 block">{errors.newPassword.message}</span>}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
        <input type="password" {...register('confirmPassword')} className="block w-full rounded-lg border-gray-300 p-2.5 border" />
        {errors.confirmPassword && <span className="text-red-500 text-xs mt-1 block">{errors.confirmPassword.message}</span>}
      </div>

      <button type="submit" className="w-full py-2.5 px-4 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700">
        Reset Password
      </button>
    </form>
  );
};
