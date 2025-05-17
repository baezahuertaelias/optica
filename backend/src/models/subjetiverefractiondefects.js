module.exports = (sequelize, DataTypes) => {
  const SubjectiveRefractionDefects = sequelize.define(
    "SubjectiveRefractionDefects",
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
        unique: true, // Ensures one-to-one relationship
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
      anisometropia: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "SubjectiveRefractionDefects",
      timestamps: true,
    }
  );

  SubjectiveRefractionDefects.associate = (models) => {
    SubjectiveRefractionDefects.belongsTo(models.ClinicalRecord, {
      foreignKey: "clinicalRecordId",
      as: "clinicalRecord",
      onDelete: "CASCADE", // If clinical record is deleted, also delete related defects
    });
  };

  return SubjectiveRefractionDefects;
};