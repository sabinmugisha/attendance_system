const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

const attendanceRoutes = require('./routes/attendance');
const emergencyAlertsRoutes = require('./routes/emergencyAlerts');
const notificationsRouter = require('./routes/notifications');  // notifications route
const studentsRoutes = require('./routes/students');
const usersRoutes = require('./routes/users');
const weatherDataRoutes = require('./routes/weatherData');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/attendance', attendanceRoutes);
app.use('/emergencyAlerts', emergencyAlertsRoutes);
app.use('/notifications', notificationsRouter);  // This is correct
app.use('/students', studentsRoutes);
app.use('/users', usersRoutes);
app.use('/weatherData', weatherDataRoutes);

app.get('/adminDashboard', (req, res) => {
    res.render('adminDashboard');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
