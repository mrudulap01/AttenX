import React from 'react';
import { useAuthStore } from '../../auth/store/authStore';
import { Users, BookOpen, Building2, TrendingUp } from 'lucide-react';
import { StatCard } from './StatCard';
import { AdminAnalyticsWidget } from './AdminAnalyticsWidget';
import { RecentActivitiesWidget } from './RecentActivitiesWidget';
import { ManagementTableWidget } from './ManagementTableWidget';
import { AnalyticsWidget } from './AnalyticsWidget';
import { mockAdminStats } from '../api/mockData';

export const AdminDashboard = () => {
  const { firstName } = useAuthStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full min-h-screen">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back, {firstName || 'Admin'}. Here is your global institution overview.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatCard title="Total Students" value={mockAdminStats.totalStudents} icon={Users} trend="12 New" trendUp={true} />
        <StatCard title="Total Teachers" value={mockAdminStats.totalTeachers} icon={BookOpen} trend="2 New" trendUp={true} />
        <StatCard title="Active Departments" value={mockAdminStats.departments} icon={Building2} />
        <StatCard title="Global Attendance" value={`${mockAdminStats.globalAttendance}%`} icon={TrendingUp} trend="1.5%" trendUp={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-3">
          <AnalyticsWidget />
        </div>
      </div>

      <div className="grid grid-cols-1 mb-12">
        <div className="h-[500px]">
          <ManagementTableWidget />
        </div>
      </div>
    </div>
  );
};
