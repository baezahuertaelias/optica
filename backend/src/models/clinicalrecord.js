module.exports = (sequelize, DataTypes) => {
    const ClinicalRecord = sequelize.define('ClinicalRecord', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        patientId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        anamnesis: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        othersDetails: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'ClinicalRecords',
        timestamps: true
    });

    ClinicalRecord.associate = (models) => {
        ClinicalRecord.belongsTo(models.Patient, { foreignKey: 'patientId', as: 'patient' });
        ClinicalRecord.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        ClinicalRecord.hasOne(models.SubjectiveRefractionFar, { foreignKey: 'clinicalRecordId', as: 'subjectiveRefractionFar' });
        ClinicalRecord.hasOne(models.SubjectiveRefractionNear, { foreignKey: 'clinicalRecordId', as: 'subjectiveRefractionNear' });
        ClinicalRecord.hasOne(models.ApplanationTonometry, { foreignKey: 'clinicalRecordId', as: 'applanationTonometry' });
        ClinicalRecord.hasOne(models.VisualAcuity, { foreignKey: 'clinicalRecordId', as: 'visualAcuity' });
    };

    return ClinicalRecord;
};