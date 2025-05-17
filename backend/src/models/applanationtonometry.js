module.exports = (sequelize, DataTypes) => {
    const ApplanationTonometry = sequelize.define('ApplanationTonometry', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        leftEye: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        rightEye: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        dateTime: {
            type: DataTypes.DATE,
            allowNull: false
        },
        clinicalRecordId: {  // Renamed for consistency
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'ApplanationTonometry',
        timestamps: true
    });

    ApplanationTonometry.associate = (models) => {
        ApplanationTonometry.belongsTo(models.ClinicalRecord, {
            foreignKey: 'clinicalRecordId',
            as: 'clinicalRecord'
        });
    };

    return ApplanationTonometry;
};