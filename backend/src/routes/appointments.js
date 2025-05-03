const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth');
const appointmentController = require('../controllers/appointmentController');

// Get all appointments
router.get('/', authMiddleware, appointmentController.getFullAgenda);

// Get list endpoints for dropdowns and selectors
router.get('/patients/list', authMiddleware, appointmentController.getPatientsName);
router.get('/doctors/list', authMiddleware, appointmentController.getDoctorsName);
router.get('/typeappointments/list', authMiddleware, appointmentController.getTypeAppointments);

// Get appointments by user ID
router.get('/user/:id', authMiddleware, appointmentController.getAppointmentByUser);

// Get a single appointment by ID
router.get('/appointment/:id', authMiddleware, appointmentController.getAppointmentById);

// Create a new appointment
router.post('/', authMiddleware, appointmentController.createAppointment);

// Update an existing appointment
router.put('/:id', authMiddleware, appointmentController.updateAppointment);

// Delete an appointment (mark as inactive)
router.delete('/:id', authMiddleware, appointmentController.deleteAppointment);

module.exports = router;