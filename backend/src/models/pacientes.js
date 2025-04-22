const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Paciente = sequelize.define('Paciente', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rut: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true // Ensure RUT is unique across records
    },
    pasaporte: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sexo: {
      type: DataTypes.ENUM('Masculino', 'Femenino', 'Otro'), 
      allowNull: false
    },
    fono: {
      type: DataTypes.STRING,
      allowNull: true
    },
    edad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fechaNacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    domicilio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ocupacion: {
      type: DataTypes.ENUM('Profesional', 'Estudiante', 'Desempleado', 'Otro'),
      allowNull: false
    },
    representanteLegal: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    prevision: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  return Paciente;
};