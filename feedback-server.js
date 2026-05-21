const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3001;

// In-memory storage for feedback submissions
const feedbackSubmissions = [];

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Serve the feedback form HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'feedback-form.html'));
});

// GET endpoint to view all submissions (for testing)
app.get('/api/feedback', (req, res) => {
    res.json({
        success: true,
        count: feedbackSubmissions.length,
        submissions: feedbackSubmissions
    });
});

// POST endpoint for feedback submission
app.post('/feedback', (req, res) => {
    const { name, email, message } = req.body;
    
    // Validation errors array
    const errors = [];
    
    // Check required fields
    if (!name || name.trim() === '') {
        errors.push('Name is required');
    }
    
    if (!email || email.trim() === '') {
        errors.push('Email is required');
    }
    
    if (!message || message.trim() === '') {
        errors.push('Message is required');
    }
    
    // Basic email format validation
    if (email && email.trim() !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push('Invalid email format');
        }
    }
    
    // If there are validation errors, return 400 Bad Request
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors
        });
    }
    
    // Create submission object with timestamp
    const submission = {
        id: feedbackSubmissions.length + 1,
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        timestamp: new Date().toISOString()
    };
    
    // Store in memory array
    feedbackSubmissions.push(submission);
    
    // Return 201 Created with confirmation
    res.status(201).json({
        success: true,
        message: 'Feedback submitted successfully',
        submission: submission
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Feedback server running on http://localhost:${PORT}`);
    console.log(`Open http://localhost:${PORT} to access the feedback form`);
    console.log(`POST endpoint: http://localhost:${PORT}/feedback`);
});
