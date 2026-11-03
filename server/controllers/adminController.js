const User = require('../models/User');
const QuizAttempt = require('../models/QuizAttempt');
const Quiz = require('../models/Quiz');
const Category = require('../models/Category');
const { getAdminDashboardAnalytics } = require('../services/analyticsService');

// @desc    Get admin dashboard aggregated statistics and charts data
// @route   GET /api/admin/dashboard
// @access  Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    const stats = await getAdminDashboardAnalytics();
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with performance summaries, search, and pagination
// @route   GET /api/admin/users
// @access  Admin
exports.getUsers = async (req, res, next) => {
  try {
    const { search, role, status, page = 1, limit = 10 } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    if (role && role !== 'all') {
      query.role = role;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Attach attempt count & avg score for each user
    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const attempts = await QuizAttempt.find({
          user: u._id,
          status: { $in: ['Completed', 'Expired'] },
        })
          .select('percentage')
          .lean();

        const totalAttempts = attempts.length;
        const avgScore =
          totalAttempts > 0
            ? Math.round(
                attempts.reduce((sum, a) => sum + (a.percentage || 0), 0) /
                  totalAttempts
              )
            : 0;

        return {
          id: u._id,
          name: u.name,
          email: u.email,
          role: u.role,
          status: u.status,
          createdAt: u.createdAt,
          totalAttempts,
          avgScore,
        };
      })
    );

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: usersWithStats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user status (activate / deactivate)
// @route   PATCH /api/admin/users/:id/status
// @access  Admin
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Safety: prevent admin from deactivating themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Action prohibited: You cannot modify your own administrator account status.',
      });
    }

    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either active or inactive.',
      });
    }

    user.status = status;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User status changed to ${status}.`,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all quiz attempts with advanced filters, search, and pagination
// @route   GET /api/admin/attempts
// @access  Admin
exports.getAllAttempts = async (req, res, next) => {
  try {
    const {
      search,
      quizId,
      categoryId,
      status,
      passed,
      minScore,
      maxScore,
      sortBy = 'latest',
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (passed !== undefined && passed !== 'all') {
      query.passed = passed === 'true';
    }

    if (quizId && quizId !== 'all') {
      query.quiz = quizId;
    }

    if (minScore !== undefined || maxScore !== undefined) {
      query.percentage = {};
      if (minScore !== undefined && minScore !== '') {
        query.percentage.$gte = Number(minScore);
      }
      if (maxScore !== undefined && maxScore !== '') {
        query.percentage.$lte = Number(maxScore);
      }
    }

    // Handle Category filter
    if (categoryId && categoryId !== 'all') {
      const quizzesInCategory = await Quiz.find({ category: categoryId }).select('_id');
      const quizIds = quizzesInCategory.map((q) => q._id);
      if (query.quiz) {
        // if quizId was also provided, check intersection
      } else {
        query.quiz = { $in: quizIds };
      }
    }

    // Handle search by User Name, Email, or Quiz Title
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      const [matchedUsers, matchedQuizzes] = await Promise.all([
        User.find({
          $or: [{ name: searchRegex }, { email: searchRegex }],
        }).select('_id'),
        Quiz.find({ title: searchRegex }).select('_id'),
      ]);

      const userIds = matchedUsers.map((u) => u._id);
      const quizIds = matchedQuizzes.map((q) => q._id);

      query.$or = [{ user: { $in: userIds } }, { quiz: { $in: quizIds } }];
    }

    // Sort order
    let sortOptions = { createdAt: -1 }; // default latest
    if (sortBy === 'highest_score') {
      sortOptions = { percentage: -1, createdAt: -1 };
    } else if (sortBy === 'lowest_score') {
      sortOptions = { percentage: 1, createdAt: -1 };
    } else if (sortBy === 'oldest') {
      sortOptions = { createdAt: 1 };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await QuizAttempt.countDocuments(query);
    const attempts = await QuizAttempt.find(query)
      .populate('user', 'name email')
      .populate({
        path: 'quiz',
        select: 'title category difficulty duration passingPercentage',
        populate: { path: 'category', select: 'name slug' },
      })
      .sort(sortOptions)
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

// @desc    Get detailed attempt breakdown with snapshot
// @route   GET /api/admin/attempts/:id
// @access  Admin
exports.getAttemptDetail = async (req, res, next) => {
  try {
    const attempt = await QuizAttempt.findById(req.params.id)
      .populate('user', 'name email')
      .populate({
        path: 'quiz',
        select: 'title description category difficulty duration passingPercentage',
        populate: { path: 'category', select: 'name slug' },
      })
      .lean();

    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Attempt not found' });
    }

    res.status(200).json({
      success: true,
      data: attempt,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export attempts as CSV format
// @route   GET /api/admin/reports/export
// @access  Admin
exports.exportAttemptsCSV = async (req, res, next) => {
  try {
    const attempts = await QuizAttempt.find()
      .populate('user', 'name email')
      .populate({
        path: 'quiz',
        select: 'title category difficulty',
        populate: { path: 'category', select: 'name' },
      })
      .sort({ createdAt: -1 })
      .lean();

    // Build CSV content
    const headers = [
      'Attempt ID',
      'User Name',
      'User Email',
      'Quiz Title',
      'Category',
      'Difficulty',
      'Started At',
      'Submitted At',
      'Status',
      'Total Questions',
      'Correct Answers',
      'Incorrect Answers',
      'Unanswered',
      'Marks Obtained',
      'Maximum Marks',
      'Score Percentage',
      'Time Taken (s)',
      'Pass Status',
    ];

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = attempts.map((a) => [
      escapeCsv(a._id),
      escapeCsv(a.user?.name || 'Unknown'),
      escapeCsv(a.user?.email || 'Unknown'),
      escapeCsv(a.quiz?.title || 'Unknown Quiz'),
      escapeCsv(a.quiz?.category?.name || 'General'),
      escapeCsv(a.quiz?.difficulty || 'Medium'),
      escapeCsv(a.startedAt ? new Date(a.startedAt).toISOString() : ''),
      escapeCsv(a.submittedAt ? new Date(a.submittedAt).toISOString() : ''),
      escapeCsv(a.status),
      escapeCsv(a.totalMarks),
      escapeCsv(a.correctCount),
      escapeCsv(a.incorrectCount),
      escapeCsv(a.unansweredCount),
      escapeCsv(a.score),
      escapeCsv(a.totalMarks),
      escapeCsv(`${a.percentage}%`),
      escapeCsv(a.timeTaken),
      escapeCsv(a.passed ? 'PASSED' : 'FAILED'),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=quizmaster_attempts_${Date.now()}.csv`);
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};
