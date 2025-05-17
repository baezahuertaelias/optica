module.exports = (sequelize, DataTypes) => {
  const UserType = sequelize.define('UserType', {  // Changed to singular
      id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
      },
      type: {
          type: DataTypes.STRING,
          allowNull: false
      },
      color: {
        type: DataTypes.STRING,
        allowNull: false
      }
  }, {
      tableName: 'UserTypes',  // Changed to singular for consistency
      timestamps: false
  });

  UserType.associate = (models) => {
      UserType.hasMany(models.User, { foreignKey: 'userTypeId' });
  };

  return UserType;
};