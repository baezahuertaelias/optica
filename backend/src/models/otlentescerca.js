const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OtLentesCerca = sequelize.define('OtLentesCerca', {
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
    tableName: 'OtLentesCerca'
  });

  OtLentesCerca.associate = (models) => {
    // Change to one-to-one relation with Worksheets
    OtLentesCerca.hasOne(models.Worksheets, {
      foreignKey: 'idOTLentesCerca',
      as: 'worksheet'
    });
  };

  return OtLentesCerca;
};