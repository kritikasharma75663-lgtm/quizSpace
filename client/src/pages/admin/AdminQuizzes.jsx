import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import QuizFormModal from '../../components/admin/QuizFormModal';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  HelpCircle,
  Clock,
  Award,
  Layers,
  Check,
  X,
} from 'lucide-react';
import { getDifficultyColor } from '../../utils/formatters';

const AdminQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [deletingQuiz, setDeletingQuiz] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const [quizRes, catRes] = await Promise.all([
        adminService.getQuizzes({
          page: currentPage,
          limit: 10,
          search,
          category: categoryFilter !== 'all' ? categoryFilter : undefined,
          difficulty: difficultyFilter !== 'all' ? difficultyFilter : undefined,
        }),
        adminService.getCategories(),
      ]);

      setQuizzes(quizRes.data || []);
      setTotalPages(quizRes.pages || 1);
      setTotalItems(quizRes.total || 0);
      setCategories(catRes.data || []);
    } catch (err) {
      console.error('Failed to load quizzes:', err);
      toast.error('Failed to load quizzes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [currentPage, search, categoryFilter, difficultyFilter]);

  // Create or Update submit
  const handleFormSubmit = async (formData) => {
    setActionLoading(true);
    try {
      if (editingQuiz) {
        await adminService.updateQuiz(editingQuiz._id, formData);
        toast.success('Quiz updated successfully!');
      } else {
        await adminService.createQuiz(formData);
        toast.success('Quiz created successfully!');
      }
      setIsModalOpen(false);
      setEditingQuiz(null);
      fetchQuizzes();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed.');
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle publish status
  const handleTogglePublish = async (quiz) => {
    try {
      await adminService.updateQuiz(quiz._id, { published: !quiz.published });
      toast.success(
        `Quiz ${quiz.published ? 'unpublished' : 'published'} successfully!`
      );
      fetchQuizzes();
    } catch (err) {
      toast.error('Failed to toggle publish status.');
    }
  };

  // Delete quiz
  const handleDeleteQuiz = async () => {
    if (!deletingQuiz) return;
    setActionLoading(true);
    try {
      await adminService.deleteQuiz(deletingQuiz._id);
      toast.success('Quiz and its questions deleted successfully!');
      setDeletingQuiz(null);
      fetchQuizzes();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete quiz.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Quiz Management</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Create, configure, publish, and delete assessments
            </p>
          </div>

          <Button
            variant="primary"
            icon={Plus}
            onClick={() => {
              setEditingQuiz(null);
              setIsModalOpen(true);
            }}
          >
            Create New Quiz
          </Button>
        </div>

        {/* Filter Controls Row */}
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
              placeholder="Search by title..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={difficultyFilter}
            onChange={(e) => {
              setDifficultyFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Quizzes Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <TableSkeleton rows={6} cols={7} />
        ) : quizzes.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Title</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4 text-center">Difficulty</th>
                    <th className="py-3.5 px-4 text-center">Duration</th>
                    <th className="py-3.5 px-4 text-center">Questions</th>
                    <th className="py-3.5 px-4 text-center">Passing</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {quizzes.map((quiz) => (
                    <tr key={quiz._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900 leading-snug">{quiz.title}</p>
                        <p className="text-[11px] text-slate-400 line-clamp-1 max-w-xs mt-0.5">
                          {quiz.description}
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant="primary" size="sm">
                          {quiz.category?.name || 'General'}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getDifficultyColor(
                            quiz.difficulty
                          )}`}
                        >
                          {quiz.difficulty}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center text-slate-700 font-medium">
                        {quiz.duration} mins
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Link
                          to={`/admin/questions?quizId=${quiz._id}`}
                          className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-lg"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>{quiz.questionCount || 0} Qs</span>
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                        {quiz.passingPercentage}%
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleTogglePublish(quiz)}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-colors border ${
                            quiz.published
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {quiz.published ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link to={`/admin/questions?quizId=${quiz._id}`}>
                            <button
                              title="Manage Questions"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            >
                              <HelpCircle className="w-4 h-4" />
                            </button>
                          </Link>
                          <button
                            title="Edit Quiz"
                            onClick={() => {
                              setEditingQuiz(quiz);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            title="Delete Quiz"
                            onClick={() => setDeletingQuiz(quiz)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
              title="No quizzes found"
              message="No quizzes match your filters. Create your first quiz now."
              actionLabel="Create Quiz"
              onAction={() => {
                setEditingQuiz(null);
                setIsModalOpen(true);
              }}
            />
          </div>
        )}
      </div>

      {/* Quiz Form Modal (Create / Edit) */}
      <QuizFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingQuiz(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingQuiz}
        categories={categories}
        isLoading={actionLoading}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingQuiz}
        onClose={() => setDeletingQuiz(null)}
        onConfirm={handleDeleteQuiz}
        title="Delete Quiz?"
        message={`Are you sure you want to delete "${deletingQuiz?.title}"? All associated questions in this quiz will also be permanently deleted from MongoDB.`}
        confirmText="Yes, Delete Quiz"
        isLoading={actionLoading}
      />
    </div>
  );
};

export default AdminQuizzes;
