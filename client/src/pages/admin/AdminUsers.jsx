import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';
import { Search, UserCheck, UserX, Shield, ShieldAlert } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const AdminUsers = () => {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Status toggle confirmation
  const [targetUser, setTargetUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers({
        page: currentPage,
        limit: 10,
        search,
        role: roleFilter !== 'all' ? roleFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });

      setUsers(res.data || []);
      setTotalPages(res.pages || 1);
      setTotalItems(res.total || 0);
    } catch (err) {
      toast.error('Failed to load users list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, search, roleFilter, statusFilter]);

  const handleToggleStatus = async () => {
    if (!targetUser) return;
    const newStatus = targetUser.status === 'active' ? 'inactive' : 'active';
    setActionLoading(true);

    try {
      await adminService.updateUserStatus(targetUser.id, newStatus);
      toast.success(`User account ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
      setTargetUser(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user status.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">User Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            View registered students, monitor quiz performance, and manage account statuses
          </p>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Roles</option>
            <option value="user">Students (Users)</option>
            <option value="admin">Administrators</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <TableSkeleton rows={6} cols={7} />
        ) : users.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Name</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4 text-center">Role</th>
                    <th className="py-3.5 px-4">Joined Date</th>
                    <th className="py-3.5 px-4 text-center">Quizzes Taken</th>
                    <th className="py-3.5 px-4 text-center">Avg Score</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => {
                    const isSelf = u.id === currentAdmin?.id;
                    const isActive = u.status === 'active';

                    return (
                      <tr key={u.id} className="hover:bg-slate-50">
                        <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <span>{u.name}</span>
                          {isSelf && (
                            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                              (You)
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">{u.email}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              u.role === 'admin'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">{formatDate(u.createdAt)}</td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                          {u.totalAttempts}
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-indigo-600">
                          {u.avgScore}%
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              isActive
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {isSelf ? (
                            <span className="text-[11px] text-slate-400 italic">Protected</span>
                          ) : (
                            <button
                              onClick={() => setTargetUser(u)}
                              className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors border ${
                                isActive
                                  ? 'text-rose-600 border-rose-200 hover:bg-rose-50'
                                  : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50'
                              }`}
                            >
                              {isActive ? 'Deactivate' : 'Activate'}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-slate-100">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </>
        ) : (
          <div className="p-8">
            <EmptyState
              title="No users found"
              message="No registered users match your search and filter criteria."
            />
          </div>
        )}
      </div>

      {/* Confirmation Dialog for status toggle */}
      <ConfirmDialog
        isOpen={!!targetUser}
        onClose={() => setTargetUser(null)}
        onConfirm={handleToggleStatus}
        title={targetUser?.status === 'active' ? 'Deactivate User Account?' : 'Activate User Account?'}
        message={`Are you sure you want to ${
          targetUser?.status === 'active' ? 'deactivate' : 'reactivate'
        } the account for ${targetUser?.name} (${targetUser?.email})?`}
        confirmText={targetUser?.status === 'active' ? 'Yes, Deactivate' : 'Yes, Activate'}
        variant={targetUser?.status === 'active' ? 'danger' : 'primary'}
        isLoading={actionLoading}
      />
    </div>
  );
};

export default AdminUsers;
