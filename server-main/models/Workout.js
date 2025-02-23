const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  equipment: {
    type: String,
    required: true
  },
  diet: {
    vegetables: [String],
    proteinIntake: [String],
    juices: [String]
  },
  exercises: [String],
  recommendations: {
    type: String,
    required: true
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metrics: {
    height: Number,
    weight: Number,
    bmi: Number,
    age: Number,
    gender: String,
    fitnessGoal: String,
    fitnessType: String
  }
});

const Workout = mongoose.model('Workout', workoutSchema);
module.exports = Workout;