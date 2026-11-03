import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/layout/AdminSidebar';
import Topbar from '../components/layout/Topbar';

const AdminLayout = () => {
  const location = useLocation();

  const getAdminHeaderInfo = (pathname) => {
    if (pathname.includes('/admin/dashboard')) {
      return { title: 'Admin Overview', subtitle: 'Global platform analytics, user engagement, and performance' };
    }
    if (pathname.includes('/admin/quizzes')) {
      return { title: 'Quiz Management', subtitle: 'Create, update, publish, and delete quizzes' };
    }
    if (pathname.includes('/admin/questions')) {
      return { title: 'Question Bank', subtitle: 'Manage MCQ questions, correct answer options, and explanations' };
    }
    if (pathname.includes('/admin/attempts')) {
      return { title: 'Quiz Attempts & Results', subtitle: 'Authoritative audit log of which user played which quiz and marks scored' };
    }
    if (pathname.includes('/admin/categories')) {
      return { title: 'Category Management', subtitle: 'Manage subject categories and icons' };
    }
    if (pathname.includes('/admin/users')) {
      return { title: 'User Management', subtitle: 'View registered users, track progress, and manage account statuses' };
    }
    return { title: 'Admin Console', subtitle: 'Platform control center' };
  };

  const { title, subtitle } = getAdminHeaderInfo(location.pathname);

  return (
    <div className="min-h-screen flex bg-slate-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title={title} subtitle={subtitle} isAdmin={true} />
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
