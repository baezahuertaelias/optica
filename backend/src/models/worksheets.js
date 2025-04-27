module.exports = (sequelize, DataTypes) => {
  const Worksheets = sequelize.define('Worksheets', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    idPaciente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Patients',
        key: 'id'
      }
    },
    idOTLentesCerca: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'OtLentesCerca',
        key: 'id'
      }
    },
    idOTLentesLejos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'OtLentesLejos',
        key: 'id'
      }
    },
    observaciones: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    tableName: 'Worksheets',
    timestamps: true
  });

  Worksheets.associate = (models) => {
    // Many-to-one relation with Users
    Worksheets.belongsTo(models.Users, {
      foreignKey: 'userId',
      as: 'user'
    });
    
    // Many-to-one relation with Patients
    Worksheets.belongsTo(models.Patients, {
      foreignKey: 'idPaciente',
      as: 'patient'
    });
    
    // One-to-one relation with OtLentesCerca
    Worksheets.belongsTo(models.OtLentesCerca, {
      foreignKey: 'idOTLentesCerca',
      as: 'lentesCerca'
    });
    
    // One-to-one relation with OtLentesLejos
    Worksheets.belongsTo(models.OtLentesLejos, {
      foreignKey: 'idOTLentesLejos',
      as: 'lentesLejos'
    });
  };

  return Worksheets;
};