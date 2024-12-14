const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // change to your MySQL username
    password: '', // change to your MySQL password
    database: 'attendance_system' // change to your database name
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        return;
    }
    console.log('Connected to the database');
});

module.exports = connection;
