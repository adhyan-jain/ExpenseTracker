const express = require('express');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const { LinearRegression } = require('ml-regression');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const transactions = await readCSV();
    const userTransactions = transactions.filter(t => t.email === req.query.email);
    
    // Prepare data for ML model
    const data = userTransactions.map((t, index) => ({
      x: index,
      y: parseFloat(t.amount)
    }));
    
    // Train model
    const X = data.map(d => d.x);
    const y = data.map(d => d.y);
    const model = new LinearRegression(X, y);
    
    // Generate predictions
    const predictions = Array.from({ length: 6 }, (_, i) => ({
      month: `Month ${i+1}`,
      predicted: model.predict(X.length + i)
    }));
    
    res.json(predictions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Prediction failed' });
  }
});

function readCSV() {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(path.join(__dirname, '../data/transactions.csv'))
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

module.exports = router;
