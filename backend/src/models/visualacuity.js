module.exports = (sequelize, DataTypes) => {
    const VisualAcuity = sequelize.define('VisualAcuity', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        clinicalRecordId: {  // Renamed for consistency
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        withoutCorrectionLE: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        withoutCorrectionRE: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        withoutCorrectionBI: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        laserCorrectionLE: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        laserCorrectionRE: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        laserCorrectionBI: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        pinholeLE: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        pinholeRE: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        pinholeBI: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        pupilRedLE: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        pupilRedRE: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        }
    }, {
        tableName: 'VisualAcuity',
        timestamps: true
    });

    VisualAcuity.associate = (models) => {
        VisualAcuity.belongsTo(models.ClinicalRecord, {
            foreignKey: 'clinicalRecordId',
            as: 'clinicalRecord'
        });
    };

    return VisualAcuity;
};