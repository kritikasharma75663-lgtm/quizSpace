import React from 'react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import Button from '../common/Button';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  User,
  Award,
  Calendar,
} from 'lucide-react';
import { formatDate, formatDuration } from '../../utils/formatters';

const AttemptDetailModal = ({ isOpen, onClose, attempt }) => {
  if (!attempt) return null;

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detailed Quiz Attempt Audit"
      subtitle={`Attempt ID: ${attempt._id}`}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Candidate & Quiz Header Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <User className="w-3.5 h-3.5 text-brand-600" />
                <span className="font-semibold uppercase tracking-wider">Candidate</span>
              </div>
              <p className="text-base font-bold text-slate-900">{attempt.user?.name}</p>
              <p className="text-xs text-slate-500">{attempt.user?.email}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <Award className="w-3.5 h-3.5 text-brand-600" />
                <span className="font-semibold uppercase tracking-wider">Quiz Assessment</span>
              </div>
              <p className="text-base font-bold text-slate-900">{attempt.quiz?.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="primary" size="sm">
                  {attempt.quiz?.category?.name || 'General'}
                </Badge>
                <span className="text-xs text-slate-500">
                  Difficulty: <strong className="text-slate-700">{attempt.quiz?.difficulty}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Metrics summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-200">
            <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Marks</span>
              <p className="text-lg font-extrabold text-slate-900 mt-0.5">
                {attempt.score} <span className="text-xs text-slate-400">/ {attempt.totalMarks}</span>
              </p>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Score</span>
              <p
                className={`text-lg font-extrabold mt-0.5 ${
                  attempt.passed ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {attempt.percentage}%
              </p>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Result</span>
              <span
                className={`inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                  attempt.passed
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {attempt.passed ? 'PASSED' : 'FAILED'}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Time Spent</span>
              <p className="text-sm font-bold text-slate-800 mt-1">
                {formatDuration(attempt.timeTaken)}
              </p>
            </div>
          </div>
        </div>

        {/* Question-by-Question Audit */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
            <span>Question Breakdown & Historical Answers</span>
            <span className="text-xs font-normal text-slate-500">
              {attempt.correctCount} Correct • {attempt.incorrectCount} Incorrect •{' '}
              {attempt.unansweredCount} Unanswered
            </span>
          </h4>

          <div className="space-y-4">
            {attempt.snapshot && attempt.snapshot.length > 0 ? (
              attempt.snapshot.map((item, idx) => {
                const wasAnswered = item.selectedOption !== null && item.selectedOption !== undefined;
                const isCorrect = item.isCorrect;

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border ${
                      !wasAnswered
                        ? 'border-slate-200 bg-white'
                        : isCorrect
                        ? 'border-emerald-200 bg-emerald-50/20'
                        : 'border-rose-200 bg-rose-50/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="flex items-start gap-2">
                        <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                          Q{idx + 1}
                        </span>
                        <p className="text-sm font-semibold text-slate-900 leading-snug">
                          {item.questionText}
                        </p>
                      </div>

                      {/* Badge indicator */}
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

                    {/* Options list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs">
                      {item.options?.map((opt, optIdx) => {
                        const isStudentChoice = item.selectedOption === optIdx;
                        const isTheCorrectOption = item.correctAnswer === optIdx;

                        let optClass = 'bg-white border-slate-200 text-slate-600';
                        if (isTheCorrectOption) {
                          optClass = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold ring-1 ring-emerald-400';
                        } else if (isStudentChoice && !isCorrect) {
                          optClass = 'bg-rose-50 border-rose-300 text-rose-900 font-semibold ring-1 ring-rose-400 line-through';
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`p-2.5 rounded-lg border flex items-center justify-between gap-2 ${optClass}`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[11px] shrink-0">
                                {optionLetters[optIdx]}
                              </span>
                              <span>{opt}</span>
                            </div>

                            <div className="shrink-0 flex items-center gap-1 text-[10px]">
                              {isStudentChoice && (
                                <span className="bg-slate-800 text-white px-1.5 py-0.5 rounded font-semibold">
                                  User Choice
                                </span>
                              )}
                              {isTheCorrectOption && (
                                <span className="bg-emerald-600 text-white px-1.5 py-0.5 rounded font-semibold">
                                  Correct Key
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {item.explanation && (
                      <div className="mt-3 p-2.5 rounded-lg bg-slate-100/70 border border-slate-200 text-xs text-slate-600">
                        <span className="font-bold text-slate-700">Explanation: </span>
                        {item.explanation}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 italic">
                Detailed question snapshot was not recorded for this attempt.
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-200">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AttemptDetailModal;
