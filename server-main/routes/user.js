const express = require('express');
const router = express.Router();
const { 
  updateProfile, 
  updateSettings, 
  deleteAccount, 
  getUserProfile
} = require('../controllers/userController');
const auth = require('../middleware/auth');

router.get('/profile', auth, getUserProfile);
router.patch('/profile', auth, updateProfile);
router.patch('/settings', auth, updateSettings);
router.delete('/account', auth, deleteAccount);

router.get('/settings', auth, async (req, res) => {
  try {
    res.send({ settings: req.user.settings });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;