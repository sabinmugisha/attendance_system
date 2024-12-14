const express = require('express');
const router = express.Router();
const connection = require('../models/db'); // Ensure your database connection is correct

// Route to display notifications
router.get('/', (req, res) => {
    connection.query('SELECT * FROM notifications ORDER BY created_at DESC', (err, results) => {
        if (err) throw err;
        res.render('notifications', { notifications: results });
    });
});

// Route to handle sending notifications
router.post('/send', (req, res) => {
    const { message, role } = req.body;

    // Query to send notification based on selected role
    let query = 'INSERT INTO notifications (message, created_at) VALUES (?, NOW())';
    if (role === 'staff') {
        query = 'INSERT INTO notifications (message, created_at, target_role) VALUES (?, NOW(), "staff")';
    } else if (role === 'parent') {
        query = 'INSERT INTO notifications (message, created_at, target_role) VALUES (?, NOW(), "parent")';
    } else if (role === 'all') {
        query = 'INSERT INTO notifications (message, created_at, target_role) VALUES (?, NOW(), "all")';
    }

    // Insert the notification into the database
    connection.query(query, [message], (err, results) => {
        if (err) throw err;
        res.redirect('/notifications'); // Redirect back to the notifications page
    });
});

// Delete notification route (assuming this functionality exists)
router.post('/delete/:id', (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM notifications WHERE id = ?', [id], (err, results) => {
        if (err) throw err;
        res.redirect('/notifications');
    });
});

module.exports = router;
