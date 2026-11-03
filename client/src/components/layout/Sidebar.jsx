import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Compass,
  History,
  User,
  LogOut,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';

const Sidebar = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Browse Quizzes', path: '/quizzes', icon: Compass },
    { name: 'Attempt History', path: '/attempts', icon: History },
    { name: 'My Profile', path: '/profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Brand header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-sm shadow-brand-500/30">
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="font-bold text-lg text-slate-900 tracking-tight">
            Quiz<span className="text-brand-600">Master</span>
          </span>
        </Link>
      </div>

      {/* Admin Quick Switch (if current user has admin role) */}
      {isAdmin && (
        <div className="px-4 py-3 mx-3 my-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Admin Mode</span>
            </div>
            <Link
              to="/admin/dashboard"
              className="text-[11px] font-bold text-amber-900 hover:text-amber-700 underline"
            >
              Open Panel &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* Navigation links */}
      <nav className="flex-1 p-3 space-y-1">
        <p className="px-3 pt-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          User Menu
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User profile footer info & logout */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-white border border-slate-200/80 mb-2">
          <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-900 truncate">{user?.name}</p>
            <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-lg transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
