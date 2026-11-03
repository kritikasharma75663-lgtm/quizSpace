const QuizAttempt = require('../models/QuizAttempt');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const { calculateAndFinalizeAttempt } = require('../services/scoringService');

// Helper to shuffle array (Fisher-Yates)
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// @desc    Start or resume a quiz attempt
// @route   POST /api/attempts/start
// @access  Private
exports.startAttempt = async (req, res, next) => {
  try {
    const { quizId } = req.body;
    const userId = req.user._id;

    const quiz = await Quiz.findById(quizId).populate('category', 'name');
    if (!quiz || !quiz.published) {
      return res.status(404).json({
        success: false,
        message: 'This quiz is currently unavailable or has been unpublished.',
      });
    }

    const questions = await Question.find({ quiz: quizId }).lean();
    if (!questions || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'This quiz does not have any questions yet.',
      });
    }

    // Check for an ongoing "In Progress" attempt by this user for this quiz
    let existingAttempt = await QuizAttempt.findOne({
      user: userId,
      quiz: quizId,
      status: 'In Progress',
    }).sort({ createdAt: -1 });

    const now = new Date();

    if (existingAttempt) {
      const elapsedSeconds = Math.floor((now - new Date(existingAttempt.startedAt)) / 1000);
      const maxSeconds = quiz.duration * 60 + 60; // 60s grace

      if (elapsedSeconds >= maxSeconds) {
        // Active attempt has expired, finalize it automatically
        await calculateAndFinalizeAttempt(existingAttempt, existingAttempt.answers);
        // User can now start a fresh attempt below
        existingAttempt = null;
      } else {
        // Resume active attempt
        const remainingSeconds = Math.max(0, quiz.duration * 60 - elapsedSeconds);

        // Sanitize questions: strip correctAnswer and explanation
        const safeQuestions = questions.map((q) => ({
          _id: q._id,
          questionText: q.questionText,
          options: q.options,
          difficulty: q.difficulty,
        }));

        return res.status(200).json({
          success: true,
          message: 'Resuming your active quiz attempt.',
          data: {
            attemptId: existingAttempt._id,
            quiz: {
              id: quiz._id,
              title: quiz.title,
              category: quiz.category?.name,
              difficulty: quiz.difficulty,
              duration: quiz.duration,
              totalQuestions: questions.length,
              passingPercentage: quiz.passingPercentage,
            },
            startedAt: existingAttempt.startedAt,
            remainingSeconds,
            questions: safeQuestions,
            savedAnswers: existingAttempt.answers || [],
          },
        });
      }
    }

    // Create a new attempt
    const newAttempt = await QuizAttempt.create({
      user: userId,
      quiz: quizId,
      startedAt: now,
      status: 'In Progress',
      answers: [],
      totalMarks: questions.length,
    });

    // Strip answers and explanations for client-side security
    const safeQuestions = questions.map((q) => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options,
      difficulty: q.difficulty,
    }));

    res.status(201).json({
      success: true,
      message: 'Quiz attempt started.',
      data: {
        attemptId: newAttempt._id,
        quiz: {
          id: quiz._id,
          title: quiz.title,
          category: quiz.category?.name,
          difficulty: quiz.difficulty,
          duration: quiz.duration,
          totalQuestions: questions.length,
          passingPercentage: quiz.passingPercentage,
        },
        startedAt: newAttempt.startedAt,
        remainingSeconds: quiz.duration * 60,
        questions: safeQuestions,
        savedAnswers: [],
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save progressive answer
// @route   PUT /api/attempts/:id/answer
// @access  Private
exports.saveAnswer = async (req, res, next) => {
  try {
    const { questionId, selectedOption } = req.body;
    const attempt = await QuizAttempt.findById(req.params.id);

    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Attempt not found' });
    }

    // Ownership check
    if (attempt.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to attempt' });
    }

    if (attempt.status !== 'In Progress') {
      return res.status(400).json({
        success: false,
        message: `Cannot update answers for an attempt that is ${attempt.status}.`,
      });
    }

    // Update or push answer
    const existingIndex = attempt.answers.findIndex(
      (a) => a.question.toString() === questionId
    );

    if (existingIndex > -1) {
      attempt.answers[existingIndex].selectedOption = selectedOption;
    } else {
      attempt.answers.push({
        question: questionId,
        selectedOption,
      });
    }

    await attempt.save();

    res.status(200).json({
      success: true,
      message: 'Answer saved',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit quiz attempt and receive authoritative result
// @route   POST /api/attempts/:id/submit
// @access  Private
exports.submitAttempt = async (req, res, next) => {
  try {
    const { answers } = req.body;
    const attempt = await QuizAttempt.findById(req.params.id).populate('quiz');

    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Attempt not found' });
    }

    // Ownership check
    if (attempt.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to this attempt' });
    }

    // Idempotent submission: if already completed, return existing result
    if (attempt.status === 'Completed' || attempt.status === 'Expired') {
      return res.status(200).json({
        success: true,
        message: 'This attempt was already submitted.',
        data: attempt,
      });
    }

    // Calculate score authoritatively on the server
    const finalizedAttempt = await calculateAndFinalizeAttempt(attempt, answers);

    res.status(200).json({
      success: true,
      message: 'Quiz submitted successfully!',
      data: finalizedAttempt,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's attempt history
// @route   GET /api/attempts/my-history
// @access  Private
exports.getMyAttempts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, passed } = req.query;
    const userId = req.user._id;

    const query = {
      user: userId,
      status: { $in: ['Completed', 'Expired'] },
    };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (passed !== undefined && passed !== 'all') {
      query.passed = passed === 'true';
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await QuizAttempt.countDocuments(query);
    const attempts = await QuizAttempt.find(query)
      .populate({
        path: 'quiz',
        select: 'title category difficulty duration passingPercentage',
        populate: { path: 'category', select: 'name' },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: attempts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get result of a specific attempt
// @route   GET /api/attempts/:id/result
// @access  Private
exports.getAttemptResult = async (req, res, next) => {
  try {
    const attempt = await QuizAttempt.findById(req.params.id)
      .populate({
        path: 'quiz',
        select: 'title description category difficulty duration passingPercentage',
        populate: { path: 'category', select: 'name' },
      })
      .populate('user', 'name email')
      .lean();

    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Attempt not found' });
    }

    // Access control: User can only see their own attempt, admin can see all
    if (
      attempt.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this result.',
      });
    }

    res.status(200).json({
      success: true,
      data: attempt,
    });
  } catch (error) {
    next(error);
  }
};
