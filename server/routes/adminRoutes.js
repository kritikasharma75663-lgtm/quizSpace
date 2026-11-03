const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  getAllAttempts,
  getAttemptDetail,
  exportAttemptsCSV,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.patch('/users/:id/status', updateUserStatus);
router.get('/attempts', getAllAttempts);
router.get('/attempts/:id', getAttemptDetail);
router.get('/reports/export', exportAttemptsCSV);

module.exports = router;
