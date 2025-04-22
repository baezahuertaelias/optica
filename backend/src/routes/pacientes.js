const express = require('express');
const router = express.Router();
const { Paciente } = require('../models'); // Assuming this model was created as shown above

// Create new paciente
router.post('/', async (req, res) => {
  try {
    const paciente = await Paciente.create(req.body);
    res.status(201).json(paciente);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Retrieve all pacientes
router.get('/', async (req, res) => {
  try {
    const pacientes = await Paciente.findAll();
    res.json(pacientes);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Update paciente by id
router.put('/:id', async (req, res) => {
  try {
    const updatedPaciente = await Paciente.update(req.body, { where: { id: req.params.id } });
    if (!updatedPaciente[0]) return res.status(404).send('Not found');
    res.json({ message: 'Updated' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Delete paciente by id
router.delete('/:id', async (req, res) => {
  try {
    const deletedRows = await Paciente.destroy({ where: { id: req.params.id } });
    if (!deletedRows) return res.status(404).send('Not found');
    res.json({ message: 'Deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;