const router = require('express').Router();

const authRoutes = require('./auth');
const pacientesRoutes = require('./pacientes')

router.use('/auth', authRoutes);
router.use('/pacientes', pacientesRoutes);

module.exports = router;