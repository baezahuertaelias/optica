module.exports = (sequelize, DataTypes) => {
    const SubjectiveRefractionFar = sequelize.define('SubjectiveRefractionFar', {
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
            type: DataTypes.FLOAT,
            allowNull: true
        },
        vareachedRE: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        pupilarDistance: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'SubjectiveRefractionFar',
        timestamps: true
    });

    SubjectiveRefractionFar.associate = (models) => {
        SubjectiveRefractionFar.belongsTo(models.ClinicalRecord, {
            foreignKey: 'clinicalRecordId',
            as: 'clinicalRecord'
        });

    };

    return SubjectiveRefractionFar;
}