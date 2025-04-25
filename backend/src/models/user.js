const { DataTypes } = require("sequelize");
const UserType = require('./usertype');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserType,
        key: 'id'
      }
    }
  }, {
    tableName: 'user',
    timestamps: true
  });

  // Define the association
  User.belongsTo(UserType, { foreignKey: "userTypeId" });
  UserType.hasMany(User, { foreignKey: "userTypeId" });

  return User;
};
