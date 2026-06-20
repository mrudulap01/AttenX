import React from 'react';
import { useAuthStore } from '../../auth/store/authStore';
import { Users, BookOpen, BarChart3, Clock } from 'lucide-react';
import { StatCard } from './StatCard';
import { LiveControlWidget } from './LiveControlWidget';
import { TeacherAnalyticsWidget } from './TeacherAnalyticsWidget';
import { TeacherTimetableWidget } from './TeacherTimetableWidget';
import { RecentReportsWidget } from './RecentReportsWidget';
import { AnalyticsWidget } from './AnalyticsWidget';
import { mockTeacherStats } from '../api/mockData';

export const TeacherDashboard = () => {
  const { firstName } = useAuthStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full min-h-screen">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Teacher Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back, {firstName || 'Professor'}. Here's your daily overview.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatCard title="Total Students" value={mockTeacherStats.totalStudents} icon={Users} />
        <StatCard title="Classes Conducted" value={mockTeacherStats.classesConducted} icon={BookOpen} trend="This Month" />
        <StatCard title="Avg Attendance" value={`${mockTeacherStats.averageAttendance}%`} icon={BarChart3} trend="2%" trendUp={true} />
        <StatCard title="Pending Reports" value={mockTeacherStats.pendingReports} icon={Clock} />
      </div>

      <div className="grid grid-cols-1 mb-6">
        <AnalyticsWidget />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Area */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Live Control Panel */}
          <div className="h-auto">
            <LiveControlWidget />
          </div>
          {/* Analytics */}
          <div className="h-auto">
            <TeacherAnalyticsWidget />
          </div>
        </div>

        {/* Sidebar Area */}
        <div className="lg:col-span-1 h-full">
          <TeacherTimetableWidget />
        </div>

        {/* Bottom Full Width */}
        <div className="lg:col-span-3 mb-12">
          <RecentReportsWidget />
        </div>
      </div>
    </div>
  );
};
