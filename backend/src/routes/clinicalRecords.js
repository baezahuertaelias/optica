const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth');
const clinicalRecordsController = require('../controllers/clinicalRecordsController');



router.get('/detail/:id', /*authMiddleware,*/ clinicalRecordsController.getClinicalRecordWithRelations)
router.post('/', /*authMiddleware,*/ clinicalRecordsController.createClinicalRecordWithRelations)
router.get('/', /* authMiddleware, */ clinicalRecordsController.getAllClinicalRecords); // Fetch a single user by ID
router.get('/patients/aaa', authMiddleware, clinicalRecordsController.getPatientsName)

//router.get('/:id', authMiddleware, patientsController.getPatientById);
//router.post('/', authMiddleware, patientsController.createPatient);


//router.get('/isapres', authMiddleware, patientsController.getIsapres);
//router.get('/genders', authMiddleware, patientsController.getGenders);
//router.get('/', authMiddleware, patientsController.getAllPatients); // Fetch a single user by ID
//router.put('/:id', authMiddleware, patientsController.updatePatient); // Update a user

module.exports = router;






