import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import CategoryBarChart from '../../components/charts/CategoryBarChart';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import {
  Users,
  Layers,
  HelpCircle,
  Award,
  TrendingUp,
  FolderTree,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await adminService.getDashboard();
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 bg-white rounded-xl border border-slate-200 animate-pulse"></div>
          ))}
        </div>
        <div className="h-64 bg-white rounded-xl border border-slate-200 animate-pulse"></div>
        <TableSkeleton rows={5} cols={5} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 6 Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          subtitle="Registered learners"
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Total Quizzes"
          value={stats?.totalQuizzes || 0}
          subtitle="In assessment catalog"
          icon={Layers}
          color="violet"
        />
        <StatCard
          title="Published Quizzes"
          value={stats?.totalPublishedQuizzes || 0}
          subtitle="Active for testing"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Total Questions"
          value={stats?.totalQuestions || 0}
          subtitle="In authorized bank"
          icon={HelpCircle}
          color="amber"
        />
        <StatCard
          title="Quiz Attempts"
          value={stats?.totalAttempts || 0}
          subtitle="Recorded player runs"
          icon={Award}
          color="rose"
        />
        <StatCard
          title="Avg Platform Score"
          value={`${stats?.avgPlatformScore || 0}%`}
          subtitle="Completed pass rate"
          icon={TrendingUp}
          color="indigo"
        />
      </div>

      {/* Chart & Popular Quizzes Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Distribution Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Quiz Distribution by Category</h3>
              <p className="text-xs text-slate-500">Number of active quizzes in each academic domain</p>
            </div>
            <Link to="/admin/categories" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
              Manage &rarr;
            </Link>
          </div>
          <CategoryBarChart data={stats?.categoryStats || []} />
        </div>

        {/* Most Popular Quizzes */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Most Attempted Quizzes</h3>
          <p className="text-xs text-slate-500 mb-4">Ranked by total student attempts</p>

          <div className="space-y-3 flex-1">
            {stats?.popularQuizzes && stats.popularQuizzes.length > 0 ? (
              stats.popularQuizzes.map((quiz, idx) => (
                <div
                  key={quiz._id || idx}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-semibold text-slate-800 truncate">{quiz.title}</p>
                    <span className="text-[11px] text-slate-400">
                      Avg Score: {quiz.avgPercentage || 0}%
                    </span>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="font-bold text-indigo-600 px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100">
                      {quiz.attemptsCount} attempts
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">No attempt statistics recorded yet.</p>
            )}
          </div>

          <Link to="/admin/attempts" className="mt-4 pt-3 border-t border-slate-100">
            <Button variant="ghost" size="sm" className="w-full text-xs">
              View All Attempts &rarr;
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Attempts & User Registrations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Attempts Table */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Quiz Attempts</h3>
              <p className="text-xs text-slate-500">Live student test submissions</p>
            </div>
            <Link to="/admin/attempts">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">Student</th>
                  <th className="py-2.5 px-3">Quiz</th>
                  <th className="py-2.5 px-3 text-center">Score</th>
                  <th className="py-2.5 px-3 text-center">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats?.recentAttempts?.map((att) => (
                  <tr key={att._id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3">
                      <p className="font-semibold text-slate-800">{att.user?.name || 'User'}</p>
                      <p className="text-[10px] text-slate-400">{att.user?.email}</p>
                    </td>
                    <td className="py-2.5 px-3 max-w-[140px] truncate text-slate-700 font-medium">
                      {att.quiz?.title || 'Quiz'}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-800">
                      {att.score}/{att.totalMarks} ({att.percentage}%)
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          att.passed
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {att.passed ? 'PASS' : 'FAIL'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent User Registrations */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent User Registrations</h3>
              <p className="text-xs text-slate-500">Newly enrolled students</p>
            </div>
            <Link to="/admin/users">
              <Button variant="outline" size="sm">
                Manage Users
              </Button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">Joined</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats?.recentUsers?.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{u.name}</td>
                    <td className="py-2.5 px-3 text-slate-500">{u.email}</td>
                    <td className="py-2.5 px-3 text-slate-400">{formatDate(u.createdAt)}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
