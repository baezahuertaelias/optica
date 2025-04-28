module.exports = (sequelize, DataTypes) => {
    const ApplanationTonometry = sequelize.define('ApplanationTonometry', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        leftEye: {
            type: DataTypes.FLOAT,  // Assuming the tonometry values are numeric (e.g., mmHg)
            allowNull: true
        },
        rightEye: {
            type: DataTypes.FLOAT,  // Assuming the tonometry values are numeric (e.g., mmHg)
            allowNull: true
        },
        dateTime: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'ApplanationTonometry',
        timestamps: true
    });

    ApplanationTonometry.associate = (models) => {
        // Many-to-one relation with ClinicalRecord
        ApplanationTonometry.belongsTo(models.ClinicalRecord, {
          foreignKey: 'clinicalrecordId',
          as: 'clinicalRecord'
        });
      };



    return ApplanationTonometry;
};