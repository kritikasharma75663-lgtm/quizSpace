import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { attemptService } from '../../services/attemptService';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Award,
  RotateCcw,
  LayoutDashboard,
  History,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { formatDuration, formatDate } from '../../utils/formatters';

const QuizResult = () => {
  const { id: attemptId } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await attemptService.getAttemptResult(attemptId);
        setAttempt(res.data);
      } catch (err) {
        console.error('Error fetching attempt result:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [attemptId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-44 bg-white rounded-2xl border border-slate-200"></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-20 bg-white rounded-xl"></div>
          <div className="h-20 bg-white rounded-xl"></div>
          <div className="h-20 bg-white rounded-xl"></div>
        </div>
        <div className="h-96 bg-white rounded-2xl"></div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="max-w-md mx-auto text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-900">Attempt Result Not Found</h3>
        <p className="text-xs text-slate-500 mt-1">We couldn't locate this assessment result.</p>
        <Link to="/dashboard" className="inline-block mt-4">
          <Button variant="primary" size="sm">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Result Hero Banner */}
      <div
        className={`rounded-2xl border p-6 sm:p-8 text-center relative overflow-hidden shadow-sm ${
          attempt.passed
            ? 'bg-gradient-to-b from-emerald-500/10 via-white to-slate-50 border-emerald-200'
            : 'bg-gradient-to-b from-rose-500/10 via-white to-slate-50 border-rose-200'
        }`}
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 shadow-sm border ${attempt.passed ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-rose-100 text-rose-800 border-rose-200'}">
          {attempt.passed ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Assessment Passed</span>
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>Did Not Pass (Retake Recommended)</span>
            </>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {attempt.quiz?.title || 'Quiz Assessment'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Completed on {formatDate(attempt.submittedAt || attempt.createdAt)} • Time Spent:{' '}
          <strong>{formatDuration(attempt.timeTaken)}</strong>
        </p>

        {/* Score dial display */}
        <div className="my-6 inline-flex flex-col items-center justify-center w-36 h-36 rounded-full border-4 shadow-inner bg-white ${attempt.passed ? 'border-emerald-500 text-emerald-600' : 'border-rose-500 text-rose-600'}">
          <span className="text-3xl font-black">{attempt.percentage}%</span>
          <span className="text-xs font-bold text-slate-500 mt-0.5">
            {attempt.score} / {attempt.totalMarks} Marks
          </span>
        </div>

        {/* Passing requirement note */}
        <p className="text-xs text-slate-600 max-w-sm mx-auto">
          Passing threshold was <strong>{attempt.quiz?.passingPercentage || 60}%</strong>. You scored{' '}
          <strong>{attempt.percentage}%</strong>.
        </p>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6 pt-6 border-t border-slate-200/60">
          <Link to={`/quizzes/${attempt.quiz?._id}/attempt`}>
            <Button variant="primary" size="md" icon={RotateCcw}>
              Retake Quiz
            </Button>
          </Link>
          <Link to="/attempts">
            <Button variant="outline" size="md" icon={History}>
              Attempt History
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="ghost" size="md" icon={LayoutDashboard}>
              Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics breakdown */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Correct Answers
          </span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{attempt.correctCount}</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Incorrect Answers
          </span>
          <p className="text-2xl font-black text-rose-600 mt-1">{attempt.incorrectCount}</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Unanswered Questions
          </span>
          <p className="text-2xl font-black text-slate-500 mt-1">{attempt.unansweredCount}</p>
        </div>
      </div>

      {/* Question-by-Question Review with Explanations */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Detailed Question Review & Explanations
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Review your answers, see the correct solutions, and read comprehensive explanations.
          </p>
        </div>

        <div className="space-y-6">
          {attempt.snapshot?.map((item, idx) => {
            const wasAnswered = item.selectedOption !== null && item.selectedOption !== undefined;
            const isCorrect = item.isCorrect;

            return (
              <div
                key={idx}
                className={`p-5 rounded-xl border transition-all ${
                  !wasAnswered
                    ? 'border-slate-200 bg-white'
                    : isCorrect
                    ? 'border-emerald-200 bg-emerald-50/10'
                    : 'border-rose-200 bg-rose-50/10'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-2.5">
                    <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      Q{idx + 1}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {item.questionText}
                    </h3>
                  </div>

                  {/* Result label */}
                  <div>
                    {!wasAnswered ? (
                      <Badge variant="neutral" size="sm">
                        Unanswered
                      </Badge>
                    ) : isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+1)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
                        <XCircle className="w-3.5 h-3.5" /> Incorrect (0)
                      </span>
                    )}
                  </div>
                </div>

                {/* Options display */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4 text-xs">
                  {item.options?.map((opt, optIdx) => {
                    const isStudentChoice = item.selectedOption === optIdx;
                    const isTheCorrectOption = item.correctAnswer === optIdx;

                    let optClass = 'bg-white border-slate-200 text-slate-700';
                    if (isTheCorrectOption) {
                      optClass =
                        'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold ring-1 ring-emerald-400';
                    } else if (isStudentChoice && !isCorrect) {
                      optClass =
                        'bg-rose-50 border-rose-300 text-rose-900 font-semibold ring-1 ring-rose-400 line-through';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${optClass}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                            {optionLetters[optIdx]}
                          </span>
                          <span className="leading-relaxed">{opt}</span>
                        </div>

                        <div className="shrink-0 flex items-center gap-1 text-[10px]">
                          {isStudentChoice && (
                            <span className="bg-slate-800 text-white px-2 py-0.5 rounded font-semibold">
                              Your Answer
                            </span>
                          )}
                          {isTheCorrectOption && (
                            <span className="bg-emerald-600 text-white px-2 py-0.5 rounded font-semibold">
                              Correct Key
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Educational Explanation Box */}
                {item.explanation && (
                  <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                    <span className="font-bold text-brand-700 block mb-0.5">
                      Educational Explanation:
                    </span>
                    {item.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
