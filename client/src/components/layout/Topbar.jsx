import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, User, Check, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Topbar = ({ title, subtitle, isAdmin = false }) => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'Welcome to QuizMaster!', time: 'Just now', unread: true },
    { id: 2, title: 'New quiz added: Python Fundamentals', time: '1 hour ago', unread: false },
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h1 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-600"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">Notifications</span>
                <span className="text-[10px] text-brand-600 font-semibold cursor-pointer">
                  Mark all read
                </span>
              </div>
              <div className="divide-y divide-slate-100 mt-1 max-h-60 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="py-2 px-1 hover:bg-slate-50 rounded text-xs">
                    <p className="font-medium text-slate-800">{n.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User status badge */}
        <Link
          to={isAdmin ? '/admin/dashboard' : '/profile'}
          className="flex items-center gap-2.5 pl-3 border-l border-slate-200 hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-500 text-white font-bold flex items-center justify-center text-xs shadow-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-900 leading-none">{user?.name}</p>
            <span className="text-[10px] font-medium text-slate-500 capitalize flex items-center gap-1 mt-0.5">
              {isAdmin ? (
                <>
                  <Shield className="w-2.5 h-2.5 text-amber-500" />
                  <span>Admin</span>
                </>
              ) : (
                'Student'
              )}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Topbar;
