module.exports = (sequelize, DataTypes) => {
  const Indication = sequelize.define(
    "Indication",
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
      tableName: "Indications",
      timestamps: true,
    }
  );

  Indication.associate = (models) => {
    // One Indication can be referenced by one ClinicalRecord
    Indication.belongsTo(models.ClinicalRecord, {
      foreignKey: "clinicalRecordId",
      as: "clinicalRecord"
    });
  };

  return Indication;
};