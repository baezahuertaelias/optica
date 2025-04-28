module.exports = (sequelize, DataTypes) => {
    const VisualAcuity = sequelize.define('VisualAcuity', {
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
        withoutCorrectionLE: {
            type: DataTypes.STRING,
            allowNull: true
        },
        withoutCorrectionRE: {
            type: DataTypes.STRING,
            allowNull: true
        },
        withoutCorrectionBI: {
            type: DataTypes.STRING,
            allowNull: true
        },
        laserCorrectionLE: {
            type: DataTypes.STRING,
            allowNull: true
        },
        laserCorrectionRE: {
            type: DataTypes.STRING,
            allowNull: true
        },
        laserCorrectionBI: {
            type: DataTypes.STRING,
            allowNull: true
        },
        pinholeLE: {
            type: DataTypes.STRING,
            allowNull: true
        },
        pinholeRE: {
            type: DataTypes.STRING,
            allowNull: true
        },
        pinholeBI: {
            type: DataTypes.STRING,
            allowNull: true
        },
        pupilRedLE: {
            type: DataTypes.STRING,
            allowNull: true
        },
        pupilRedRE: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'VisualAcuity',
        timestamps: true
    });

    VisualAcuity.associate = (models) => {
        // Many-to-one relation with ClinicalRecord
        VisualAcuity.belongsTo(models.ClinicalRecord, {
          foreignKey: 'clinicalrecordId',
          as: 'clinicalRecord'
        });
      };
    

    return VisualAcuity;
};