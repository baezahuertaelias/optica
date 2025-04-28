module.exports = (sequelize, DataTypes) => {
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
      allowNull: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    }
  }, {
    tableName: 'Users',
    timestamps: true
  });

  Users.associate = (models) => {
    Users.belongsTo(models.UserTypes, { foreignKey: 'userTypeId', as: 'UserType' });
  };

  return Users;
};