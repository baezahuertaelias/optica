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
      references: {
        model: 'Genders',
        key: 'id'
      }
    },
    tel: {
      type: DataTypes.STRING,
      allowNull: true
    },
    birthday: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    homeaddress: {
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
    legalrepresentative: {
      type: DataTypes.STRING,
      defaultValue: false,
      allowNull: false
    },
    idIsapre: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Isapres',
        key: 'id'
      }
    }
  }, {
    tableName: 'Patients',
    timestamps: true
  });

  Patients.associate = (models) => {
    // Many-to-one relation with Gender
    Patients.belongsTo(models.Genders, {
      foreignKey: 'genderId',
      as: 'genders'
    });
    
    // Many-to-one relation with Isapres
    Patients.belongsTo(models.Isapres, {
      foreignKey: 'idIsapre',
      as: 'isapre'
    });

    // One-to-many relation with Worksheets (corrected to match your requirement)
    Patients.hasMany(models.Worksheets, {
      foreignKey: 'idPaciente',
      as: 'worksheets'
    });
  };

  return Patients;
};