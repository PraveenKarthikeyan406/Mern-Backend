const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// ✅ Define User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// ✅ Use or create the model
const User = mongoose.models.User || mongoose.model('User', userSchema);

// ✅ Signup Route
router.post('/signup', async (req, res) => {
  console.log('📥 Signup Request Received:', req.body);
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    console.error('❌ Signup error:', error);
    res.status(500).json({ message: 'Error during signup', error });
  }
});

// ✅ Login Route
router.post('/login', async (req, res) => {
  console.log('📥 Login Request Received:', req.body);
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    res.status(200).json({ message: 'Login successful', username: user.username });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Error during login', error });
  }
});

module.exports = router;
