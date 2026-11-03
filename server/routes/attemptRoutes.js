const express = require('express');
const router = express.Router();
const {
  startAttempt,
  saveAnswer,
  submitAttempt,
  getMyAttempts,
  getAttemptResult,
} = require('../controllers/attemptController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/start', startAttempt);
router.put('/:id/answer', saveAnswer);
router.post('/:id/submit', submitAttempt);
router.get('/my-history', getMyAttempts);
router.get('/:id/result', getAttemptResult);

module.exports = router;
