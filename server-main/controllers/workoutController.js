const Workout = require('../models/Workout');
const axios = require('axios'); // Add this at the top

// Generate and save workout plan
const generateWorkout = async (req, res) => {
  try {
    // Get user metrics from onboarding data
    const metrics = req.user.onboarding.fitnessProfile.currentMetrics;
    
    // Calculate BMI
    const heightInMeters = metrics.height / 100; // Convert cm to meters
    const bmi = metrics.weight / (heightInMeters * heightInMeters);

    // Prepare data for ML prediction
    const mlRequestData = {
      Sex: metrics.gender === 'male' ? 'Male' : 'Female',
      Hypertension: metrics.hypertension ? 'Yes' : 'No',
      Diabetes: metrics.diabetes ? 'Yes' : 'No',
      Level: metrics.bodyType.charAt(0).toUpperCase() + metrics.bodyType.slice(1), // Capitalize first letter
      "Fitness Goal": metrics.fitnessGoalType === 'weight_gain' ? 'Weight Gain' : 'Weight Loss',
      "Fitness Type": metrics.fitnessType === 'muscular_fitness' ? 'Muscular Fitness' : 'Cardio Fitness',
      Age: metrics.age,
      Height: heightInMeters,
      Weight: metrics.weight,
      BMI: parseFloat(bmi.toFixed(2))
    };

    // Make request to Flask ML API
    const mlResponse = await axios.post(`${process.env.FLASK_URL}/predict`, mlRequestData);
    const { Equipment, Diet, Exercises, Recommendation } = mlResponse.data;

    // Parse diet string into structured data
    const dietParts = Diet.split(';').map(part => part.trim());
    const diet = {
      vegetables: [],
      proteinIntake: [],
      juices: []
    };

    dietParts.forEach(part => {
      if (part.startsWith('Vegetables:')) {
        diet.vegetables = part.replace('Vegetables:', '')
          .match(/\((.*?)\)/)[1]
          .split(',')
          .map(item => item.trim());
      } else if (part.startsWith('Protein Intake:')) {
        diet.proteinIntake = part.replace('Protein Intake:', '')
          .match(/\((.*?)\)/)[1]
          .split(',')
          .map(item => item.trim());
      } else if (part.startsWith('Juice :')) {
        diet.juices = part.replace('Juice :', '')
          .match(/\((.*?)\)/)[1]
          .split(',')
          .map(item => item.trim());
      }
    });

    // Parse exercises string into array
    const exercises = Exercises.split(',').map(exercise => exercise.trim());

    // Create new workout plan
    const workout = new Workout({
      user: req.user._id,
      equipment: Equipment,
      diet,
      exercises,
      recommendations: Recommendation,
      metrics: {
        height: metrics.height,
        weight: metrics.weight,
        age: metrics.age,
        gender: metrics.gender,
        fitnessGoal: metrics.fitnessGoalType,
        fitnessType: metrics.fitnessType
      }
    });

    await workout.save();

    res.status(201).send({
      message: 'Workout plan generated successfully',
      workout
    });
  } catch (error) {
    console.error('Workout generation error:', error);
    res.status(500).send({
      error: 'Error generating workout plan',
      details: error.message
    });
  }
};

// Get current active workout plan
const getCurrentWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOne({
      user: req.user._id,
      isActive: true
    }).sort({ generatedAt: -1 });

    if (!workout) {
      return res.status(404).send({
        error: 'No active workout plan found'
      });
    }

    res.send({ workout });
  } catch (error) {
    console.error('Get workout error:', error);
    res.status(500).send({
      error: 'Error fetching workout plan'
    });
  }
};

// Get workout history
const getWorkoutHistory = async (req, res) => {
  try {
    const workouts = await Workout.find({
      user: req.user._id
    }).sort({ generatedAt: -1 });

    res.send({ workouts });
  } catch (error) {
    console.error('Get workout history error:', error);
    res.status(500).send({
      error: 'Error fetching workout history'
    });
  }
};

// Update workout status
const updateWorkoutStatus = async (req, res) => {
  try {
    const { workoutId } = req.params;
    const { isActive } = req.body;

    const workout = await Workout.findOne({
      _id: workoutId,
      user: req.user._id
    });

    if (!workout) {
      return res.status(404).send({
        error: 'Workout not found'
      });
    }

    workout.isActive = isActive;
    await workout.save();

    res.send({
      message: 'Workout status updated successfully',
      workout
    });
  } catch (error) {
    console.error('Update workout status error:', error);
    res.status(500).send({
      error: 'Error updating workout status'
    });
  }
};

module.exports = {
  generateWorkout,
  getCurrentWorkout,
  getWorkoutHistory,
  updateWorkoutStatus
};