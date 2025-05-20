module.exports = (sequelize, DataTypes) => {
  const GeneralMedicalHistory = sequelize.define(
    "GeneralMedicalHistory",
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
      tableName: "GeneralMedicalHistories",
      timestamps: true,
    }
  );

  GeneralMedicalHistory.associate = (models) => {
    // One GeneralMedicalHistory can be referenced by many ClinicalRecords
    GeneralMedicalHistory.belongsTo(models.ClinicalRecord, {
      foreignKey: "clinicalRecordId", 
      as: "clinicalRecords"
    });
  };

  return GeneralMedicalHistory;
};