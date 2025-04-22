const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Agendamiento = sequelize.define('Agendamiento', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    hora: {
      type: DataTypes.TIME,
      allowNull: false
    }
  });

  return Agendamiento;
};