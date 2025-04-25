const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/users', authMiddleware, authController.getAllUsers); // Assuming this controller method exists


module.exports = router;