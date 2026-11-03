const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getQuestionsForQuiz,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  bulkCreateQuestions,
} = require('../controllers/questionController');
const { protect, authorize } = require('../middleware/auth');

// All question management routes are restricted to admin
router.use(protect, authorize('admin'));

// Mounted on /api/quizzes/:quizId/questions
router.get('/', getQuestionsForQuiz);
router.post('/', createQuestion);
router.post('/bulk', bulkCreateQuestions);

// Standalone question routes (mounted on /api/questions)
router.put('/:id', updateQuestion);
router.delete('/:id', deleteQuestion);

module.exports = router;
