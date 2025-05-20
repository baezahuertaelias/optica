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

      ///////
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
      ///////
      generalMedicalHistoryId:{
        type: DataTypes.INTEGER,
        allowNull: false
      },


      ///////

      
      
      otherExam: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      observations: {
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
      as: 'subjectiveRefractionsFar'
    });
    ClinicalRecord.hasOne(models.SubjectiveRefractionNear, {
      foreignKey: "clinicalRecordId",
      as: 'subjectiveRefractionsNear'
    });
    ClinicalRecord.hasOne(models.VisualAcuity, {
      foreignKey: "clinicalRecordId",
      as: 'visualAcuity'
    });
    ClinicalRecord.hasOne(models.ApplanationTonometry, {
      foreignKey: "clinicalRecordId",
      as: 'applanationTonometry'
    });
    ClinicalRecord.hasOne(models.SubjectiveRefractionDefects, {
      foreignKey: "clinicalRecordId",
      as: 'subjectiveRefractionDefects'
    });
    
    // New associations for the new tables
    ClinicalRecord.hasOne(models.Lensometry, {
      foreignKey: "clinicalRecordId",
      as: 'lensometries'
    });
    ClinicalRecord.hasOne(models.Autorefractometry, {
      foreignKey: "clinicalRecordId",
      as: 'autorefractometries'
    });
    ClinicalRecord.hasOne(models.GeneralMedicalHistory, {
      foreignKey: "clinicalRecordId",
      as: 'generalMedicalHistories'
    });
    ClinicalRecord.hasOne(models.Diagnosis, {
      foreignKey: "clinicalRecordId",
      as: 'diagnoses'
    });
    ClinicalRecord.hasOne(models.Indication, {
      foreignKey: "clinicalRecordId",
      as: 'indications'
    });
    ClinicalRecord.hasOne(models.ComebackControl, {
      foreignKey: "clinicalRecordId",
      as: 'comebackControls'
    });
  };

  return ClinicalRecord;
};