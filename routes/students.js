const express = require('express');
const router = express.Router();
const db = require('../models/db'); // MySQL connection

// Route to view all students
router.get('/', (req, res) => {
  db.query('SELECT * FROM students', (err, results) => {
    if (err) throw err;
    res.render('students', { students: results });
  });
});

// Route to view an individual student's details
router.get('/:id', (req, res) => {
  const studentId = req.params.id;
  db.query('SELECT * FROM students WHERE id = ?', [studentId], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      res.render('viewStudent', { student: results[0] });
    } else {
      res.send('Student not found');
    }
  });
});

// Route to create a new student
router.get('/create', (req, res) => {
  res.render('createStudent'); // Render form to create a new student
});

// Handle creating a student via POST
router.post('/create', (req, res) => {
  const { name, email, grade } = req.body;
  db.query('INSERT INTO students (name, email, grade) VALUES (?, ?, ?)', [name, email, grade], (err, results) => {
    if (err) throw err;
    res.redirect('/students'); // Redirect to the list of students after adding
  });
});

// Route to edit a student's data
router.get('/edit/:id', (req, res) => {
  const studentId = req.params.id;
  db.query('SELECT * FROM students WHERE id = ?', [studentId], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      res.render('editStudent', { student: results[0] });
    } else {
      res.send('Student not found');
    }
  });
});

// Handle updating a student's data
router.post('/edit/:id', (req, res) => {
  const studentId = req.params.id;
  const { name, email, grade } = req.body;
  db.query('UPDATE students SET name = ?, email = ?, grade = ? WHERE id = ?', [name, email, grade, studentId], (err, results) => {
    if (err) throw err;
    res.redirect('/students'); // Redirect to the list of students after editing
  });
});

// Route to delete a student
router.post('/delete/:id', (req, res) => {
  const studentId = req.params.id;
  db.query('DELETE FROM students WHERE id = ?', [studentId], (err, results) => {
    if (err) throw err;
    res.redirect('/students'); // Redirect to the list of students after deletion
  });
});

module.exports = router;
