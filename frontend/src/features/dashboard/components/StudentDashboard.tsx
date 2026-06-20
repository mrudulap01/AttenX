import React, { useState } from 'react';
import { WelcomeWidget } from './WelcomeWidget';
import { QuickActionsWidget } from './QuickActionsWidget';
import { AttendanceChartWidget } from './AttendanceChartWidget';
import { LecturesWidget } from './LecturesWidget';
import { RecentAttendanceWidget } from './RecentAttendanceWidget';
import { NotificationsWidget } from './NotificationsWidget';
import { QRScannerModal } from './QRScannerModal';
import { FaceRegistrationWizard } from './FaceRegistrationWizard';
import { FaceScannerModal } from './FaceScannerModal';

export const StudentDashboard = () => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isFaceSetupOpen, setIsFaceSetupOpen] = useState(false);
  const [isFaceScannerOpen, setIsFaceScannerOpen] = useState(false);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full min-h-screen">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Student Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Here's your academic overview at a glance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Top Row: Welcome & Quick Actions */}
        <div className="md:col-span-2 xl:col-span-3 min-h-[200px]">
          <WelcomeWidget />
        </div>
        <div className="md:col-span-1 xl:col-span-1 min-h-[200px]">
          <QuickActionsWidget 
            onScanClick={() => setIsScannerOpen(true)} 
            onSetupFaceClick={() => setIsFaceSetupOpen(true)}
            onVerifyFaceClick={() => setIsFaceScannerOpen(true)}
          />
        </div>

        {/* Middle Row: Chart, Lectures & Notifications */}
        <div className="md:col-span-1 xl:col-span-1 h-[320px]">
          <AttendanceChartWidget />
        </div>
        <div className="md:col-span-2 xl:col-span-2 h-[320px]">
          <LecturesWidget />
        </div>
        <div className="md:col-span-3 xl:col-span-1 h-[320px]">
          <NotificationsWidget />
        </div>

        {/* Bottom Row: Recent Attendance */}
        <div className="md:col-span-3 xl:col-span-4 mb-12">
          <RecentAttendanceWidget />
        </div>
      </div>

      <QRScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />
      <FaceRegistrationWizard isOpen={isFaceSetupOpen} onClose={() => setIsFaceSetupOpen(false)} />
      <FaceScannerModal isOpen={isFaceScannerOpen} onClose={() => setIsFaceScannerOpen(false)} />
    </div>
  );
};
