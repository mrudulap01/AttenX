import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../../api/axios';
import { useNavigate } from 'react-router-dom';

const signupSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(['STUDENT', 'TEACHER', 'ADMIN']),
  collegeId: z.string().uuid("Invalid College ID"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export const SignupForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      collegeId: '123e4567-e89b-12d3-a456-426614174000' // Mock default for testing
    }
  });
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onSubmit = async (data: SignupFormValues) => {
    try {
      const response = await api.post('/auth/signup', data);
      setSuccess(response.data.message);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to sign up');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 tracking-tight">Create Account</h2>
      
      {error && <div className="p-3 text-sm text-red-700 bg-red-50 rounded-lg">{error}</div>}
      {success && <div className="p-3 text-sm text-green-700 bg-green-50 rounded-lg">{success}</div>}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input {...register('firstName')} className="block w-full rounded-lg border-gray-300 p-2.5 border" />
          {errors.firstName && <span className="text-red-500 text-xs">{errors.firstName.message}</span>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input {...register('lastName')} className="block w-full rounded-lg border-gray-300 p-2.5 border" />
          {errors.lastName && <span className="text-red-500 text-xs">{errors.lastName.message}</span>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
        <input {...register('email')} className="block w-full rounded-lg border-gray-300 p-2.5 border" />
        {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input type="password" {...register('password')} className="block w-full rounded-lg border-gray-300 p-2.5 border" />
        {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
        <select {...register('role')} className="block w-full rounded-lg border-gray-300 p-2.5 border bg-white">
          <option value="STUDENT">Student</option>
          <option value="TEACHER">Teacher</option>
          <option value="ADMIN">Admin</option>
        </select>
        {errors.role && <span className="text-red-500 text-xs">{errors.role.message}</span>}
      </div>

      <button type="submit" className="w-full py-2.5 px-4 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors mt-4">
        Sign Up
      </button>
      
      <p className="text-center text-sm text-gray-600 mt-6">
        Already have an account? <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Sign in</a>
      </p>
    </form>
  );
};
