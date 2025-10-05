const db = require('../config/database');

class ServiceRequest {
  // Create new service request
  static async create(serviceData) {
    const { user_id, service_type, service_data, total_price } = serviceData;
    
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO service_requests (user_id, service_type, service_data, total_price) 
        VALUES ($1, $2, $3, $4) RETURNING *
      `;
      
      db.query(query, [user_id, service_type, JSON.stringify(service_data), total_price], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.rows[0]);
        }
      });
    });
  }

  // Get user's service requests
  static async findByUserId(userId) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM service_requests WHERE user_id = $1 ORDER BY created_at DESC';
      
      db.query(query, [userId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          // Parse JSON service_data
          const parsedResults = result.rows.map(row => ({
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