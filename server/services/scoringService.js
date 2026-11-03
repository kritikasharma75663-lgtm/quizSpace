const Question = require('../models/Question');
const Quiz = require('../models/Quiz');

/**
 * Authoritatively calculates score, evaluates answers, and constructs snapshot
 * @param {Object} attempt - Mongoose QuizAttempt document
 * @param {Array} submittedAnswers - [{ questionId, selectedOption }]
 */
const calculateAndFinalizeAttempt = async (attempt, submittedAnswers = []) => {
  const quiz = await Quiz.findById(attempt.quiz);
  if (!quiz) {
    throw new Error('Associated quiz not found');
  }

  // Fetch all original questions for this quiz
  const questions = await Question.find({ quiz: attempt.quiz }).lean();
  const totalQuestions = questions.length;

  if (totalQuestions === 0) {
    throw new Error('No questions found for this quiz');
  }

  // Map submitted answers by questionId for fast lookup
  const submissionMap = new Map();
  if (Array.isArray(submittedAnswers)) {
    submittedAnswers.forEach((ans) => {
      if (ans && ans.questionId) {
        submissionMap.set(ans.questionId.toString(), ans.selectedOption);
      }
    });
  }

  // Check timing: startedAt vs now
  const now = new Date();
  const startedAt = new Date(attempt.startedAt);
  const elapsedSeconds = Math.max(0, Math.floor((now - startedAt) / 1000));
  const maxAllowedSeconds = quiz.duration * 60 + 60; // 60s grace period for network latency

  let finalStatus = 'Completed';
  if (elapsedSeconds > maxAllowedSeconds) {
    finalStatus = 'Expired';
  }

  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;
  const snapshot = [];
  const processedAnswers = [];

  for (const q of questions) {
    const qIdStr = q._id.toString();
    const rawSelected = submissionMap.get(qIdStr);

    let selectedOption = null;
    let isCorrect = false;

    if (rawSelected !== undefined && rawSelected !== null && rawSelected !== '') {
      selectedOption = Number(rawSelected);
      if (selectedOption === q.correctAnswer) {
        correctCount += 1;
        isCorrect = true;
      } else {
        incorrectCount += 1;
        isCorrect = false;
      }
    } else {
      unansweredCount += 1;
      isCorrect = false;
    }

    processedAnswers.push({
      question: q._id,
      selectedOption,
      isCorrect,
    });

    snapshot.push({
      questionId: q._id,
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || '',
      selectedOption,
      isCorrect,
    });
  }

  const score = correctCount; // 1 mark per question
  const totalMarks = totalQuestions;
  const percentage = Math.round((correctCount / totalQuestions) * 100);
  const passed = percentage >= quiz.passingPercentage;
  const timeTaken = Math.min(elapsedSeconds, quiz.duration * 60);

  // Update attempt document
  attempt.status = finalStatus;
  attempt.submittedAt = now;
  attempt.answers = processedAnswers;
  attempt.snapshot = snapshot;
  attempt.score = score;
  attempt.totalMarks = totalMarks;
  attempt.correctCount = correctCount;
  attempt.incorrectCount = incorrectCount;
  attempt.unansweredCount = unansweredCount;
  attempt.percentage = percentage;
  attempt.timeTaken = timeTaken;
  attempt.passed = passed;

  await attempt.save();
  return attempt;
};

module.exports = { calculateAndFinalizeAttempt };
