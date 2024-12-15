const express = require('express');
const router = express.Router();
const db = require('../models/db'); // MySQL connection

// Route to view attendance records
router.get('/', (req, res) => {
    db.query('SELECT * FROM attendance ORDER BY date DESC', (err, results) => {
      if (err) throw err;
      res.render('attendance', { attendanceData: results });
    });
  });
  

// Route to create attendance record
router.get('/create', (req, res) => {
  res.render('createAttendance'); // Form to create attendance
});

// Handle adding attendance data via POST
router.post('/create', (req, res) => {
    const { studentName, date, status, class: studentClass } = req.body;
    db.query(
      'INSERT INTO attendance (studentName, date, status, class) VALUES (?, ?, ?, ?)',
      [studentName, date, status, studentClass],
      (err, results) => {
        if (err) throw err;
        res.redirect('/attendance'); // Redirect to attendance list
      }
    );
  });
  

module.exports = router;
