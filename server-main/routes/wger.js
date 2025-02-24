// Updated routes/wgerRoutes.js with additional endpoints

const express = require('express');
const router = express.Router();
const wgerController = require('../controllers/wgerController');
const auth = require('../middleware/auth');

// Public routes
router.get('/exercises', wgerController.getExercises);
router.get('/exercises/:id', wgerController.getExerciseById);
router.get('/categories', wgerController.getExerciseCategories);
router.get('/muscles', wgerController.getMuscles);
router.get('/equipment', wgerController.getEquipment);

// Protected routes (require authentication)
router.post('/workouts', auth, wgerController.saveWorkout);
router.get('/workouts', auth, wgerController.getUserWorkouts);
router.get('/workouts/:workoutId', auth, wgerController.getWorkoutById);
router.put('/workouts/:workoutId', auth, wgerController.updateWorkout);
router.delete('/workouts/:workoutId', auth, wgerController.deleteWorkout);

module.exports = router;