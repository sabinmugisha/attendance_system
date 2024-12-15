const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../models/db');
const router = express.Router();

// Sign-up Route
router.post('/signup', async (req, res) => {
  const { username, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const verificationCode = Math.floor(100000 + Math.random() * 900000);

  const newUser = { username, email, password: hashedPassword, role, verificationCode, verified: false };

  const query = 'INSERT INTO users SET ?';
  db.query(query, newUser, (err, result) => {
    if (err) return res.send('Error creating user.');
    const mailOptions = {
      from: 'sbdollar9@gmail.com',
      to: email,
      subject: 'Verify Your Email',
      text: `Your verification code is: ${verificationCode}`
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) return res.send('Error sending email.');
      res.send('Check your email for the verification code.');
    });
  });
});

// Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], async (err, results) => {
    if (err) return res.send('Error checking user.');
    const user = results[0];
    if (user && await bcrypt.compare(password, user.password) && user.verified) {
      req.session.user = user;
      res.redirect(user.role === 'staff' ? '/staff-dashboard' : '/parent-dashboard');
    } else {
      res.send('Invalid credentials or account not verified.');
    }
  });
});

// Verification Route
router.post('/verify', (req, res) => {
  const { email, code } = req.body;
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) return res.send('Error checking user.');
    const user = results[0];
    if (user && user.verificationCode === parseInt(code)) {
      const updateQuery = 'UPDATE users SET verified = true WHERE email = ?';
      db.query(updateQuery, [email], (err) => {
        if (err) return res.send('Error verifying account.');
        res.send('Account verified! You can now log in.');
      });
    } else {
      res.send('Invalid verification code.');
    }
  });
});

module.exports = router;
