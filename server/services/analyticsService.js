const mongoose = require('mongoose');
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Category = require('../models/Category');
const QuizAttempt = require('../models/QuizAttempt');

// Get user personalized dashboard metrics
const getUserDashboardAnalytics = async (userId) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  // Completed or Expired attempts
  const attempts = await QuizAttempt.find({
    user: userObjectId,
    status: { $in: ['Completed', 'Expired'] },
  })
    .sort({ createdAt: -1 })
    .populate('quiz', 'title category difficulty passingPercentage')
    .lean();

  const totalAttempted = attempts.length;

  let totalScore = 0;
  let totalPossible = 0;
  let totalCorrect = 0;
  let totalQuestionsSeen = 0;

  attempts.forEach((att) => {
    totalScore += att.score || 0;
    totalPossible += att.totalMarks || 0;
    totalCorrect += att.correctCount || 0;
    totalQuestionsSeen += (att.totalMarks || 0);
  });

  const averageScorePercentage =
    totalAttempted > 0
      ? Math.round(
          attempts.reduce((sum, att) => sum + (att.percentage || 0), 0) /
            totalAttempted
        )
      : 0;

  const overallAccuracy =
    totalQuestionsSeen > 0
      ? Math.round((totalCorrect / totalQuestionsSeen) * 100)
      : 0;

  // Chart data: score progression of last 7 attempts (in chronological order)
  const performanceTrend = attempts
    .slice(0, 10)
    .reverse()
    .map((att, idx) => ({
      name: att.quiz?.title ? (att.quiz.title.length > 15 ? att.quiz.title.substring(0, 15) + '...' : att.quiz.title) : `Quiz ${idx + 1}`,
      score: att.percentage,
      date: new Date(att.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
    }));

  return {
    totalAttempted,
    averageScorePercentage,
    overallAccuracy,
    totalCorrect,
    recentAttempts: attempts.slice(0, 5),
    performanceTrend,
  };
};

// Get admin dashboard comprehensive statistics
const getAdminDashboardAnalytics = async () => {
  const [
    totalUsers,
    totalQuizzes,
    totalPublishedQuizzes,
    totalQuestions,
    totalAttempts,
    completedAttempts,
  ] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    Quiz.countDocuments(),
    Quiz.countDocuments({ published: true }),
    Question.countDocuments(),
    QuizAttempt.countDocuments(),
    QuizAttempt.find({ status: { $in: ['Completed', 'Expired'] } })
      .select('score totalMarks percentage')
      .lean(),
  ]);

  const avgPlatformScore =
    completedAttempts.length > 0
      ? Math.round(
          completedAttempts.reduce((sum, a) => sum + (a.percentage || 0), 0) /
            completedAttempts.length
        )
      : 0;

  // Recent user registrations
  const recentUsers = await User.find({ role: 'user' })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('name email status createdAt')
    .lean();

  // Recent quiz attempts with populated user and quiz
  const recentAttempts = await QuizAttempt.find()
    .sort({ createdAt: -1 })
    .limit(6)
    .populate('user', 'name email')
    .populate('quiz', 'title category difficulty')
    .lean();

  // Category-wise quiz & attempt distribution
  const categoryStats = await Quiz.aggregate([
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'categoryInfo',
      },
    },
    { $unwind: '$categoryInfo' },
    {
      $group: {
        _id: '$categoryInfo.name',
        quizCount: { $sum: 1 },
      },
    },
    { $project: { name: '$_id', quizzes: '$quizCount', _id: 0 } },
    { $sort: { quizzes: -1 } },
  ]);

  // Most popular quizzes by attempt count
  const popularQuizzes = await QuizAttempt.aggregate([
    {
      $group: {
        _id: '$quiz',
        attemptsCount: { $sum: 1 },
        avgPercentage: { $avg: '$percentage' },
      },
    },
    { $sort: { attemptsCount: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'quizzes',
        localField: '_id',
        foreignField: '_id',
        as: 'quizInfo',
      },
    },
    { $unwind: '$quizInfo' },
    {
      $project: {
        _id: '$_id',
        title: '$quizInfo.title',
        difficulty: '$quizInfo.difficulty',
        duration: '$quizInfo.duration',
        attemptsCount: 1,
        avgPercentage: { $round: ['$avgPercentage', 0] },
      },
    },
  ]);

  return {
    totalUsers,
    totalQuizzes,
    totalPublishedQuizzes,
    totalQuestions,
    totalAttempts,
    avgPlatformScore,
    recentUsers,
    recentAttempts,
    categoryStats,
    popularQuizzes,
  };
};

module.exports = {
  getUserDashboardAnalytics,
  getAdminDashboardAnalytics,
};
