module.exports = (sequelize, DataTypes) => {
  const Lensometry = sequelize.define(
    "Lensometry",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      sphereLE: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      sphereRE: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      cylinderLE: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      cylinderRE: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      axisLE: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      axisRE: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      add: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      clinicalRecordId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true, // Ensures one-to-one relationship
      }
    },
    {
      tableName: "Lensometries",
      timestamps: true,
    }
  );

  Lensometry.associate = (models) => {
    Lensometry.belongsTo(models.ClinicalRecord, {
      foreignKey: "clinicalRecordId",
      as: "clinicalRecord"
    });
  };

  return Lensometry;
};