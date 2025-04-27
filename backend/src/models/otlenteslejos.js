const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OtLentesLejos = sequelize.define('OtLentesLejos', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    odEsf: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    odCyl: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    odEje: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    oiEsf: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    oiCyl: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    oiEje: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    dp: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'OtLentesLejos'
  });

  OtLentesLejos.associate = (models) => {
    // Change to one-to-one relation with Worksheets
    OtLentesLejos.hasOne(models.Worksheets, {
      foreignKey: 'idOTLentesLejos',
      as: 'worksheet'
    });
  };

  return OtLentesLejos;
};