module.exports = (sequelize, DataTypes) => {
    const Control = sequelize.define('Control', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        value: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'Controls',
        timestamps: true
    });

    Control.associate = (models) => {
        Control.hasOne(models.ClinicalRecord, {
            foreignKey: 'controlId',
            as: 'clinicalRecord'
        });
    };

    return Control;
};