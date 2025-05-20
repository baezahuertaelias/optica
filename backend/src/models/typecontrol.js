module.exports = (sequelize, DataTypes) => {
  const TypeControl = sequelize.define(
    "TypeControl",
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
      tableName: "TypeControls",
      timestamps: true,
    }
  );

  TypeControl.associate = (models) => {
    TypeControl.hasOne(models.ClinicalRecord, {
      foreignKey: "controlId",
      as: "clinicalRecord",
    });
  };
  return TypeControl;
};
