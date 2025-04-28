const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ClinicalRecord = sequelize.define('ClinicalRecord', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    idPatient: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    anamnesis: {  // New column
      type: DataTypes.TEXT,
      allowNull: true
    },
    othersDetails: {  // New column
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'ClinicalRecord',
    timestamps: true
  });

  ClinicalRecord.associate = (models) => {
    ClinicalRecord.belongsTo(models.Patients, { foreignKey: 'idPatient', as: 'Patient' });
    ClinicalRecord.belongsTo(models.Users, { foreignKey: 'userId', as: 'User' });
    ClinicalRecord.hasOne(models.SubjectiveRefractionFar, { foreignKey: 'clinicalrecordId' });
    ClinicalRecord.hasOne(models.SubjectiveRefractionNear, { foreignKey: 'clinicalrecordId' });
    ClinicalRecord.hasOne(models.ApplanationTonometry, { foreignKey: 'clinicalrecordId' });
    ClinicalRecord.hasOne(models.VisualAcuity, { foreignKey: 'clinicalrecordId' });
  };
  

  return ClinicalRecord;
};