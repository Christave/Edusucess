const express = require('express');
const ServiceRequest = require('../models/ServiceRequest');
const auth = require('../middleware/auth');
const router = express.Router();

// All routes require authentication
router.use(auth);

// Create service request - SIMPLIFIED
router.post('/request', async (req, res) => {
    try {
        console.log('Received service request:', req.body);
        console.log('User making request:', req.user);

        const { service_type, service_data, total_price } = req.body;

        // Basic validation
        if (!service_type || !service_data || !total_price) {
            return res.status(400).json({
                success: false,
                message: 'Service type, data, and price are required'
            });
        }

        // Create service request
        const serviceRequest = await ServiceRequest.create({
            user_id: req.user.id,
            service_type,
            service_data,
            total_price
        });

        console.log('Service request created:', serviceRequest);

        res.status(201).json({
            success: true,
            message: 'Service request created successfully',
            data: {
                service_request: serviceRequest
            }
        });

    } catch (error) {
        console.error('Service request error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating service request: ' + error.message
        });
    }
});

// Get user's service requests
router.get('/my-requests', async (req, res) => {
    try {
        const serviceRequests = await ServiceRequest.findByUserId(req.user.id);

        res.json({
            success: true,
            data: {
                service_requests: serviceRequests
            }
        });

    } catch (error) {
        console.error('Get service requests error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching service requests'
        });
    }
});

module.exports = router;