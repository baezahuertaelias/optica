module.exports = (sequelize, DataTypes) => {
  const Diagnosis = sequelize.define(
    "Diagnosis",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      clinicalRecordId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true, // Ensures one-to-one relationship
      }
    },
    {
      tableName: "Diagnoses",
      timestamps: true,
    }
  );

  Diagnosis.associate = (models) => {
    // One Diagnosis can be referenced by one ClinicalRecord
    Diagnosis.belongsTo(models.ClinicalRecord, {
      foreignKey: "clinicalRecordId",
      as: "clinicalRecord"
    });
  };

  return Diagnosis;
};