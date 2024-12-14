const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Fetch all emergency alerts
router.get('/', (req, res) => {
    db.query('SELECT * FROM emergency_alerts', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }
        // Pass the results as 'emergencyAlerts' to the view
        res.render('emergencyAlerts', { emergencyAlerts: results });
    });
});

// Add a new emergency alert
router.post('/add', (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).send('Message is required');
    }
    db.query('INSERT INTO emergency_alerts (message) VALUES (?)', [message], (err) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }
        res.redirect('/emergencyAlerts');
    });
});

// Delete an emergency alert
router.post('/delete/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM emergency_alerts WHERE id = ?', [id], (err) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }
        res.redirect('/emergencyAlerts');
    });
});

module.exports = router;
