const router = require('express').Router();

const authRoutes = require('./auth');
const userRoutes = require('./user');
const patientRoutes = require('./patients');
const clinicalRecordsRoutes = require('./clinicalRecords');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/patients', patientRoutes);
router.use('/clinicalRecords', clinicalRecordsRoutes);

module.exports = router;