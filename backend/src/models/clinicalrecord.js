module.exports = (sequelize, DataTypes) => {
    const ClinicalRecord = sequelize.define(
        "ClinicalRecord",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
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
                allowNull: true,
            },
            latestClinicalDate: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            ophthalmologicalMedicalHistory: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            familyMedicalHistory: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            generalMedicalHistory: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            otherExam: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            observations: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            indicationId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            controlId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: "ClinicalRecords",
            timestamps: true,
        }
    );

    ClinicalRecord.associate = (models) => {
        // Many-to-one relationships (belongsTo)
        ClinicalRecord.belongsTo(models.User, { foreignKey: "userId", as: "user" });
        ClinicalRecord.belongsTo(models.TypeControl, { foreignKey: "controlId", as: "control" });
        ClinicalRecord.belongsTo(models.TypeIndication, { foreignKey: "indicationId", as: "typeIndication" });
        ClinicalRecord.belongsTo(models.Patient, { foreignKey: "patientId", as: "patient" });
        // One-to-one relationships (hasOne)
        ClinicalRecord.hasOne(models.VisualAcuity, { foreignKey: "clinicalRecordId", as: "visualAcuity" });
        ClinicalRecord.hasOne(models.Lensometry, { foreignKey: "clinicalRecordId", as: "lensometry" });
        ClinicalRecord.hasOne(models.Autorefractometry, { foreignKey: "clinicalRecordId", as: "autorefractometry" });
        ClinicalRecord.hasOne(models.SubjectiveRefractionFar, { foreignKey: "clinicalRecordId", as: "subjectiveRefractionsFar" });
        ClinicalRecord.hasOne(models.SubjectiveRefractionNear, { foreignKey: "clinicalRecordId", as: "subjectiveRefractionsNear" });
        ClinicalRecord.hasOne(models.ApplanationTonometry, { foreignKey: "clinicalRecordId", as: "applanationTonometry" });
        ClinicalRecord.hasOne(models.TypeDiagnosis, { foreignKey: "clinicalRecordId", as: "typeDiagnosis" });
    };

    return ClinicalRecord;
};