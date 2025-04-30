module.exports = (sequelize, DataTypes) => {
  const SubjectiveRefractionFar = sequelize.define('SubjectiveRefractionFar', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    clinicalrecordId: { // Added foreign key
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sphereLE: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    sphereRE: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    cylinderLE: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    cylinderRE: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    axisLE: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    axisRE: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    vareachedLE: {
      type: DataTypes.STRING,  // Assuming this will hold a string like "20/20"
      allowNull: true
    },
    vareachedRE: {
      type: DataTypes.STRING,  // Assuming this will hold a string like "20/20"
      allowNull: true
    },
    pupilarDistance: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  }, {
    tableName: 'SubjectiveRefractionFar',
    timestamps: true
  });

  SubjectiveRefractionFar.associate = (models) => {
    // Many-to-one relation with ClinicalRecord
    SubjectiveRefractionFar.belongsTo(models.ClinicalRecord, {
      foreignKey: 'clinicalrecordId',
      as: 'clinicalRecord'
    });
  };

  return SubjectiveRefractionFar;
};