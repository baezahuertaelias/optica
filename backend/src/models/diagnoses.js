module.exports = (sequelize, DataTypes) => {
    const Diagnoses = sequelize.define('Diagnoses', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        myopia: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        hyperopia: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        astigmatism: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        presbyopia: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        emmetrope: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        derived: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        tableName: 'Diagnoses',
        timestamps: true
    });

    Diagnoses.associate = (models) => {
        Diagnoses.belongsTo(models.ClinicalRecord, {
            foreignKey: 'clinicalRecordId',
            as: 'clinicalRecord'
        });
    };

    return Diagnoses;
};