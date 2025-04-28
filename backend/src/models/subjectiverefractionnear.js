module.exports = (sequelize, DataTypes) => {
  const SubjectiveRefractionNear = sequelize.define('SubjectiveRefractionNear', {
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
      type: DataTypes.INTEGER,
      allowNull: true
    },
    axisRE: {
      type: DataTypes.INTEGER,
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
    tableName: 'SubjectiveRefractionNear',
    timestamps: true
  });

  SubjectiveRefractionNear.associate = (models) => {
    // Many-to-one relation with ClinicalRecord
    SubjectiveRefractionNear.belongsTo(models.ClinicalRecord, {
      foreignKey: 'clinicalrecordId',
      as: 'clinicalRecord'
    });
  };

  return SubjectiveRefractionNear;
};