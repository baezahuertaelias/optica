module.exports = (sequelize, DataTypes) => {
    const Isapre = sequelize.define('Isapre', {  // Changed to singular
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
        tableName: 'Isapres',
        timestamps: false
    });

    Isapre.associate = (models) => {
        Isapre.hasMany(models.Patient, { foreignKey: 'isapreId' });  // Renamed for consistency
    };

    return Isapre;
};