const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth');
const patientsController = require('../controllers/patientsController');

router.get('/isapres', authMiddleware, patientsController.getIsapres);
router.get('/genders', authMiddleware, patientsController.getGenders);
router.get('/countries', authMiddleware, patientsController.getCountries);
router.post('/', authMiddleware, patientsController.createPatient);
router.get('/', authMiddleware, patientsController.getAllPatients); // Fetch a single user by ID
router.get('/:id', authMiddleware, patientsController.getPatientById);
router.put('/:id', authMiddleware, patientsController.updatePatient); // Update a user

module.exports = router;






