const express = require('express');
const router = express.Router();
const {
  generateWorkout,
  getCurrentWorkout,
  getWorkoutHistory,
  updateWorkoutStatus
} = require('../controllers/workoutController');
const auth = require('../middleware/auth');

// Generate new workout plan
router.post('/generate', auth, generateWorkout);

// Get current active workout plan
router.get('/current', auth, getCurrentWorkout);

// Get workout history
router.get('/history', auth, getWorkoutHistory);

// Update workout status
router.patch('/:workoutId/status', auth, updateWorkoutStatus);

module.exports = router;