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
      othersDetails: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "ClinicalRecords",
      timestamps: true,
    }
  );

  ClinicalRecord.associate = (models) => {
    ClinicalRecord.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    ClinicalRecord.belongsTo(models.Patient, {
      foreignKey: "patientId",
      as: "patient",
    });
    ClinicalRecord.hasOne(models.SubjectiveRefractionFar, {
      foreignKey: "clinicalRecordId",
      as: 'subjectiveRefractionsFar'  // Use a consistent alias
    });
    ClinicalRecord.hasOne(models.SubjectiveRefractionNear, {
      foreignKey: "clinicalRecordId",
      as: 'subjectiveRefractionsNear' // Use a consistent alias
    });
    ClinicalRecord.hasOne(models.VisualAcuity, {  // Changed to hasOne and use singular alias
      foreignKey: "clinicalRecordId",
      as: 'visualAcuity'
    });
    ClinicalRecord.hasOne(models.ApplanationTonometry, {  // Changed to hasOne and use singular alias
      foreignKey: "clinicalRecordId",
      as: 'applanationTonometry'
    });
  };

  return ClinicalRecord;
};