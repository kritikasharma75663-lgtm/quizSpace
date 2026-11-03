const Question = require('../models/Question');
const Quiz = require('../models/Quiz');

// @desc    Get questions for a quiz (Admin only - includes correct answers)
// @route   GET /api/quizzes/:quizId/questions
// @access  Admin
exports.getQuestionsForQuiz = async (req, res, next) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId).populate('category', 'name');
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    const questions = await Question.find({ quiz: quizId }).sort({ createdAt: 1 }).lean();

    res.status(200).json({
      success: true,
      quiz: {
        id: quiz._id,
        title: quiz.title,
        category: quiz.category?.name,
        difficulty: quiz.difficulty,
        duration: quiz.duration,
      },
      count: questions.length,
      data: questions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create question for a quiz
// @route   POST /api/quizzes/:quizId/questions
// @access  Admin
exports.createQuestion = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const { questionText, options, correctAnswer, explanation, difficulty } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    if (!questionText || !options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Question text and at least 2 options (normally 4) are required.',
      });
    }

    const parsedCorrect = Number(correctAnswer);
    if (isNaN(parsedCorrect) || parsedCorrect < 0 || parsedCorrect >= options.length) {
      return res.status(400).json({
        success: false,
        message: `Correct answer index must be between 0 and ${options.length - 1}.`,
      });
    }

    const question = await Question.create({
      quiz: quizId,
      questionText: questionText.trim(),
      options: options.map((opt) => opt.trim()),
      correctAnswer: parsedCorrect,
      explanation: explanation ? explanation.trim() : '',
      difficulty: difficulty || quiz.difficulty,
    });

    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update question
// @route   PUT /api/questions/:id
// @access  Admin
exports.updateQuestion = async (req, res, next) => {
  try {
    const { questionText, options, correctAnswer, explanation, difficulty } = req.body;

    let question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    if (questionText) question.questionText = questionText.trim();
    if (options && Array.isArray(options)) {
      question.options = options.map((opt) => opt.trim());
    }
    if (correctAnswer !== undefined) {
      const parsedCorrect = Number(correctAnswer);
      if (isNaN(parsedCorrect) || parsedCorrect < 0 || parsedCorrect >= question.options.length) {
        return res.status(400).json({
          success: false,
          message: `Correct answer index must be between 0 and ${question.options.length - 1}.`,
        });
      }
      question.correctAnswer = parsedCorrect;
    }
    if (explanation !== undefined) question.explanation = explanation.trim();
    if (difficulty) question.difficulty = difficulty;

    await question.save();

    res.status(200).json({
      success: true,
      message: 'Question updated successfully',
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete question
// @route   DELETE /api/questions/:id
// @access  Admin
exports.deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    await Question.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk create questions
// @route   POST /api/quizzes/:quizId/questions/bulk
// @access  Admin
exports.bulkCreateQuestions = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const { questions } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of questions.',
      });
    }

    const preparedQuestions = questions.map((q) => ({
      quiz: quizId,
      questionText: q.questionText.trim(),
      options: q.options.map((opt) => opt.trim()),
      correctAnswer: Number(q.correctAnswer) || 0,
      explanation: q.explanation ? q.explanation.trim() : '',
      difficulty: q.difficulty || quiz.difficulty,
    }));

    const inserted = await Question.insertMany(preparedQuestions);

    res.status(201).json({
      success: true,
      message: `${inserted.length} questions imported successfully`,
      data: inserted,
    });
  } catch (error) {
    next(error);
  }
};
