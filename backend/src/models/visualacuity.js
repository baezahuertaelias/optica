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