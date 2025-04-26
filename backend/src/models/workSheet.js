const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Worksheets = sequelize.define('Worksheets', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        idPaciente: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        idOTLentesCerca: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        idOTLentesLejos: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        observaciones: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        tableName: 'Worksheets' // Ensures the table name is PascalCase in PostgreSQL
    });

    return Worksheets;
};