const express = require('express');
const router = express.Router();
const db = require('../models/db'); // MySQL connection

// Route to view all weather data
router.get('/', (req, res) => {
  db.query('SELECT * FROM weather_data ORDER BY timestamp DESC', (err, results) => {
    if (err) throw err;
    res.render('weatherData', { weatherData: results });
  });
});

// Route to add new weather data
router.get('/create', (req, res) => {
  res.render('createWeatherData'); // Render the form to create new weather data
});

// Handle adding weather data via POST
router.post('/create', (req, res) => {
  const { location, temperature, humidity, wind_speed } = req.body;
  const timestamp = new Date();
  db.query(
    'INSERT INTO weather_data (location, temperature, humidity, wind_speed, timestamp) VALUES (?, ?, ?, ?, ?)',
    [location, temperature, humidity, wind_speed, timestamp],
    (err, results) => {
      if (err) throw err;
      res.redirect('/weatherData'); // Redirect to view weather data after adding
    }
  );
});

// Route to delete weather data
router.post('/delete/:id', (req, res) => {
  const weatherDataId = req.params.id;
  db.query('DELETE FROM weather_data WHERE id = ?', [weatherDataId], (err, results) => {
    if (err) throw err;
    res.redirect('/weatherData'); // Redirect to the list of weather data after deletion
  });
});

module.exports = router;
