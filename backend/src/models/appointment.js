module.exports = (sequelize, DataTypes) => {
    const Appointment = sequelize.define('Appointment', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        patientId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        start: {
            type: DataTypes.DATE(6),
            allowNull: false
        },
        end: {
            type: DataTypes.DATE(6),
            allowNull: false
        },
        typeAppointmentId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'Appointments',
        timestamps: true
    });

    Appointment.associate = (models) => {
        Appointment.belongsTo(models.TypeAppointment, { foreignKey: 'typeAppointmentId', as: 'appointmentType' });
        Appointment.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        Appointment.belongsTo(models.Patient, { foreignKey: 'patientId', as: 'patient' });
    };

    return Appointment;
};