import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../../api/axios';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await api.post('/auth/login', data);
      const { accessToken, role, email, firstName } = response.data;
      setAuth(accessToken, role, email, firstName);
      
      // Role Based Navigation
      if (role === 'ROLE_ADMIN') navigate('/admin');
      else if (role === 'ROLE_TEACHER') navigate('/teacher');
      else navigate('/student');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 tracking-tight">Sign in to AttenX</h2>
      
      {error && <div className="p-3 text-sm text-red-700 bg-red-50 rounded-lg">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
        <input {...register('email')} className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border" placeholder="you@college.edu" />
        {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input type="password" {...register('password')} className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border" placeholder="••••••••" />
        {errors.password && <span className="text-red-500 text-xs mt-1 block">{errors.password.message}</span>}
      </div>

      <div className="flex items-center justify-between pt-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" {...register('rememberMe')} className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
          <span className="text-sm text-gray-600">Remember me</span>
        </label>
        <a href="/forgot-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">Forgot password?</a>
      </div>

      <button type="submit" className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors mt-4">
        Sign in
      </button>
      
      <p className="text-center text-sm text-gray-600 mt-6">
        Don't have an account? <a href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">Sign up</a>
      </p>
    </form>
  );
};
