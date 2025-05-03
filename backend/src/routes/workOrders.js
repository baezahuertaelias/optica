const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth');
const workOrderController = require('../controllers/workOrderController');



/* router.post('/', authMiddleware, clinicalRecordsController.createClinicalRecordWithRelations)
router.get('/', authMiddleware, clinicalRecordsController.getAllClinicalRecords); */


/* router.get('/patients/list', authMiddleware, workOrderController.getPatientsName)
router.get('/doctors/list', authMiddleware, workOrderController.getDoctorsName)
router.get('/typeappointments/list', authMiddleware, workOrderController.getTypeAppointments)

router.get('/doctors/:idUser', authMiddleware, workOrderController.getAppointmentByUser) */

//router.get('/:id', authMiddleware, patientsController.getPatientById);
//router.post('/', authMiddleware, patientsController.createPatient);


//router.get('/isapres', authMiddleware, patientsController.getIsapres);
//router.get('/genders', authMiddleware, patientsController.getGenders);
//router.get('/', authMiddleware, patientsController.getAllPatients); // Fetch a single user by ID
//router.put('/:id', authMiddleware, patientsController.updatePatient); // Update a user

module.exports = router;






