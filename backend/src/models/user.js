const { DataTypes } = require("sequelize");
const UserType = require('./usertype');

module.exports = (sequelize) => {
  const Users = sequelize.define('Users', {
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
      /* references: {
        model: UsersType,
        key: 'id'
      } */
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    }
  }, {
    tableName: 'Users',
    timestamps: true
  });


  // Define the association
  /* Users.belongsTo(UsersType, { foreignKey: "userTypeId" });
  UsersType.hasMany(Users, { foreignKey: "userTypeId" }); */
  return Users;
};
