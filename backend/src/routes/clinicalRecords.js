const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth');
const clinicalRecordsController = require('../controllers/clinicalRecordsController');

router.put('/:id', authMiddleware, clinicalRecordsController.updateClinicalRecord);
router.delete('/:id', authMiddleware, clinicalRecordsController.deleteClinicalRecord);
router.get('/patients/name', authMiddleware, clinicalRecordsController.getPatientsName);
router.get('/:id/with-relations', authMiddleware, clinicalRecordsController.getClinicalRecordWithRelations);
router.get('/', authMiddleware, clinicalRecordsController.getAllrecords);
router.post('/', authMiddleware, clinicalRecordsController.createClinicalRecordWithRelations);
router.post('/generatePDF/:id', authMiddleware, clinicalRecordsController.generatePDF);

// New routes for getting all indications and controls
router.get('/indications', authMiddleware, clinicalRecordsController.getAllIndications);
router.get('/controls', authMiddleware, clinicalRecordsController.getAllControls);

module.exports = router;