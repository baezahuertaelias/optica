const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const otLentesLejos = sequelize.define('otLentesLejos', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    od_esf: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    od_cyl: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    od_eje: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    oi_esf: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    oi_cyl: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    oi_eje: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  return otLentesLejos;
};