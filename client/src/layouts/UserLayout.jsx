import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';

const UserLayout = () => {
  const location = useLocation();

  // Helper to determine title based on path
  const getHeaderInfo = (pathname) => {
    if (pathname.includes('/dashboard')) {
      return { title: 'User Dashboard', subtitle: 'Overview of your learning progress and quiz statistics' };
    }
    if (pathname.includes('/quizzes')) {
      return { title: 'Browse Quizzes', subtitle: 'Explore available topic assessments across difficulty levels' };
    }
    if (pathname.includes('/attempts')) {
      return { title: 'Attempt History', subtitle: 'Review your past quiz performances and scoring records' };
    }
    if (pathname.includes('/profile')) {
      return { title: 'My Profile', subtitle: 'Manage your personal details and account credentials' };
    }
    return { title: 'QuizMaster', subtitle: 'Online Quiz Platform' };
  };

  const { title, subtitle } = getHeaderInfo(location.pathname);

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title={title} subtitle={subtitle} />
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
