const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Patients = sequelize.define('Patients', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    passport: {
      type: DataTypes.STRING,
      allowNull: true
    },
    genderId: {  // Renamed from gender to genderId for consistency
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tel: {
      type: DataTypes.STRING,
      allowNull: true
    },
    birthday: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    homeAddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mail: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    occupation: {
      type: DataTypes.STRING,
      allowNull: true
    },
    legalRepresentative: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    idIsapre: {
      type: DataTypes.INTEGER,
    }
  }, {
    tableName: 'Patients',
    timestamps: true
  });

  Patients.associate = (models) => {
    Patients.hasMany(models.ClinicalRecord, { foreignKey: 'idPatient' });
    Patients.belongsTo(models.Genders, { foreignKey: 'genderId', as: 'Gender' });
    Patients.belongsTo(models.Isapres, { foreignKey: 'idIsapre', as: 'Isapre' });
  };

  return Patients;
}; 