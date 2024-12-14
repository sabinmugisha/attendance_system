// routes/users.js
const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Get all users
router.get('/', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }
        res.render('users', { users: results });
    });
});

// Add a new user
router.post('/add', (req, res) => {
    const { username, password, role, email } = req.body;
    
    // Ensure username, password, role, and email are provided
    if (username == null || password == null || role == null || email == null) {
        return res.status(400).send('Username, password, role, and email are required');
    }

    // Check if the role is valid
    if (role !== 'admin' && role !== 'user') {
        return res.status(400).send('Invalid role');
    }

    // Insert the new user, including the email
    db.query('INSERT INTO users (username, password, role, email) VALUES (?, ?, ?, ?)', 
    [username, password, role, email], (err) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }
        res.redirect('/users');
    });
});

// Update user role and email
router.post('/update/:id', (req, res) => {
    const { id } = req.params;
    const { role, email } = req.body;

    // Ensure valid role
    if (role !== 'admin' && role !== 'user') {
        return res.status(400).send('Invalid role');
    }

    // Update both role and email
    db.query('UPDATE users SET role = ?, email = ? WHERE id = ?', [role, email, id], (err) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }
        res.redirect('/users');
    });
});

// Delete user
router.post('/delete/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM users WHERE id = ?', [id], (err) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }
        res.redirect('/users');
    });
});

module.exports = router;
