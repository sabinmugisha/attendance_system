const express = require('express');
const router = express.Router();

// Example route for notifications
router.get('/', (req, res) => {
    res.send('Notifications route is working!');
});

module.exports = router;
