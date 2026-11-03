import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { attemptService } from '../../services/attemptService';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { formatDate, formatDuration, getDifficultyColor } from '../../utils/formatters';
import { History, Award, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

const AttemptHistory = () => {
  const [attempts, setAttempts] = useState([]);
  const [filterPassed, setFilterPassed] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: 10,
          passed: filterPassed !== 'all' ? filterPassed : undefined,
        };

        const res = await attemptService.getMyHistory(params);
        setAttempts(res.data || []);
        setTotalPages(res.pages || 1);
        setTotalItems(res.total || 0);
      } catch (err) {
        console.error('Failed to fetch history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [currentPage, filterPassed]);

  return (
    <div className="space-y-6">
      {/* Header and Filter Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Attempt History</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit log of all your completed and evaluated quizzes
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Filter:</span>
          {['all', 'true', 'false'].map((filterVal) => {
            const labels = { all: 'All Attempts', true: 'Passed', false: 'Failed' };
            const isActive = filterPassed === filterVal;
            return (
              <button
                key={filterVal}
                onClick={() => {
                  setFilterPassed(filterVal);
                  setCurrentPage(1);
                }}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors border ${
                  isActive
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {labels[filterVal]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <TableSkeleton rows={6} cols={6} />
        ) : attempts.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Quiz Title</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4 text-center">Difficulty</th>
                    <th className="py-3.5 px-4">Date Completed</th>
                    <th className="py-3.5 px-4 text-center">Marks</th>
                    <th className="py-3.5 px-4 text-center">Percentage</th>
                    <th className="py-3.5 px-4 text-center">Result</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attempts.map((att) => (
                    <tr key={att._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {att.quiz?.title || 'Assessment'}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant="primary" size="sm">
                          {att.quiz?.category?.name || 'General'}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getDifficultyColor(
                            att.quiz?.difficulty
                          )}`}
                        >
                          {att.quiz?.difficulty || 'Medium'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {formatDate(att.submittedAt || att.createdAt)}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                        {att.score} / {att.totalMarks}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`font-black ${
                            att.passed ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {att.percentage}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            att.passed
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {att.passed ? 'PASSED' : 'FAILED'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link to={`/attempts/${att._id}`}>
                          <Button variant="outline" size="sm">
                            View Result
                          </Button>
                        </Link>
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
              title="No attempts found"
              message="You haven't completed any assessments matching the selected filter."
              actionLabel="Browse Quizzes"
              onAction={() => window.location.assign('/quizzes')}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AttemptHistory;
