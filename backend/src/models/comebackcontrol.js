module.exports = (sequelize, DataTypes) => {
  const ComebackControl = sequelize.define(
    "ComebackControl",
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
      tableName: "ComebackControls",
      timestamps: true,
    }
  );

  ComebackControl.associate = (models) => {
    // One ComebackControl can be referenced by one ClinicalRecord
    ComebackControl.belongsTo(models.ClinicalRecord, {
      foreignKey: "clinicalRecordId",
      as: "clinicalRecord"
    });
  };

  return ComebackControl;
};