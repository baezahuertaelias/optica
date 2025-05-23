module.exports = (sequelize, DataTypes) => {
    const SubjectiveRefractionNear = sequelize.define('SubjectiveRefractionNear', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        clinicalRecordId: {
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
        },
        add: {
            type: DataTypes.FLOAT,
            allowNull: false
        }
    }, {
        tableName: 'SubjectiveRefractionNear',
        timestamps: true
    });

    SubjectiveRefractionNear.associate = (models) => {
        // One-to-one relationship with ClinicalRecord
        SubjectiveRefractionNear.belongsTo(models.ClinicalRecord, {
            foreignKey: 'clinicalRecordId',
            as: 'clinicalRecord'
        });
    };

    return SubjectiveRefractionNear;
};