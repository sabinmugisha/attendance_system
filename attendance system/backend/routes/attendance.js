const express = require('express');
const router = express.Router();
const connection = require('../models/db');

// Get all attendance records
router.get('/', (req, res) => {
    connection.query('SELECT * FROM attendance', (err, results) => {
        if (err) {
            console.error('Error fetching attendance:', err);
            res.status(500).send('Server Error');
            return;
        }
        res.render('attendance', { attendance: results });
    });
});

// Add attendance record
router.post('/add', (req, res) => {
    const { student_id, date, status } = req.body;
    const query = 'INSERT INTO attendance (student_id, date, status) VALUES (?, ?, ?)';
    connection.query(query, [student_id, date, status], (err, result) => {
        if (err) {
            console.error('Error adding attendance:', err);
            res.status(500).send('Server Error');
            return;
        }
        res.redirect('/attendance');
    });
});

module.exports = router;
