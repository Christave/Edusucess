const db = require('../config/database');

class ServiceRequest {
  // Create new service request
  static async create(serviceData) {
    const { user_id, service_type, service_data, total_price } = serviceData;
    
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO service_requests (user_id, service_type, service_data, total_price) 
        VALUES (?, ?, ?, ?)
      `;
      
      // Convert service_data to JSON string for storage
      const serviceDataString = JSON.stringify(service_data);
      
      db.query(query, [user_id, service_type, serviceDataString, total_price], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve({ id: result.insertId, ...serviceData });
        }
      });
    });
  }

  // Get user's service requests
  static async findByUserId(userId) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM service_requests WHERE user_id = ? ORDER BY created_at DESC';
      
      db.query(query, [userId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          // Parse JSON service_data from TEXT field
          const parsedResults = results.map(row => ({
            ...row,
            service_data: JSON.parse(row.service_data)
          }));
          resolve(parsedResults);
        }
      });
    });
  }
}

module.exports = ServiceRequest;