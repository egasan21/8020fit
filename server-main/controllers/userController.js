const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private (Bearer Token required)
const getUserProfile = async (req, res) => {
  if (!req.user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(req.user);  // req.user is set by the protect middleware
};

const updateProfile = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['firstName', 'lastName', 'company', 'position', 'phone'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));
  
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }
  
  try {
    updates.forEach(update => req.user.profile[update] = req.body[update]);
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateSettings = async (req, res) => {
  try {
    const { emailNotifications, pushNotifications, darkMode, autoSave } = req.body;
    
    req.user.settings = {
      ...req.user.settings,
      emailNotifications,
      pushNotifications,
      darkMode,
      autoSave
    };
    
    await req.user.save();
    res.send({ settings: req.user.settings });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const deleteAccount = async (req, res) => {
  try {
    // Require password confirmation for security
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).send({ 
        error: 'Password is required to delete account' 
      });
    }

    // Verify password
    const isMatch = await req.user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).send({ 
        error: 'Incorrect password' 
      });
    }

    // Delete the user
    await User.findByIdAndDelete(req.user._id);

    res.send({ 
      message: 'Account successfully deleted' 
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).send({ 
      error: 'Error deleting account' 
    });
  }
};

module.exports = {
  getUserProfile,
  updateProfile,
  updateSettings,
  deleteAccount
};
