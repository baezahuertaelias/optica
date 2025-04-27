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
      allowNull: false
    },
    idOTLentesCerca: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idOTLentesLejos: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    observaciones: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'Worksheets',
    timestamps: true
  });

  Worksheets.associate = (models) => {
    // Relation with Users
    Worksheets.belongsTo(models.Users, {
      foreignKey: 'userId',
      as: 'user'
    });
    
    // Relation with Patients
    Worksheets.belongsTo(models.Patients, {
      foreignKey: 'idPaciente',
      as: 'patient'
    });
    
    // Relation with OtLentesCerca
    Worksheets.belongsTo(models.OtLentesCerca, {
      foreignKey: 'idOTLentesCerca',
      as: 'lentesCerca'
    });
    
    // Relation with OtLentesLejos
    Worksheets.belongsTo(models.OtLentesLejos, {
      foreignKey: 'idOTLentesLejos',
      as: 'lentesLejos'
    });
  };

  return Worksheets;
};