const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserTypes = sequelize.define('UserTypes', {
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

  UserTypes.associate = (models) => {
    // Relation with Users
    UserTypes.hasMany(models.Users, {
      foreignKey: 'userTypeId',
      as: 'users'
    });
  };

  return UserTypes;
};