import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import QuestionFormModal from '../../components/admin/QuestionFormModal';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  HelpCircle,
  Layers,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { getDifficultyColor } from '../../utils/formatters';

const AdminQuestions = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuizId = searchParams.get('quizId') || '';

  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState(initialQuizId);
  const [questions, setQuestions] = useState([]);
  const [selectedQuizInfo, setSelectedQuizInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [deletingQuestion, setDeletingQuestion] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch all quizzes for the selector dropdown
  useEffect(() => {
    const fetchQuizzesList = async () => {
      try {
        const res = await adminService.getQuizzes({ limit: 50 });
        const quizList = res.data || [];
        setQuizzes(quizList);

        if (!selectedQuizId && quizList.length > 0) {
          setSelectedQuizId(quizList[0]._id);
        }
      } catch (err) {
        console.error('Failed to load quizzes list:', err);
      }
    };
    fetchQuizzesList();
  }, []);

  // Fetch questions for selected quiz
  const fetchQuestions = async (quizId) => {
    if (!quizId) return;
    setLoading(true);
    try {
      const res = await adminService.getQuestions(quizId);
      setQuestions(res.data || []);
      setSelectedQuizInfo(res.quiz);
    } catch (err) {
      console.error('Failed to fetch questions:', err);
      toast.error('Failed to fetch questions for this quiz.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedQuizId) {
      fetchQuestions(selectedQuizId);
      setSearchParams({ quizId: selectedQuizId });
    }
  }, [selectedQuizId]);

  // Create or Update Question
  const handleFormSubmit = async (formData) => {
    setActionLoading(true);
    try {
      if (editingQuestion) {
        await adminService.updateQuestion(editingQuestion._id, formData);
        toast.success('Question updated in MongoDB successfully!');
      } else {
        await adminService.createQuestion(selectedQuizId, formData);
        toast.success('Question added to MongoDB successfully!');
      }
      setIsModalOpen(false);
      setEditingQuestion(null);
      fetchQuestions(selectedQuizId);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save question.');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Question
  const handleDeleteQuestion = async () => {
    if (!deletingQuestion) return;
    setActionLoading(true);
    try {
      await adminService.deleteQuestion(deletingQuestion._id);
      toast.success('Question deleted from MongoDB successfully!');
      setDeletingQuestion(null);
      fetchQuestions(selectedQuizId);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete question.');
    } finally {
      setActionLoading(false);
    }
  };

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="space-y-6">
      {/* Quiz Selector and Actions Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Question Bank</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Create, view, and manage MCQ options and correct keys stored in MongoDB
            </p>
          </div>

          <Button
            variant="primary"
            icon={Plus}
            disabled={!selectedQuizId}
            onClick={() => {
              setEditingQuestion(null);
              setIsModalOpen(true);
            }}
          >
            Add Question to Quiz
          </Button>
        </div>

        {/* Quiz Selector Dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2 flex-1 max-w-lg">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider shrink-0">
              Select Quiz:
            </span>
            <select
              value={selectedQuizId}
              onChange={(e) => setSelectedQuizId(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-xl border border-slate-300 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {quizzes.map((q) => (
                <option key={q._id} value={q._id}>
                  {q.title} ({q.questionCount || 0} questions)
                </option>
              ))}
            </select>
          </div>

          {selectedQuizInfo && (
            <div className="flex items-center gap-2 text-xs">
              <Badge variant="primary">{selectedQuizInfo.category || 'General'}</Badge>
              <span className="text-slate-500">
                Difficulty: <strong>{selectedQuizInfo.difficulty}</strong>
              </span>
              <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
                {questions.length} Total Questions
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Questions List */}
      {loading ? (
        <TableSkeleton rows={5} cols={4} />
      ) : questions.length > 0 ? (
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div
              key={q._id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {q.questionText}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getDifficultyColor(
                          q.difficulty
                        )}`}
                      >
                        {q.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    title="Edit Question"
                    onClick={() => {
                      setEditingQuestion(q);
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    title="Delete Question"
                    onClick={() => setDeletingQuestion(q)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 4 Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                {q.options?.map((opt, optIdx) => {
                  const isCorrect = q.correctAnswer === optIdx;
                  return (
                    <div
                      key={optIdx}
                      className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                        isCorrect
                          ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900 font-semibold ring-1 ring-emerald-400'
                          : 'bg-slate-50/60 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-white text-slate-700 flex items-center justify-center font-bold text-[11px] shrink-0 border border-slate-200">
                          {optionLetters[optIdx]}
                        </span>
                        <span>{opt}</span>
                      </div>

                      {isCorrect && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                          <CheckCircle2 className="w-3 h-3" /> Correct Key
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explanation note */}
              {q.explanation && (
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  <span className="font-bold text-slate-700">Explanation: </span>
                  {q.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <EmptyState
            title="No questions in this quiz yet"
            message="Add questions using the button above. Questions are saved to MongoDB and immediately become active for student attempts."
            actionLabel="Add First Question"
            onAction={() => {
              setEditingQuestion(null);
              setIsModalOpen(true);
            }}
          />
        </div>
      )}

      {/* Question Form Modal */}
      <QuestionFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingQuestion(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingQuestion}
        quizTitle={selectedQuizInfo?.title}
        isLoading={actionLoading}
      />

      {/* Delete Question Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingQuestion}
        onClose={() => setDeletingQuestion(null)}
        onConfirm={handleDeleteQuestion}
        title="Delete Question?"
        message={`Are you sure you want to permanently delete this question from MongoDB?`}
        confirmText="Yes, Delete Question"
        isLoading={actionLoading}
      />
    </div>
  );
};

export default AdminQuestions;
