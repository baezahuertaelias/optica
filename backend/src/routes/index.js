const router = require('express').Router();

const authRoutes = require('./auth');
const userRoutes = require('./user');
const patientRoutes = require('./patients')

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/patients', patientRoutes);

module.exports = router;