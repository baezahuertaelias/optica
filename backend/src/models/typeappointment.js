module.exports = (sequelize, DataTypes) => {
    const TypeAppointment = sequelize.define('TypeAppointment', {  // Changed to singular
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        color: {
            type: DataTypes.STRING,
            allowNull: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'TypeAppointments',
        timestamps: true
    });

    TypeAppointment.associate = (models) => {
        TypeAppointment.hasMany(models.Appointment, { foreignKey: 'typeAppointmentId', as: 'appointments' });
    };

    return TypeAppointment;
};