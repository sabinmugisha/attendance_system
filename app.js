const express = require('express');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const db = require('./models/db'); // MySQL connection
const authMiddleware = require('./middleware/auth'); // Authentication middleware

const app = express();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Nodemailer setup for email sending
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sbdollar9@gmail.com',
    pass: 'rvnw yhmu zjnp aile',
  },
});

// Routes
const usersRoutes = require('./routes/users');
const notificationsRouter = require('./routes/notifications');
const studentsRoutes = require('./routes/students');
const weatherDataRoutes = require('./routes/weatherData');
const attendanceRoutes = require('./routes/attendance'); // Import attendance routes

// Use routes
app.use('/attendance', attendanceRoutes);  // Use attendance route
app.use('/notifications', notificationsRouter);
app.use('/students', studentsRoutes);
app.use('/users', usersRoutes);
app.use('/weatherData', weatherDataRoutes);

// Default route to redirect to login page
app.get('/', (req, res) => {
    res.redirect('/login'); // Redirect to login when visiting the root URL
});

// Protect routes with authentication middleware
app.get('/staff-dashboard', authMiddleware, (req, res) => {
    if (req.session.user && req.session.user.role === 'staff') {
        res.render('staffDashboard', { user: req.session.user }); // Pass the user object to the template
    } else {
        res.redirect('/login');
    }
});

app.get('/parent-dashboard', authMiddleware, (req, res) => {
    if (req.session.user && req.session.user.role === 'parent') {
        console.log('Current user:', req.session.user);  // Debugging line
        res.render('parentDashboard', { user: req.session.user });
    } else {
        res.redirect('/login');
    }
});

// Login handling
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Internal Server Error');
        }

        if (results.length === 0) {
            console.log('User not found:', email);
            return res.redirect('/login');
        }

        const user = results[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Password validation error:', err);
                return res.status(500).send('Internal Server Error');
            }

            if (isMatch) {
                req.session.user = user;
                console.log('Login successful for:', email);

                if (user.role === 'parent') {
                    return res.redirect('/parent-dashboard');
                } else if (user.role === 'staff') {
                    return res.redirect('/staff-dashboard');
                } else {
                    return res.redirect('/login');
                }
            } else {
                console.log('Invalid password for:', email);
                return res.redirect('/login');
            }
        });
    });
});

app.get('/login', (req, res) => {
    res.render('login'); // Render the login view
});

// Signup handling
app.post('/signup', (req, res) => {
    const { username, email, password, role } = req.body;

    // Validate required fields
    if (!username || !email || !password || !role) {
        console.log('Missing required fields');
        return res.status(400).send('All fields are required');
    }

    // Hash the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).send('Internal Server Error');
        }

        // Generate a random verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000);

        // Insert user into the database
        const newUser = {
            username,
            email,
            password: hashedPassword,
            role,
            verified: false,
            verificationCode,
        };

        db.query('INSERT INTO users SET ?', newUser, (err) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send('Internal Server Error');
            }

            // Send verification email
            const mailOptions = {
                from: 'sbdollar9@gmail.com',
                to: email,
                subject: 'Verify Your Account',
                text: `Hi ${username},\n\nYour verification code is: ${verificationCode}\n\nPlease enter this code on the verification page to activate your account.\n\nThank you!`,
            };

            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error('Error sending email:', err);
                    return res.status(500).send('Could not send verification email');
                }

                console.log('Verification email sent:', info.response);
                res.redirect('/verify'); // Redirect to verification page
            });
        });
    });
});

// Serve the signup page
app.get('/signup', (req, res) => {
    res.render('signup'); // Render the signup view (signup.ejs)
});

// Serve the verification page
app.get('/verify', (req, res) => {
    res.render('verify'); // Render the verification view (verify.ejs)
});

// Handle account verification
app.post('/verify', (req, res) => {
    const { email, verificationCode } = req.body;

    db.query('SELECT * FROM users WHERE email = ? AND verificationCode = ?', [email, verificationCode], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Internal Server Error');
        }

        if (results.length === 0) {
            console.log('Invalid verification code or email');
            return res.status(400).send('Invalid verification code or email');
        }

        // Mark user as verified
        db.query('UPDATE users SET verified = true WHERE email = ?', [email], (err) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send('Internal Server Error');
            }

            console.log('User verified:', email);
            res.redirect('/login'); // Redirect to login page after successful verification
        });
    });
});

// Logout handling
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error during logout');
        }
        res.redirect('/login');
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
