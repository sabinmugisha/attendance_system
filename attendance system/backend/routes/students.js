const express = require('express');
const router = express.Router();
const connection = require('../models/db');

// Get all students
router.get('/', (req, res) => {
    connection.query('SELECT * FROM students', (err, results) => {
        if (err) {
            console.error('Error fetching students:', err);
            res.status(500).send('Server Error');
            return;
        }
        res.render('students', { students: results });
    });
});

// Add new student
router.post('/add', (req, res) => {
    const { name, email } = req.body;
    const query = 'INSERT INTO students (name, email) VALUES (?, ?)';
    connection.query(query, [name, email], (err, result) => {
        if (err) {
            console.error('Error adding student:', err);
            res.status(500).send('Server Error');
            return;
        }
        res.redirect('/students');
    });
});

module.exports = router;
