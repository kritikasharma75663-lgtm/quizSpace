import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { attemptService } from '../../services/attemptService';
import { useQuizTimer } from '../../hooks/useQuizTimer';
import Timer from '../../components/quiz/Timer';
import QuestionPalette from '../../components/quiz/QuestionPalette';
import OptionCard from '../../components/quiz/OptionCard';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import toast from 'react-hot-toast';
import {
  ChevronLeft,
  ChevronRight,
  Send,
  RotateCcw,
  AlertTriangle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

const LiveQuizAttempt = () => {
  const { id: quizId } = useParams();
  const navigate = useNavigate();

  const [attemptId, setAttemptId] = useState(null);
  const [quizInfo, setQuizInfo] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: selectedOptionIndex }
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [initialSeconds, setInitialSeconds] = useState(900); // 15 mins default

  // Ref to hold current answers for auto-submission on timeout
  const answersRef = useRef(answers);
  const attemptIdRef = useRef(attemptId);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    attemptIdRef.current = attemptId;
  }, [attemptId]);

  // Handle auto-submit on timer expiration
  const handleTimeExpired = async () => {
    if (submitting || !attemptIdRef.current) return;
    toast.error('Time has expired! Automatically submitting your assessment...');
    await performSubmission(true);
  };

  const { secondsLeft, isLowTime } = useQuizTimer(initialSeconds, handleTimeExpired);

  // Initialize or resume attempt
  useEffect(() => {
    const initializeAttempt = async () => {
      try {
        const res = await attemptService.startAttempt(quizId);
        const { attemptId: attId, quiz, remainingSeconds, questions: qs, savedAnswers } = res.data;

        setAttemptId(attId);
        setQuizInfo(quiz);
        setQuestions(qs || []);
        setInitialSeconds(remainingSeconds || quiz.duration * 60);

        // Pre-fill any previously saved answers if resuming
        if (savedAnswers && savedAnswers.length > 0) {
          const prefill = {};
          savedAnswers.forEach((ans) => {
            if (ans.selectedOption !== null && ans.selectedOption !== undefined) {
              prefill[ans.question] = ans.selectedOption;
            }
          });
          setAnswers(prefill);
        }

        toast.success(res.message || 'Quiz ready!');
      } catch (err) {
        console.error('Failed to initialize attempt:', err);
        const msg = err.response?.data?.message || 'Unable to start quiz.';
        toast.error(msg);
        navigate('/quizzes');
      } finally {
        setLoading(false);
      }
    };

    initializeAttempt();
  }, [quizId, navigate]);

  // Select an option
  const handleSelectOption = async (optionIndex) => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    const qId = currentQ._id;
    const newAnswers = { ...answers, [qId]: optionIndex };
    setAnswers(newAnswers);

    // Progressive save to backend (in background)
    try {
      await attemptService.saveAnswer(attemptId, qId, optionIndex);
    } catch (err) {
      console.warn('Progressive answer save failed, will submit at end:', err);
    }
  };

  // Clear answer for current question
  const handleClearAnswer = async () => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    const qId = currentQ._id;
    const newAnswers = { ...answers };
    delete newAnswers[qId];
    setAnswers(newAnswers);

    try {
      await attemptService.saveAnswer(attemptId, qId, null);
    } catch (err) {
      console.warn('Failed clearing answer:', err);
    }
  };

  // Final submission logic
  const performSubmission = async (isAuto = false) => {
    setSubmitting(true);
    setShowConfirmModal(false);

    try {
      // Format answers for submission: [{ questionId, selectedOption }]
      const payloadAnswers = Object.entries(answersRef.current).map(([questionId, selectedOption]) => ({
        questionId,
        selectedOption: Number(selectedOption),
      }));

      const res = await attemptService.submitAttempt(attemptIdRef.current, payloadAnswers);
      toast.success(isAuto ? 'Assessment auto-submitted!' : 'Quiz completed successfully!');
      navigate(`/attempts/${res.data._id || attemptIdRef.current}`, { replace: true });
    } catch (err) {
      console.error('Submission error:', err);
      toast.error('Failed to submit quiz. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 animate-spin text-brand-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">Generating Secure Quiz Assessment...</h3>
          <p className="text-xs text-slate-400">Loading authorized question bank from database</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col">
      {/* Sticky Top Quiz Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">
              Live Assessment
            </span>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
              {quizInfo?.title || 'Quiz'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Timer secondsLeft={secondsLeft} isLowTime={isLowTime} />
            <Button
              variant="primary"
              size="sm"
              icon={Send}
              onClick={() => setShowConfirmModal(true)}
              isLoading={submitting}
              className="font-bold"
            >
              Submit Quiz
            </Button>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="max-w-7xl mx-auto mt-2.5">
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-600 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </header>

      {/* Main Attempt Body */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Main Question Card (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              {/* Question metadata row */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-brand-50 text-brand-700">
                    Question {currentIndex + 1} of {totalQuestions}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    Difficulty: {currentQuestion?.difficulty || 'Medium'}
                  </span>
                </div>

                {answers[currentQuestion?._id] !== undefined && (
                  <button
                    onClick={handleClearAnswer}
                    className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-rose-600 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear Answer</span>
                  </button>
                )}
              </div>

              {/* Question statement */}
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed mb-6">
                {currentQuestion?.questionText}
              </h3>

              {/* Options list */}
              <div className="space-y-3">
                {currentQuestion?.options?.map((option, idx) => (
                  <OptionCard
                    key={idx}
                    index={idx}
                    optionText={option}
                    isSelected={answers[currentQuestion._id] === idx}
                    onSelect={() => handleSelectOption(idx)}
                  />
                ))}
              </div>

              {/* Navigation controls */}
              <div className="flex items-center justify-between pt-8 mt-8 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="md"
                  icon={ChevronLeft}
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                >
                  Previous
                </Button>

                {currentIndex < totalQuestions - 1 ? (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                  >
                    <span>Next Question</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    variant="success"
                    size="md"
                    icon={Send}
                    onClick={() => setShowConfirmModal(true)}
                  >
                    Review & Submit
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Right Question Palette Sidebar (1 col) */}
          <div className="lg:col-span-1 space-y-4">
            <QuestionPalette
              totalQuestions={totalQuestions}
              currentIndex={currentIndex}
              answers={answers}
              questions={questions}
              onSelectQuestion={(idx) => setCurrentIndex(idx)}
            />

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Progress:</span>
                <span className="font-bold text-slate-900">{progressPercent}%</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Answered:</span>
                <span className="font-bold text-emerald-600">{answeredCount} questions</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Remaining:</span>
                <span className="font-bold text-amber-600">
                  {totalQuestions - answeredCount} questions
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog before Final Submission */}
      <ConfirmDialog
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => performSubmission(false)}
        title="Submit Assessment?"
        message={`You have answered ${answeredCount} of ${totalQuestions} questions. Are you sure you want to finalize your submission? Once submitted, your score will be calculated and saved authoritatively.`}
        confirmText="Yes, Submit Now"
        cancelText="Continue Reviewing"
        variant={answeredCount < totalQuestions ? 'warning' : 'primary'}
        isLoading={submitting}
      />
    </div>
  );
};

export default LiveQuizAttempt;
