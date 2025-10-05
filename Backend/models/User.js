const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Create new user
  static async create(userData) {
    const { name, email, phone, institution, education_level, password } = userData;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO users (name, email, phone, institution, education_level, password) 
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      
      db.query(query, [name, email, phone, institution, education_level, hashedPassword], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve({ id: result.insertId, ...userData });
        }
      });
    });
  }

  // Find user by email
  static async findByEmail(email) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM users WHERE email = ?';
      
      db.query(query, [email], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0]);
        }
      });
    });
  }

  // Find user by ID
  static async findById(id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT id, name, email, phone, institution, education_level, created_at FROM users WHERE id = ?';
      
      db.query(query, [id], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0]);
        }
      });
    });
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;