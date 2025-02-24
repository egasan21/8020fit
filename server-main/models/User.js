const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the exercise schema for workouts
const exerciseSchema = new mongoose.Schema({
  exerciseId: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  sets: {
    type: Number,
    required: true,
    min: 1
  },
  reps: {
    type: Number,
    required: true,
    min: 1
  },
  weight: {
    type: Number,
    default: 0
  }
}, { _id: false });

// Define the workout schema
const workoutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  exercises: [exerciseSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  profile: {
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    company: { type: String, default: '' },
    position: { type: String, default: '' },
    phone: { type: String, default: '' }
  },
  avatar: String,
  settings: {
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
    darkMode: { type: Boolean, default: false },
    autoSave: { type: Boolean, default: true }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  onboarding: {
    completed: { type: Boolean, default: false },
    completedAt: Date,
    fitnessProfile: {
      currentMetrics: {
        height: Number,  // in cm
        weight: Number,  // in kg
        age: Number,
        gender: {
          type: String,
          enum: ['male', 'female', 'other', 'prefer_not_to_say']
        },
        hypertension: {
          type: Boolean,
          default: false
        },
        diabetes: {
          type: Boolean,
          default: false
        },
        bodyType: {
          type: String,
          enum: ['underweight', 'normal', 'overweight', 'obuse']
        },
        fitnessGoalType: {
          type: String,
          enum: ['weight_gain', 'weight_loss']
        },
        fitnessType: {
          type: String,
          enum: ['muscular_fitness', 'cardio_fitness']
        },
        activityLevel: {
          type: String,
          enum: ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active']
        }
      },
      preferences: {
        workoutFrequency: {
          type: Number,  // days per week
          min: 1,
          max: 7
        },
        preferredWorkoutDuration: {
          type: Number,  // minutes
          min: 15,
          max: 120
        },
        workoutLocation: {
          type: String,
          enum: ['gym', 'home', 'outdoors', 'hybrid']
        },
        equipmentAccess: [{
          type: String,
          enum: ['full_gym', 'dumbbells', 'resistance_bands', 'bodyweight_only', 'cardio_machines']
        }],
        preferredWorkoutTypes: [{
          type: String,
          enum: ['strength_training', 'cardio', 'hiit', 'yoga', 'pilates', 'calisthenics']
        }],
        healthConditions: [{
          type: String,
          enum: ['none', 'back_pain', 'joint_pain', 'heart_condition', 'diabetes', 'pregnancy', 'other']
        }]
      }
    }
  },
  // Add workouts array to support WGER integration
  workouts: [workoutSchema],
  // Add favorites to allow users to bookmark exercises
  favoriteExercises: [{
    exerciseId: Number,
    name: String,
    category: String,
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Add workout history to track completed workouts
  workoutHistory: [{
    workoutId: mongoose.Schema.Types.ObjectId,
    workoutName: String,
    completedAt: {
      type: Date,
      default: Date.now
    },
    duration: Number, // in minutes
    notes: String
  }]
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password
userSchema.methods.matchPassword = async function(enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

const User = mongoose.model('User', userSchema);
module.exports = User;