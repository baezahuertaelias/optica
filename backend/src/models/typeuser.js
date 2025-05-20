module.exports = (sequelize, DataTypes) => {
    const TypeUser = sequelize.define('TypeUser', { // Updated here
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        value: {
            type: DataTypes.STRING,
            allowNull: false
        },
        color: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'TypeUsers',  // Updated here for consistency
        timestamps: false
    });

    TypeUser.associate = (models) => { // Updated here
        TypeUser.hasMany(models.User, { foreignKey: 'typeUserId' });
    };

    return TypeUser;
};