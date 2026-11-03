import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';
import { User, Mail, Shield, Calendar, Lock, CheckCircle2 } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be empty.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.updateProfile({ name: name.trim() });
      updateUser(res.user);
      toast.success('Name updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update name.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error('Please fill in current and new password fields.');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await authService.updateProfile({ currentPassword, newPassword });
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white font-black text-2xl flex items-center justify-center shadow-md">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1 font-semibold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200 uppercase tracking-wider text-[10px]">
                <Shield className="w-3 h-3" />
                {user?.role}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Member since {formatDate(user?.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Update Profile Name Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Personal Information</h3>
            <p className="text-xs text-slate-500">Update your display name</p>
          </div>

          <form onSubmit={handleUpdateName} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              icon={User}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="text"
                disabled
                value={user?.email || ''}
                className="block w-full rounded-lg border border-slate-200 bg-slate-50 text-slate-500 text-sm py-2.5 px-3 cursor-not-allowed"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Email addresses are uniquely registered and cannot be changed.
              </p>
            </div>

            <Button type="submit" variant="primary" size="sm" isLoading={loading}>
              Save Name
            </Button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Change Password</h3>
            <p className="text-xs text-slate-500">Ensure your account remains protected</p>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              icon={Lock}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <Input
              label="New Password"
              type="password"
              icon={Lock}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 6 characters"
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              icon={Lock}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              required
            />

            <Button type="submit" variant="outline" size="sm" isLoading={loading}>
              Update Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
