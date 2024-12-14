const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Get all weather data
router.get('/', (req, res) => {
    db.query('SELECT * FROM weather_data', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }
        // Passing 'weatherData' to the EJS template
        res.render('weatherData', { weatherData: results });
    });
});

// Add new weather data
router.post('/add', (req, res) => {
    const { temperature, humidity } = req.body;
    if (temperature == null || humidity == null) {
        return res.status(400).send('Temperature and humidity are required');
    }

    db.query('INSERT INTO weather_data (temperature, humidity) VALUES (?, ?)', [temperature, humidity], (err) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }
        res.redirect('/weatherData');
    });
});

// Delete weather data
router.post('/delete/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM weather_data WHERE id = ?', [id], (err) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }
        res.redirect('/weatherData');
    });
});

module.exports = router;
