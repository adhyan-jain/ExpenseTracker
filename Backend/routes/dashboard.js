const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

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

// Get dashboard data for a user
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
    
    // Calculate balances
    let totalIncome = 0;
    let totalExpenses = 0;
    let walletBalance = 0;
    let bankBalance = 0;
    let creditCardBalance = 0;
    
    userTransactions.forEach(transaction => {
      const amount = parseFloat(transaction.amount);
      if (transaction.type === 'income') {
        totalIncome += amount;
        if (transaction.account === 'Wallet') {
          walletBalance += amount;
        } else if (transaction.account === 'Bank account') {
          bankBalance += amount;
        }
      } else if (transaction.type === 'expense') {
        totalExpenses += amount;
        if (transaction.account === 'Wallet') {
          walletBalance -= amount;
        } else if (transaction.account === 'Bank account') {
          bankBalance -= amount;
        } else if (transaction.account === 'Credit card') {
          creditCardBalance -= amount;
        }
      }
    });
    
    // Calculate this month's data
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    
    const thisMonthTransactions = userTransactions.filter(transaction => {
      const txDate = new Date(transaction.date);
      return txDate.getMonth() === thisMonth && txDate.getFullYear() === thisYear;
    });
    
    let thisMonthIncome = 0;
    let thisMonthExpenses = 0;
    
    thisMonthTransactions.forEach(transaction => {
      const amount = parseFloat(transaction.amount);
      if (transaction.type === 'income') {
        thisMonthIncome += amount;
      } else if (transaction.type === 'expense') {
        thisMonthExpenses += amount;
      }
    });
    
    // Calculate last month's data
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastYear = thisMonth === 0 ? thisYear - 1 : thisYear;
    
    const lastMonthTransactions = userTransactions.filter(transaction => {
      const txDate = new Date(transaction.date);
      return txDate.getMonth() === lastMonth && txDate.getFullYear() === lastYear;
    });
    
    let lastMonthIncome = 0;
    let lastMonthExpenses = 0;
    
    lastMonthTransactions.forEach(transaction => {
      const amount = parseFloat(transaction.amount);
      if (transaction.type === 'income') {
        lastMonthIncome += amount;
      } else if (transaction.type === 'expense') {
        lastMonthExpenses += amount;
      }
    });
    
    // Format the response
    const dashboardData = {
      balance: walletBalance + bankBalance,
      creditCards: creditCardBalance,
      total: walletBalance + bankBalance + creditCardBalance,
      thisMonth: {
        income: thisMonthIncome,
        expenses: thisMonthExpenses,
        total: thisMonthIncome - thisMonthExpenses,
        incomePercentage: thisMonthIncome + thisMonthExpenses === 0 ? 0 : Math.round((thisMonthIncome / (thisMonthIncome + thisMonthExpenses)) * 100),
        expensesPercentage: thisMonthIncome + thisMonthExpenses === 0 ? 0 : Math.round((thisMonthExpenses / (thisMonthIncome + thisMonthExpenses)) * 100)
      },
      lastMonth: {
        income: lastMonthIncome,
        expenses: lastMonthExpenses,
        total: lastMonthIncome - lastMonthExpenses,
        incomePercentage: lastMonthIncome + lastMonthExpenses === 0 ? 0 : Math.round((lastMonthIncome / (lastMonthIncome + lastMonthExpenses)) * 100),
        expensesPercentage: lastMonthIncome + lastMonthExpenses === 0 ? 0 : Math.round((lastMonthExpenses / (lastMonthIncome + lastMonthExpenses)) * 100)
      },
      accounts: [
        {
          name: 'Wallet',
          balance: walletBalance,
          currency: 'USD - $'
        },
        {
          name: 'Bank account',
          balance: bankBalance,
          currency: 'USD - $'
        }
      ],
      creditCardsDetails: [
        {
          name: 'Credit card',
          balance: Math.abs(creditCardBalance),
          percentUsed: 19
        }
      ]
    };
    
    res.json(dashboardData);
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
