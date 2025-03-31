const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const router = express.Router();
const JWT_SECRET = 'your_jwt_secret'; // In production, use environment variable

// Helper function to read CSV files
const readCsv = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
};

// Register a user
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    
    const usersPath = path.join(__dirname, '..', 'data', 'users.csv');
    
    // Check if user already exists
    const users = await readCsv(usersPath);
    const existingUser = users.find(user => user.email === email);
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Add user to CSV
    const csvWriter = createCsvWriter({
      path: usersPath,
      header: [
        { id: 'email', title: 'email' },
        { id: 'password', title: 'password' }
      ],
      append: true
    });
    
    await csvWriter.writeRecords([{ email, password: hashedPassword }]);
    
    // Generate JWT token
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
    
    res.status(201).json({ token });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login a user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    
    const usersPath = path.join(__dirname, '..', 'data', 'users.csv');
    
    // Find user
    const users = await readCsv(usersPath);
    const user = users.find(user => user.email === email);
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ token, email });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
