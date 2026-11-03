import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { quizService } from '../../services/quizService';
import { attemptService } from '../../services/attemptService';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import {
  Clock,
  HelpCircle,
  Award,
  Play,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
} from 'lucide-react';
import { getDifficultyColor, formatDate } from '../../utils/formatters';

const QuizDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userHistory, setUserHistory] = useState([]);

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const [quizRes, historyRes] = await Promise.all([
          quizService.getQuizById(id),
          attemptService.getMyHistory({ limit: 10 }),
        ]);

        setQuiz(quizRes.data);
        const filtered = (historyRes.data || []).filter(
          (a) => a.quiz?._id === id || a.quiz === id
        );
        setUserHistory(filtered);
      } catch (err) {
        console.error('Error fetching quiz details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-32"></div>
        <div className="h-40 bg-white rounded-2xl border border-slate-200"></div>
        <div className="h-64 bg-white rounded-2xl border border-slate-200"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800">Quiz not found</h3>
        <p className="text-xs text-slate-500 mt-1">This quiz is not currently available.</p>
        <Link to="/quizzes" className="inline-block mt-4">
          <Button variant="outline" size="sm" icon={ArrowLeft}>
            Back to Quizzes
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/quizzes"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Quizzes</span>
        </Link>
      </div>

      {/* Hero Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="primary">{quiz.category?.name || 'General'}</Badge>
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getDifficultyColor(
              quiz.difficulty
            )}`}
          >
            {quiz.difficulty} Level
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
          {quiz.title}
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">{quiz.description}</p>

        {/* Highlighted metrics */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-center mb-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Duration
            </span>
            <div className="flex items-center justify-center gap-1.5 text-base font-bold text-slate-800 mt-1">
              <Clock className="w-4 h-4 text-brand-600" />
              <span>{quiz.duration} Minutes</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Total Questions
            </span>
            <div className="flex items-center justify-center gap-1.5 text-base font-bold text-slate-800 mt-1">
              <HelpCircle className="w-4 h-4 text-brand-600" />
              <span>{quiz.questionCount || 10} Questions</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Passing Grade
            </span>
            <div className="flex items-center justify-center gap-1.5 text-base font-bold text-slate-800 mt-1">
              <Award className="w-4 h-4 text-brand-600" />
              <span>{quiz.passingPercentage}% Minimum</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link to={`/quizzes/${quiz._id}/attempt`} className="w-full sm:w-auto">
            <Button size="lg" icon={Play} className="w-full sm:w-auto px-8 font-bold">
              Start Quiz Attempt Now
            </Button>
          </Link>
        </div>
      </div>

      {/* Assessment Guidelines */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-brand-600" />
          <span>Rules and Assessment Guidelines</span>
        </h3>

        <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Countdown Timer:</strong> Once you press Start, the {quiz.duration}-minute timer will begin immediately.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Navigation:</strong> You can skip questions and jump between questions anytime before final submission.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Auto-Submission:</strong> If the timer expires before you submit, your answered questions will be automatically finalized and scored authoritatively by the server.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Explanations:</strong> Comprehensive answer keys and educational explanations will become available immediately on your result page upon completion.
            </span>
          </li>
        </ul>
      </div>

      {/* User's Previous Attempts on this Quiz */}
      {userHistory.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Your Previous Attempts on this Quiz</h3>
          <div className="divide-y divide-slate-100 text-xs">
            {userHistory.map((att) => (
              <div key={att._id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{formatDate(att.createdAt)}</p>
                  <span className="text-slate-400">Time spent: {Math.floor(att.timeTaken / 60)}m {att.timeTaken % 60}s</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-800">
                    {att.score} / {att.totalMarks} ({att.percentage}%)
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      att.passed
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {att.passed ? 'PASSED' : 'FAILED'}
                  </span>
                  <Link to={`/attempts/${att._id}`}>
                    <Button variant="ghost" size="sm" className="text-brand-600">
                      View Result
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizDetails;
