const mysql = require('mysql');

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Default XAMPP MySQL username
  password: '', // Default XAMPP MySQL password (empty by default)
  database: 'schoolApp' // Your database name
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database.');
});

module.exports = db;
