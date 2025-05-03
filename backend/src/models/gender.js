module.exports = (sequelize, DataTypes) => {
    const Gender = sequelize.define('Gender', {  // Changed to singular
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        value: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        tableName: 'Genders',
        timestamps: false
    });

    Gender.associate = (models) => {
        Gender.hasMany(models.Patient, { foreignKey: 'genderId' });
    };

    return Gender;
};