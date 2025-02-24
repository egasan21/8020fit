const wgerAPI = require('../utils/wgerAPI')
const User = require('../models/User'); // Your existing User model

// Controller for WGER-related functionalities
const wgerController = {
  // Get exercises
  getExercises: async (req, res) => {
    try {
      console.log('getExercises called with query params:', req.query);
      const { language = 'en', muscles, equipment, category, limit = 20, offset = 0 } = req.query;
      
      const params = {
        language,
        limit,
        offset
      };
      
      if (muscles) params.muscles = muscles;
      if (equipment) params.equipment = equipment;
      if (category) params.category = category;
      
      console.log('Calling WGER API with params:', params);
      const exercises = await wgerAPI.request('exercise', 'GET', params);
      console.log('WGER API response received:', exercises);
      res.json(exercises);
    } catch (error) {
      console.error('Error in getExercises:', {
        message: error.message,
        stack: error.stack,
        details: error.response?.data
      });
      res.status(500).json({ 
        error: error.message,
        details: error.response?.data || 'No additional error details'
      });
    }
  },
  
  // Get exercise details
  getExerciseById: async (req, res) => {
    try {
      const { id } = req.params;
      const exercise = await wgerAPI.request(`exercise/${id}`);
      res.json(exercise);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // Get exercise categories
  getExerciseCategories: async (req, res) => {
    try {
      const categories = await wgerAPI.request('exercisecategory');
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // Get muscles
  getMuscles: async (req, res) => {
    try {
      const muscles = await wgerAPI.request('muscle');
      res.json(muscles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // Get equipment
  getEquipment: async (req, res) => {
    try {
      const equipment = await wgerAPI.request('equipment');
      res.json(equipment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // Save workout to user profile in your MongoDB
  saveWorkout: async (req, res) => {
    try {
      const userId = req.user._id; // Assuming you have authentication middleware
      const { name, description, exercises } = req.body;
      
      // Validate request
      if (!name || !exercises || !Array.isArray(exercises) || exercises.length === 0) {
        return res.status(400).json({ error: 'Invalid workout data' });
      }
      
      // Find user in your MongoDB
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Create new workout entry
      // This depends on your MongoDB schema, adjust as needed
      const workout = {
        name,
        description,
        exercises: exercises.map(ex => ({
          exerciseId: ex.id,
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight
        })),
        createdAt: new Date()
      };
      
      // Add to user's workouts
      // Assuming you have a workouts array in your User model
      if (!user.workouts) {
        user.workouts = [];
      }
      user.workouts.push(workout);
      await user.save();
      
      res.json({ success: true, workout });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // Get user's saved workouts
  getUserWorkouts: async (req, res) => {
    try {
        // console.log(req.user);
      const userId  = req.user._id; // Assuming you have authentication middleware
    //   console.log(userId);

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(user.workouts || []);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // Delete a workout
  deleteWorkout: async (req, res) => {
    try {
      const userId  = req.user._id;
      const { workoutId } = req.params;
      
      // Find user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Check if user has workouts
      if (!user.workouts || user.workouts.length === 0) {
        return res.status(404).json({ error: 'No workouts found' });
      }
      
      // Find workout index
      const workoutIndex = user.workouts.findIndex(workout => 
        workout._id.toString() === workoutId
      );
      
      if (workoutIndex === -1) {
        return res.status(404).json({ error: 'Workout not found' });
      }
      
      // Remove workout
      user.workouts.splice(workoutIndex, 1);
      await user.save();
      
      res.json({ success: true, message: 'Workout deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // Get a single workout by ID
  getWorkoutById: async (req, res) => {
    try {
      const  userId  = req.user._id;
      const { workoutId } = req.params;
      
      // Find user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Check if user has workouts
      if (!user.workouts || user.workouts.length === 0) {
        return res.status(404).json({ error: 'No workouts found' });
      }
      
      // Find workout
      const workout = user.workouts.find(workout => 
        workout._id.toString() === workoutId
      );
      
      if (!workout) {
        return res.status(404).json({ error: 'Workout not found' });
      }
      
      res.json(workout);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // Update a workout
  updateWorkout: async (req, res) => {
    try {
      const  userId  = req.user._id;
      const { workoutId } = req.params;
      const { name, description, exercises } = req.body;
      
      // Validate request
      if (!name || !exercises || !Array.isArray(exercises) || exercises.length === 0) {
        return res.status(400).json({ error: 'Invalid workout data' });
      }
      
      // Find user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Check if user has workouts
      if (!user.workouts || user.workouts.length === 0) {
        return res.status(404).json({ error: 'No workouts found' });
      }
      
      // Find workout index
      const workoutIndex = user.workouts.findIndex(workout => 
        workout._id.toString() === workoutId
      );
      
      if (workoutIndex === -1) {
        return res.status(404).json({ error: 'Workout not found' });
      }
      
      // Update workout
      user.workouts[workoutIndex] = {
        ...user.workouts[workoutIndex],
        name,
        description,
        exercises: exercises.map(ex => ({
          exerciseId: ex.exerciseId || ex.id,
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight
        })),
        updatedAt: new Date()
      };
      
      await user.save();
      
      res.json({ 
        success: true, 
        workout: user.workouts[workoutIndex],
        message: 'Workout updated successfully' 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = wgerController;