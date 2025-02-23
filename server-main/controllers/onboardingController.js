const User = require('../models/User');

const submitOnboardingQuiz = async (req, res) => {
  try {
    const {
      currentMetrics,
      preferences
    } = req.body;

    // Validate required fields
    if (!currentMetrics || !preferences) {
      return res.status(400).send({
        error: 'Missing required onboarding information'
      });
    }

    // Validate specific current metrics fields
    const requiredMetrics = [
      'height',
      'weight',
      'age',
      'gender',
      'hypertension',
      'diabetes',
      'bodyType',
      'fitnessGoalType',
      'fitnessType'
    ];

    const missingMetrics = requiredMetrics.filter(field => 
      !currentMetrics.hasOwnProperty(field));

    if (missingMetrics.length > 0) {
      return res.status(400).send({
        error: `Missing required metrics: ${missingMetrics.join(', ')}`
      });
    }

    // Validate enum values
    const validBodyTypes = ['underweight', 'normal', 'overweight', 'obese'];
    const validFitnessGoalTypes = ['weight_gain', 'weight_loss'];
    const validFitnessTypes = ['muscular_fitness', 'cardio_fitness'];

    if (!validBodyTypes.includes(currentMetrics.bodyType)) {
      return res.status(400).send({
        error: 'Invalid body type'
      });
    }

    if (!validFitnessGoalTypes.includes(currentMetrics.fitnessGoalType)) {
      return res.status(400).send({
        error: 'Invalid fitness goal type'
      });
    }

    if (!validFitnessTypes.includes(currentMetrics.fitnessType)) {
      return res.status(400).send({
        error: 'Invalid fitness type'
      });
    }

    // Update user's onboarding information
    req.user.onboarding = {
      completed: true,
      completedAt: new Date(),
      fitnessProfile: {
        currentMetrics,
        preferences
      }
    };

    await req.user.save();

    res.send({
      message: 'Onboarding completed successfully',
      onboarding: req.user.onboarding
    });
  } catch (error) {
    console.error('Onboarding submission error:', error);
    res.status(500).send({
      error: 'Error saving onboarding information'
    });
  }
};

const getOnboardingStatus = async (req, res) => {
  try {
    res.send({
      onboarding: req.user.onboarding
    });
  } catch (error) {
    console.error('Onboarding status error:', error);
    res.status(500).send({
      error: 'Error fetching onboarding status'
    });
  }
};

const updateOnboardingInfo = async (req, res) => {
  try {
    const updates = req.body;
    
    // Merge existing onboarding data with updates
    req.user.onboarding.fitnessProfile = {
      ...req.user.onboarding.fitnessProfile,
      ...updates
    };

    await req.user.save();

    res.send({
      message: 'Onboarding information updated successfully',
      onboarding: req.user.onboarding
    });
  } catch (error) {
    console.error('Onboarding update error:', error);
    res.status(500).send({
      error: 'Error updating onboarding information'
    });
  }
};

module.exports = {
  submitOnboardingQuiz,
  getOnboardingStatus,
  updateOnboardingInfo
};