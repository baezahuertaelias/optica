const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');


const router = express.Router();

router.get('/:id', authMiddleware, authController.findOneUser); // Fetch a single user by ID
router.get('/', authMiddleware, authController.getAllUsers); // Fetch a single user by ID

router.post('/', authController.registerUser);
router.put('/:id', authMiddleware, authController.updateUser); // Update a user

router.delete('/:id', authMiddleware, authController.deleteUser); // Delete a user

// New route to get all UserTypes
router.get('/types/typeusers', authMiddleware, authController.getAllTypeUsers);

module.exports = router;