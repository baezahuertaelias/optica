const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserType = sequelize.define('UserType', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'UserTypes' // Ensures the table name is PascalCase in PostgreSQL
  });

  return UserType;
};