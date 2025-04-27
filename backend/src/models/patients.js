const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Patients = sequelize.define('Patients', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'Patients',
    timestamps: true
  });

  Patients.associate = (models) => {
    // One patient can have many worksheets
    Patients.hasMany(models.Worksheets, {
      foreignKey: 'idPaciente',
      as: 'worksheets'
    });
  };

  return Patients;
};
