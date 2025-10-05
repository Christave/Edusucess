const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Create tables one by one
function createTables() {
  // Users table
  const usersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      phone VARCHAR(20) NOT NULL,
      institution VARCHAR(255) NOT NULL,
      education_level ENUM('HND', 'B.Tech', 'BSc', 'Masters') NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  // Service requests table
  const serviceRequestsTable = `
    CREATE TABLE IF NOT EXISTS service_requests (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      service_type ENUM('cv', 'design', 'writing') NOT NULL,
      service_data TEXT NOT NULL,
      total_price DECIMAL(10,2) NOT NULL,
      status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `;

  // Execute users table creation
  connection.query(usersTable, (err) => {
    if (err) {
      console.error('Error creating users table:', err);
      return;
    }
    console.log('Users table created or already exists');

    // Execute service_requests table creation after users table
    connection.query(serviceRequestsTable, (err) => {
      if (err) {
        console.error('Error creating service_requests table:', err);
        return;
      }
      console.log('Service requests table created or already exists');
    });
  });
}

// Call the function to create tables
createTables();

module.exports = connection;