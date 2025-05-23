
module.exports = (sequelize, DataTypes) => {
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
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        typeUserId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        }
    }, {
        tableName: 'Users',  // Changed to singular for consistency
        timestamps: true
    });

    User.associate = (models) => {
        User.belongsTo(models.TypeUser, { foreignKey: 'typeUserId', as: 'typeUser' }); // Updated here
        User.hasMany(models.ClinicalRecord, { foreignKey: 'userId' });
        User.hasMany(models.Appointment, { foreignKey: 'userId' });
        User.hasMany(models.WorkOrder, { foreignKey: 'userId' });
    };

    return User;
};