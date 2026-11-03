import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import UserLayout from '../layouts/UserLayout';
import AdminLayout from '../layouts/AdminLayout';

// Route Guards
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

// Public Pages
import LandingPage from '../pages/public/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import UnauthorizedPage from '../pages/public/UnauthorizedPage';
import NotFoundPage from '../pages/public/NotFoundPage';

// User Pages
import UserDashboard from '../pages/user/UserDashboard';
import BrowseQuizzes from '../pages/user/BrowseQuizzes';
import QuizDetails from '../pages/user/QuizDetails';
import LiveQuizAttempt from '../pages/user/LiveQuizAttempt';
import QuizResult from '../pages/user/QuizResult';
import AttemptHistory from '../pages/user/AttemptHistory';
import UserProfile from '../pages/user/UserProfile';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminQuizzes from '../pages/admin/AdminQuizzes';
import AdminQuestions from '../pages/admin/AdminQuestions';
import AdminQuizAttempts from '../pages/admin/AdminQuizAttempts';
import AdminCategories from '../pages/admin/AdminCategories';
import AdminUsers from '../pages/admin/AdminUsers';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages wrapped in PublicLayout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/quizzes" element={<BrowseQuizzes />} />
        <Route path="/quizzes/:id" element={<QuizDetails />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Route>

      {/* Live Quiz Attempt (Distraction-free mode) */}
      <Route
        path="/quizzes/:id/attempt"
        element={
          <ProtectedRoute>
            <LiveQuizAttempt />
          </ProtectedRoute>
        }
      />

      {/* Authenticated User Dashboard Routes */}
      <Route
        element={
          <ProtectedRoute>
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/attempts" element={<AttemptHistory />} />
        <Route path="/attempts/:id" element={<QuizResult />} />
        <Route path="/profile" element={<UserProfile />} />
      </Route>

      {/* Protected Admin Routes */}
      <Route
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/quizzes" element={<AdminQuizzes />} />
        <Route path="/admin/questions" element={<AdminQuestions />} />
        <Route path="/admin/attempts" element={<AdminQuizAttempts />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/users" element={<AdminUsers />} />
      </Route>

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
