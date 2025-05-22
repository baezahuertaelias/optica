module.exports = (sequelize, DataTypes) => {
  const TypeDiagnosis = sequelize.define(
    "TypeDiagnosis",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      clinicalRecordId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      myopia: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      hyperopia: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      astigmatism: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      presbyopia: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      emmetrope: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      derived: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      artificialTear: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "TypeDiagnoses",
      timestamps: true,
    }
  );

  TypeDiagnosis.associate = (models) => {
    // One-to-one relationship with ClinicalRecord
    TypeDiagnosis.belongsTo(models.ClinicalRecord, {
      foreignKey: "clinicalRecordId",
      as: "clinicalRecord",
    });
  };

  return TypeDiagnosis;
};