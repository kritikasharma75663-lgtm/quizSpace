import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import AttemptDetailModal from '../../components/admin/AttemptDetailModal';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';
import {
  Search,
  Download,
  Eye,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  Award,
  Calendar,
} from 'lucide-react';
import { formatDate, formatDuration, getDifficultyColor, getAttemptStatusBadge } from '../../utils/formatters';

const AdminQuizAttempts = () => {
  const [attempts, setAttempts] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [quizFilter, setQuizFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [passFilter, setPassFilter] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Detail Modal state
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  // Fetch quizzes and categories for filter dropdowns
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [qRes, cRes] = await Promise.all([
          adminService.getQuizzes({ limit: 50 }),
          adminService.getCategories(),
        ]);
        setQuizzes(qRes.data || []);
        setCategories(cRes.data || []);
      } catch (err) {
        console.error('Failed to load filter dropdowns:', err);
      }
    };
    fetchDropdowns();
  }, []);

  // Fetch attempts with full filters from API
  const fetchAttempts = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        search,
        quizId: quizFilter !== 'all' ? quizFilter : undefined,
        categoryId: categoryFilter !== 'all' ? categoryFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        passed: passFilter !== 'all' ? passFilter : undefined,
        sortBy,
      };

      const res = await adminService.getAllAttempts(params);
      setAttempts(res.data || []);
      setTotalPages(res.pages || 1);
      setTotalItems(res.total || 0);
    } catch (err) {
      toast.error('Failed to load quiz attempts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttempts();
  }, [currentPage, search, quizFilter, categoryFilter, statusFilter, passFilter, sortBy]);

  // View detailed attempt audit modal
  const handleViewAttempt = async (attemptId) => {
    setDetailLoading(true);
    try {
      const res = await adminService.getAttemptDetail(attemptId);
      setSelectedAttempt(res.data);
    } catch (err) {
      toast.error('Failed to load attempt breakdown.');
    } finally {
      setDetailLoading(false);
    }
  };

  // Export CSV
  const handleExportCSV = async () => {
    setExportLoading(true);
    try {
      const blob = await adminService.exportAttemptsCSV();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `quizmaster_attempts_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Attempts CSV exported successfully!');
    } catch (err) {
      toast.error('Failed to export CSV report.');
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Export */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Quiz Attempts & Results
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Authoritative audit ledger: track which student attempted which quiz and marks scored
            </p>
          </div>

          <Button
            variant="outline"
            icon={Download}
            onClick={handleExportCSV}
            isLoading={exportLoading}
            className="border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold"
          >
            Export Results (CSV)
          </Button>
        </div>

        {/* Search & Comprehensive Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 pt-3 border-t border-slate-100 text-xs">
          {/* Search bar */}
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search student name, email, or quiz title..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Quiz filter */}
          <select
            value={quizFilter}
            onChange={(e) => {
              setQuizFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="py-2 px-3 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Quizzes</option>
            {quizzes.map((q) => (
              <option key={q._id} value={q._id}>
                {q.title}
              </option>
            ))}
          </select>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="py-2 px-3 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Result Pass/Fail filter */}
          <select
            value={passFilter}
            onChange={(e) => {
              setPassFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="py-2 px-3 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Outcomes</option>
            <option value="true">Passed Only</option>
            <option value="false">Failed Only</option>
          </select>

          {/* Sort selector */}
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
            }}
            className="py-2 px-3 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="latest">Sort: Latest Attempts</option>
            <option value="highest_score">Sort: Highest Score</option>
            <option value="lowest_score">Sort: Lowest Score</option>
            <option value="oldest">Sort: Oldest First</option>
          </select>
        </div>
      </div>

      {/* Main Table with all required columns */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <TableSkeleton rows={8} cols={9} />
        ) : attempts.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-3">Attempt ID</th>
                    <th className="py-3.5 px-3">Student Name & Email</th>
                    <th className="py-3.5 px-3">Quiz Title</th>
                    <th className="py-3.5 px-3">Category</th>
                    <th className="py-3.5 px-3 text-center">Difficulty</th>
                    <th className="py-3.5 px-3">Completed At</th>
                    <th className="py-3.5 px-3 text-center">Questions</th>
                    <th className="py-3.5 px-3 text-center">Correct</th>
                    <th className="py-3.5 px-3 text-center">Incorrect</th>
                    <th className="py-3.5 px-3 text-center">Unanswered</th>
                    <th className="py-3.5 px-3 text-center">Marks Scored</th>
                    <th className="py-3.5 px-3 text-center">Score %</th>
                    <th className="py-3.5 px-3 text-center">Time Taken</th>
                    <th className="py-3.5 px-3 text-center">Result</th>
                    <th className="py-3.5 px-3 text-center">Status</th>
                    <th className="py-3.5 px-3 text-right">Breakdown</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attempts.map((att) => (
                    <tr key={att._id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Attempt ID */}
                      <td className="py-3 px-3 font-mono text-[10px] text-slate-400">
                        {att._id.substring(att._id.length - 8)}
                      </td>

                      {/* Student Name & Email */}
                      <td className="py-3 px-3">
                        <p className="font-bold text-slate-900">{att.user?.name || 'Unknown'}</p>
                        <p className="text-[11px] text-slate-400">{att.user?.email}</p>
                      </td>

                      {/* Quiz Title */}
                      <td className="py-3 px-3 max-w-[200px] truncate font-semibold text-slate-800">
                        {att.quiz?.title || 'Quiz'}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3">
                        <Badge variant="primary" size="sm">
                          {att.quiz?.category?.name || 'General'}
                        </Badge>
                      </td>

                      {/* Difficulty */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getDifficultyColor(
                            att.quiz?.difficulty
                          )}`}
                        >
                          {att.quiz?.difficulty || 'Medium'}
                        </span>
                      </td>

                      {/* Completed At */}
                      <td className="py-3 px-3 text-slate-500">
                        {formatDate(att.submittedAt || att.createdAt)}
                      </td>

                      {/* Total Questions */}
                      <td className="py-3 px-3 text-center font-medium text-slate-700">
                        {att.totalMarks}
                      </td>

                      {/* Correct */}
                      <td className="py-3 px-3 text-center font-bold text-emerald-600">
                        {att.correctCount}
                      </td>

                      {/* Incorrect */}
                      <td className="py-3 px-3 text-center font-bold text-rose-600">
                        {att.incorrectCount}
                      </td>

                      {/* Unanswered */}
                      <td className="py-3 px-3 text-center text-slate-400 font-medium">
                        {att.unansweredCount}
                      </td>

                      {/* Marks Obtained / Max Marks */}
                      <td className="py-3 px-3 text-center font-extrabold text-slate-900">
                        {att.score} <span className="text-[10px] font-normal text-slate-400">/ {att.totalMarks}</span>
                      </td>

                      {/* Score % */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`font-black text-sm ${
                            att.passed ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {att.percentage}%
                        </span>
                      </td>

                      {/* Time Taken */}
                      <td className="py-3 px-3 text-center text-slate-600 font-medium">
                        {formatDuration(att.timeTaken)}
                      </td>

                      {/* Pass / Fail status */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                            att.passed
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {att.passed ? 'PASSED' : 'FAILED'}
                        </span>
                      </td>

                      {/* Attempt Status */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getAttemptStatusBadge(
                            att.status
                          )}`}
                        >
                          {att.status}
                        </span>
                      </td>

                      {/* Detailed View Action */}
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleViewAttempt(att._id)}
                          className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors border border-indigo-200"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Audit</span>
                        </button>
                      </td>
                    </tr>
                  ))}
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
              title="No quiz attempts recorded"
              message="No student test submissions match the selected filters."
            />
          </div>
        )}
      </div>

      {/* Attempt Breakdown Detail Modal */}
      <AttemptDetailModal
        isOpen={!!selectedAttempt}
        onClose={() => setSelectedAttempt(null)}
        attempt={selectedAttempt}
      />
    </div>
  );
};

export default AdminQuizAttempts;
