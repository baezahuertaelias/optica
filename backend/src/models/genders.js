const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Genders = sequelize.define('Genders', {
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

    Genders.associate = (models) => {
        Genders.hasOne(models.Patients, { foreignKey: 'genderId' });
    };

    return Genders;
};