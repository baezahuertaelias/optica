module.exports = (sequelize, DataTypes) => {
    const WorkOrder = sequelize.define('WorkOrder', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        patientId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        deliveryDate: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        total: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0
        },
        prepaid: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        store: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'WorkOrders',  // Changed to plural for consistency
        timestamps: true
    });

    WorkOrder.associate = (models) => {
        WorkOrder.belongsTo(models.Patient, { foreignKey: 'patientId', as: 'patient' });
        WorkOrder.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        WorkOrder.hasOne(models.WorkOrderFar, { foreignKey: 'workOrderId' });
        WorkOrder.hasOne(models.WorkOrderNear, { foreignKey: 'workOrderId' });
    };

    return WorkOrder;
};