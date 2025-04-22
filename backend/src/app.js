require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

// Import routes
const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
const pacientesRoutes = require('./routes/pacientes')

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/pacientes', pacientesRoutes);

// Database connection
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    await sequelize.sync();
    console.log('Database synced.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});

module.exports = app;