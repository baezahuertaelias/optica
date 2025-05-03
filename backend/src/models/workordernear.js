module.exports = (sequelize, DataTypes) => {
    const WorkOrderNear = sequelize.define('WorkOrderNear', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        workOrderId: {
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
            type: DataTypes.FLOAT,
            allowNull: true
        },
        axisRE: {
            type: DataTypes.FLOAT,
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
            type: DataTypes.FLOAT,
            allowNull: false
        }
    }, {
        tableName: 'WorkOrderNear',
        timestamps: true
    });

    WorkOrderNear.associate = (models) => {
        WorkOrderNear.belongsTo(models.WorkOrder, {
            foreignKey: 'workOrderId',
            as: 'workOrder'
        });
    };

    return WorkOrderNear;
};