import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";

import LoginPage from "./pages/LoginPage";
import StudentLayout from "./layouts/StudentLayout";

import StudentOverviewPage from "./pages/student/StudentOverviewPage";
import AcademicProgressPage from "./pages/student/AcademicProgressPage";
import AssignmentsPage from "./pages/student/AssignmentsPage";
import AttendancePage from "./pages/student/AttendancePage";
import TimetablePage from "./pages/student/TimetablePage";
import ExamsPage from "./pages/student/ExamsPage";
import ProgressReportsPage from "./pages/student/ProgressReportsPage";
import ResourcesPage from "./pages/student/ResourcesPage";
import TeachersPage from "./pages/student/TeachersPage";
import MessagesPage from "./pages/student/MessagesPage";
import AnnouncementsPage from "./pages/student/AnnouncementsPage";
import SettingsPage from "./pages/student/SettingsPage";
import CalendarPage from "./pages/student/CalendarPage";
import FeesPage from "./pages/student/FeesPage";
import ScholarshipPage from "./pages/student/ScholarshipPage";
import TransportPage from "./pages/student/TransportPage";
import ProfilePage from "./pages/student/ProfilePage";
import CertificatesPage from "./pages/student/CertificatesPage";
import ClubsPage from "./pages/student/ClubsPage";
import HelpdeskPage from "./pages/student/HelpdeskPage";
import NotificationsPage from "./pages/student/NotificationsPage";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/"
        element={
          <AuthGuard>
            <StudentLayout />
          </AuthGuard>
        }
      >
        <Route index element={<StudentOverviewPage />} />
        <Route path="academic-progress" element={<AcademicProgressPage />} />
        <Route path="assignments" element={<AssignmentsPage />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="timetable" element={<TimetablePage />} />
        <Route path="exams" element={<ExamsPage />} />
        <Route path="progress-reports" element={<ProgressReportsPage />} />
        <Route path="resources" element={<ResourcesPage />} />
        <Route path="teachers" element={<TeachersPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="announcements" element={<AnnouncementsPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="leave" element={<Navigate to="/attendance" replace />} />
        <Route path="fees" element={<FeesPage />} />
        <Route path="scholarship" element={<ScholarshipPage />} />
        <Route path="transport" element={<TransportPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="certificates" element={<CertificatesPage />} />
        <Route path="clubs" element={<ClubsPage />} />
        <Route path="helpdesk" element={<HelpdeskPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        {/* Redirect old feedback route */}
        <Route path="feedback" element={<Navigate to="/helpdesk" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;