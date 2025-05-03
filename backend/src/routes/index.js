const router = require('express').Router();

const authRoutes = require('./auth');
const userRoutes = require('./users');
const patientRoutes = require('./patients');
const clinicalRecordsRoutes = require('./clinicalRecords');
const workOrderRoutes = require('./workOrders');
const appointmentRoutes = require('./appointments')

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/patients', patientRoutes);
router.use('/clinicalRecords', clinicalRecordsRoutes);
router.use('/workOrders', workOrderRoutes);
router.use('/appointments', appointmentRoutes);

module.exports = router;