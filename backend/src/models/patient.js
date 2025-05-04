module.exports = (sequelize, DataTypes) => {
    const Patient = sequelize.define('Patient', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        passport: {
            type: DataTypes.STRING,
            allowNull: true
        },
        genderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        tel: {
            type: DataTypes.STRING,
            allowNull: true
        },
        birthday: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        homeAddress: {
            type: DataTypes.STRING,
            allowNull: true
        },
        mail: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        occupation: {
            type: DataTypes.STRING,
            allowNull: true
        },
        legalRepresentative: {
            type: DataTypes.STRING,
            defaultValue: false,
            allowNull: false
        },
        isapreId: {
            type: DataTypes.INTEGER,
        }
    }, {
        tableName: 'Patients',
        timestamps: true
    });

    Patient.associate = (models) => {
        Patient.hasMany(models.ClinicalRecord, { foreignKey: 'patientId' });
        Patient.belongsTo(models.Gender, { foreignKey: 'genderId', as: 'gender' });
        Patient.belongsTo(models.Isapre, { foreignKey: 'isapreId', as: 'isapre' });
        Patient.hasMany(models.Appointment, { foreignKey: 'patientId' });
        Patient.hasMany(models.WorkOrder, { foreignKey: 'patientId' });
    };

    return Patient;
};