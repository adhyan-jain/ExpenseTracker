const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Create users.csv if it doesn't exist
const usersPath = path.join(dataDir, 'users.csv');
if (!fs.existsSync(usersPath)) {
  fs.writeFileSync(usersPath, 'email,password\n');
}

// Create transactions.csv if it doesn't exist
const transactionsPath = path.join(dataDir, 'transactions.csv');
if (!fs.existsSync(transactionsPath)) {
  fs.writeFileSync(transactionsPath, 'id,email,category,amount,date,account,notes,type,icon\n');
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/predictions', require('./routes/predictions'));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
