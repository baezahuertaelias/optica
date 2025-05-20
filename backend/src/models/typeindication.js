module.exports = (sequelize, DataTypes) => {
  const TypeIndication = sequelize.define(
    "TypeIndication",
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
    },
    {
      tableName: "TypeIndications",
      timestamps: true,
    }
  );

  TypeIndication.associate = (models) => {
    TypeIndication.hasOne(models.ClinicalRecord, {
      foreignKey: "indicationId",
      as: "clinicalRecord",
    });
  };

  return TypeIndication;
};
