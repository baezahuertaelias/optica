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
    },
    {
      tableName: "TypeDiagnoses",
      timestamps: true,
    }
  );

  TypeDiagnosis.associate = (models) => {
    TypeDiagnosis.belongsTo(models.ClinicalRecord, {
      foreignKey: "diagnosisId",
      as: "clinicalRecord",
    });
  };

  return TypeDiagnosis;
};
