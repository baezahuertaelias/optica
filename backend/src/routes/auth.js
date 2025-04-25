const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/register', authController.registerUser);
router.post('/login', authController.login);


// Added routes for CRUD operations

router.get('/users/:id', authMiddleware, authController.findOneUser); // Fetch a single user by ID
router.get('/users', authMiddleware, authController.getAllUsers); // Fetch a single user by ID
router.put('/users/:id', authMiddleware, authController.updateUser); // Update a user
router.delete('/users/:id', authMiddleware, authController.deleteUser); // Delete a user

// New route to get all UserTypes
router.get('/usertypes', authMiddleware, authController.getAllUserTypes);



module.exports = router;