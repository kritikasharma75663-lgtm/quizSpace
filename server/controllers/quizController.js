const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Category = require('../models/Category');

// @desc    Get published quizzes with search, category & difficulty filters, pagination
// @route   GET /api/quizzes
// @access  Public
exports.getPublishedQuizzes = async (req, res, next) => {
  try {
    const { category, difficulty, search, page = 1, limit = 9 } = req.query;

    const query = { published: true };

    // Category filter (by id or slug)
    if (category && category !== 'all') {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const cat = await Category.findOne({ slug: category });
        if (cat) query.category = cat._id;
      }
    }

    // Difficulty filter
    if (difficulty && difficulty !== 'all') {
      query.difficulty = difficulty;
    }

    // Keyword search in title or description
    if (search) {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 9;
    const skip = (pageNum - 1) * limitNum;

    const total = await Quiz.countDocuments(query);
    const quizzes = await Quiz.find(query)
      .populate('category', 'name slug icon')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Attach actual question counts
    const quizzesWithCounts = await Promise.all(
      quizzes.map(async (quiz) => {
        const questionCount = await Question.countDocuments({ quiz: quiz._id });
        return {
          ...quiz,
          questionCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: quizzesWithCounts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single quiz details
// @route   GET /api/quizzes/:id
// @access  Public / Private
exports.getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('category', 'name slug icon')
      .populate('createdBy', 'name')
      .lean();

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    // Ensure non-admin users cannot access unpublished quizzes
    if (!quiz.published && (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({ success: false, message: 'Quiz is not available' });
    }

    const questionCount = await Question.countDocuments({ quiz: quiz._id });

    res.status(200).json({
      success: true,
      data: {
        ...quiz,
        questionCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Get all quizzes (published and unpublished)
// @route   GET /api/quizzes/admin/all
// @access  Admin
exports.adminGetAllQuizzes = async (req, res, next) => {
  try {
    const { category, difficulty, published, search, page = 1, limit = 10 } = req.query;

    const query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (difficulty && difficulty !== 'all') {
      query.difficulty = difficulty;
    }

    if (published !== undefined && published !== 'all') {
      query.published = published === 'true';
    }

    if (search) {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await Quiz.countDocuments(query);
    const quizzes = await Quiz.find(query)
      .populate('category', 'name slug')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const quizzesWithCounts = await Promise.all(
      quizzes.map(async (quiz) => {
        const questionCount = await Question.countDocuments({ quiz: quiz._id });
        return {
          ...quiz,
          questionCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: quizzesWithCounts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new quiz
// @route   POST /api/quizzes
// @access  Admin
exports.createQuiz = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      difficulty,
      duration,
      passingPercentage,
      published,
    } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and category are required.',
      });
    }

    const quiz = await Quiz.create({
      title: title.trim(),
      description: description.trim(),
      category,
      difficulty: difficulty || 'Medium',
      duration: duration ? Number(duration) : 15,
      passingPercentage: passingPercentage ? Number(passingPercentage) : 60,
      published: published !== undefined ? published : true,
      createdBy: req.user ? req.user._id : null,
    });

    const populatedQuiz = await Quiz.findById(quiz._id).populate('category', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      data: populatedQuiz,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update quiz
// @route   PUT /api/quizzes/:id
// @access  Admin
exports.updateQuiz = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      difficulty,
      duration,
      passingPercentage,
      published,
    } = req.body;

    let quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    if (title) quiz.title = title.trim();
    if (description) quiz.description = description.trim();
    if (category) quiz.category = category;
    if (difficulty) quiz.difficulty = difficulty;
    if (duration !== undefined) quiz.duration = Number(duration);
    if (passingPercentage !== undefined) quiz.passingPercentage = Number(passingPercentage);
    if (published !== undefined) quiz.published = published;

    await quiz.save();

    const updated = await Quiz.findById(quiz._id).populate('category', 'name slug');

    res.status(200).json({
      success: true,
      message: 'Quiz updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete quiz and its associated questions
// @route   DELETE /api/quizzes/:id
// @access  Admin
exports.deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    // Delete all questions associated with this quiz
    await Question.deleteMany({ quiz: quiz._id });
    await Quiz.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Quiz and its questions deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
