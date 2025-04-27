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
    // Relation with UserType
    Users.belongsTo(models.UserTypes, {
      foreignKey: 'userTypeId',
      as: 'userType'
    });

    // Relation with Worksheets
    Users.hasMany(models.Worksheets, {
      foreignKey: 'userId',
      as: 'worksheets'
    });
  };

  return Users;
};