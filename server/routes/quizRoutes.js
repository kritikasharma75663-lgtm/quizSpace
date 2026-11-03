const express = require('express');
const router = express.Router();
const {
  getPublishedQuizzes,
  getQuizById,
  adminGetAllQuizzes,
  createQuiz,
  updateQuiz,
  deleteQuiz,
} = require('../controllers/quizController');
const { protect, authorize } = require('../middleware/auth');

// Optional auth middleware for getQuizById so admins can preview unpublished quizzes
const optionalAuth = async (req, res, next) => {
  if (req.cookies?.token || req.headers?.authorization) {
    return protect(req, res, next);
  }
  next();
};

router.get('/', getPublishedQuizzes);
router.get('/admin/all', protect, authorize('admin'), adminGetAllQuizzes);
router.get('/:id', optionalAuth, getQuizById);
router.post('/', protect, authorize('admin'), createQuiz);
router.put('/:id', protect, authorize('admin'), updateQuiz);
router.delete('/:id', protect, authorize('admin'), deleteQuiz);

module.exports = router;
