const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Isapres = sequelize.define('Isapres', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'Isapres',
    timestamps: false
  });

  Isapres.associate = (models) => {
    // One Isapre can have many patients
    Isapres.hasMany(models.Patients, { foreignKey: 'idIsapre' });
  };
  

  return Isapres;
};