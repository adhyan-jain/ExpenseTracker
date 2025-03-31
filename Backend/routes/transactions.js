const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

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

// Get all transactions for a user
router.get('/', async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    const transactionsPath = path.join(__dirname, '..', 'data', 'transactions.csv');
    
    // Read and filter transactions by email
    const transactions = await readCsv(transactionsPath);
    const userTransactions = transactions.filter(transaction => transaction.email === email);
    
    res.json(userTransactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new transaction
router.post('/', async (req, res) => {
  try {
    const { email, category, amount, date, account, notes, type, icon } = req.body;
    
    if (!email || !category || !amount || !date || !type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const transactionsPath = path.join(__dirname, '..', 'data', 'transactions.csv');
    
    // Create a new transaction
    const newTransaction = {
      id: uuidv4(),
      email,
      category,
      amount,
      date,
      account: account || 'Wallet',
      notes: notes || '',
      type,
      icon: icon || (type === 'income' ? 'income' : category.toLowerCase())
    };
    
    // Save to CSV
    const csvWriter = createCsvWriter({
      path: transactionsPath,
      header: [
        { id: 'id', title: 'id' },
        { id: 'email', title: 'email' },
        { id: 'category', title: 'category' },
        { id: 'amount', title: 'amount' },
        { id: 'date', title: 'date' },
        { id: 'account', title: 'account' },
        { id: 'notes', title: 'notes' },
        { id: 'type', title: 'type' },
        { id: 'icon', title: 'icon' }
      ],
      append: true
    });
    
    await csvWriter.writeRecords([newTransaction]);
    
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error('Add transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
