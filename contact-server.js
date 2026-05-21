const express = require('express');
const path = require('path');

const app = express();
const PORT = 3002;

// Middleware: express.json() to parse JSON request bodies
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Serve the contact form HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact-form.html'));
});

// POST endpoint for contact form submission
app.post('/contact', (req, res) => {
    const { name, email, subject, message } = req.body;
    
    // Validation errors array
    const errors = [];
    
    // Backend validation: Check required fields
    if (!name || name.trim() === '') {
        errors.push('Name is required');
    }
    
    if (!email || email.trim() === '') {
        errors.push('Email is required');
    }
    
    if (!subject || subject.trim() === '') {
        errors.push('Subject is required');
    }
    
    if (!message || message.trim() === '') {
        errors.push('Message is required');
    }
    
    // Backend validation: Email format check
    if (email && email.trim() !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push('Invalid email format');
        }
    }
    
    // If there are validation errors, return 400 Bad Request with error details
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors
        });
    }
    
    // Success: Return { success: true }
    res.status(200).json({
        success: true,
        message: 'Contact form submitted successfully'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Contact server running on http://localhost:${PORT}`);
    console.log(`Open http://localhost:${PORT} to access the contact form`);
    console.log(`POST endpoint: http://localhost:${PORT}/contact`);
});
