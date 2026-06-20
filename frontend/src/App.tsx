import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './features/auth/components/LoginForm';
import { SignupForm } from './features/auth/components/SignupForm';
import { ForgotPasswordForm } from './features/auth/components/ForgotPasswordForm';
import { ResetPasswordForm } from './features/auth/components/ResetPasswordForm';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { StudentDashboard } from './features/dashboard/components/StudentDashboard';
import { TeacherDashboard } from './features/dashboard/components/TeacherDashboard';
import { AdminDashboard } from './features/dashboard/components/AdminDashboard';
import { useOfflineSync } from './utils/useOfflineSync';

function App() {
  useOfflineSync();
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/reset-password" element={<ResetPasswordForm />} />

          <Route path="/student" element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/teacher" element={
            <ProtectedRoute>
              <TeacherDashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
