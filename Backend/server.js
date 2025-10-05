const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = require('./config/database');

// Test database connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed: ', err);
    return;
  }
  console.log('Connected to MySQL database');
  connection.release();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/services', require('./routes/services'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'EduSuccess Backend API' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});