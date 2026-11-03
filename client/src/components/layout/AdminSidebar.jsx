import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Layers,
  HelpCircle,
  Award,
  FolderTree,
  Users,
  LogOut,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Quizzes', path: '/admin/quizzes', icon: Layers },
    { name: 'Questions', path: '/admin/questions', icon: HelpCircle },
    { name: 'Quiz Attempts & Results', path: '/admin/attempts', icon: Award, highlight: true },
    { name: 'Categories', path: '/admin/categories', icon: FolderTree },
    { name: 'Users Management', path: '/admin/users', icon: Users },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Brand header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-base text-white tracking-tight block">
              Quiz<span className="text-indigo-400">Master</span>
            </span>
            <span className="text-[10px] text-indigo-300 font-semibold tracking-wider uppercase block">
              Admin Portal
            </span>
          </div>
        </Link>
      </div>

      {/* Switch to Student Portal button */}
      <div className="px-4 py-2.5 mx-3 my-2 bg-slate-800/80 border border-slate-700/60 rounded-xl">
        <Link
          to="/dashboard"
          className="flex items-center justify-between text-xs font-medium text-slate-300 hover:text-white"
        >
          <span>Student View</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </Link>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 p-3 space-y-1">
        <p className="px-3 pt-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Administration
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
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm shadow-indigo-600/40'
                    : item.highlight
                    ? 'text-indigo-300 hover:bg-slate-800 hover:text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.name}</span>
              {item.highlight && (
                <span className="ml-auto w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Admin user footer & logout */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 mb-2">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-xs shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
            <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 rounded-lg transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out Admin</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
