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
    ClinicalRecord.hasMany(models.SubjectiveRefractionFar, {
      foreignKey: "clinicalRecordId",
    });
    ClinicalRecord.hasMany(models.SubjectiveRefractionNear, {
      foreignKey: "clinicalRecordId",
    });
    ClinicalRecord.hasMany(models.VisualAcuity, {
      foreignKey: "clinicalRecordId",
    });
  };

  return ClinicalRecord;
};
