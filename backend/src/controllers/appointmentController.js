const { Op } = require('sequelize');
const { Appointment, Patient, User, TypeAppointment } = require('../models');

module.exports = {

    async getFullAgenda(req, res) {
        try {
            // Extract query parameters for filtering
            const { userId, startDate, endDate, status } = req.query;
            const whereClause = {};
            
            // Add filters if provided
            if (userId) whereClause.userId = userId;
            if (status !== undefined) whereClause.status = status === 'true';
            
            // Date range filter
            if (startDate || endDate) {
                whereClause.start = {};
                if (startDate) whereClause.start[Op.gte] = new Date(startDate);
                if (endDate) whereClause.start[Op.lte] = new Date(endDate);
            }
            
            const appointments = await Appointment.findAll({
                where: whereClause,
                include: [
                    { model: User, as: 'user' },
                    { model: Patient, as: 'patient' },
                    { model: TypeAppointment, as: 'appointmentType' }
                ],
                order: [['start', 'ASC']]
            });
            return res.status(200).json({ appointments });
        } catch (error) {
            console.error("Failed to fetch appointments:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    async getAppointmentById(req, res) {
        try {
            const { id } = req.params;
            const appointment = await Appointment.findByPk(id, {
                include: [
                    { model: User, as: 'user' },
                    { model: Patient, as: 'patient' },
                    { model: TypeAppointment, as: 'appointmentType' }
                ]
            });

            if (!appointment) {
                return res.status(404).json({ message: "Appointment not found" });
            }

            return res.status(200).json({ data: appointment });
        } catch (error) {
            console.error("Failed to fetch appointment:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    async createAppointment(req, res) {
        try {
            console.log('createAppointment',req.body);
            
            const { patientId, userId, typeAppointmentId, start, end, notes, status } = req.body;
            
            // Validation
            if (!patientId || !userId || !typeAppointmentId || !start || !end) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            // Check if patient exists
            const patient = await Patient.findByPk(patientId);
            if (!patient) {
                return res.status(404).json({ message: "Patient not found" });
            }

            // Check if doctor exists
            const doctor = await User.findByPk(userId);
            if (!doctor || doctor.userTypeId !== 3) {
                return res.status(404).json({ message: "Doctor not found" });
            }

            // Check if appointment type exists
            const appointmentType = await TypeAppointment.findByPk(typeAppointmentId);
            if (!appointmentType) {
                return res.status(404).json({ message: "Appointment type not found" });
            }

            // Check for time conflicts
            const conflictingAppointments = await Appointment.findAll({
                where: {
                    userId,
                    status: true,
                    [Op.or]: [
                        {
                            start: { [Op.lt]: end },
                            end: { [Op.gt]: start }
                        }
                    ],
                }
            });

            if (conflictingAppointments.length > 0) {
                return res.status(409).json({ 
                    message: "Time conflict with existing appointment",
                    conflicts: conflictingAppointments
                });
            }

            // Create the appointment
            const appointment = await Appointment.create({
                patientId,
                userId,
                typeAppointmentId,
                start,
                end,
                notes,
                status: status !== undefined ? status : true
            });

            return res.status(201).json({
                message: "Appointment created successfully",
                data: appointment
            });
        } catch (error) {
            console.error("Failed to create appointment:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    async updateAppointment(req, res) {
        try {
            const { id } = req.params;
            const { patientId, userId, typeAppointmentId, start, end, notes, status } = req.body;
            
            // Validation
            if (!patientId || !userId || !typeAppointmentId || !start || !end) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            // Check if appointment exists
            const appointment = await Appointment.findByPk(id);
            if (!appointment) {
                return res.status(404).json({ message: "Appointment not found" });
            }

            // Check if patient exists
            const patient = await Patient.findByPk(patientId);
            if (!patient) {
                return res.status(404).json({ message: "Patient not found" });
            }

            // Check if doctor exists
            const doctor = await User.findByPk(userId);
            if (!doctor || doctor.userTypeId !== 2) {
                return res.status(404).json({ message: "Doctor not found" });
            }

            // Check if appointment type exists
            const appointmentType = await TypeAppointment.findByPk(typeAppointmentId);
            if (!appointmentType) {
                return res.status(404).json({ message: "Appointment type not found" });
            }

            // Check for time conflicts (excluding this appointment)
            const conflictingAppointments = await Appointment.findAll({
                where: {
                    id: { [Op.ne]: id },
                    userId,
                    status: true,
                    [Op.or]: [
                        {
                            start: { [Op.lt]: end },
                            end: { [Op.gt]: start }
                        }
                    ],
                }
            });

            if (conflictingAppointments.length > 0) {
                return res.status(409).json({ 
                    message: "Time conflict with existing appointment",
                    conflicts: conflictingAppointments
                });
            }

            // Update the appointment
            await appointment.update({
                patientId,
                userId,
                typeAppointmentId,
                start,
                end,
                notes,
                status: status !== undefined ? status : appointment.status
            });

            return res.status(200).json({
                message: "Appointment updated successfully",
                data: appointment
            });
        } catch (error) {
            console.error("Failed to update appointment:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    async deleteAppointment(req, res) {
        try {
            const { id } = req.params;
            
            // Check if appointment exists
            const appointment = await Appointment.findByPk(id);
            if (!appointment) {
                return res.status(404).json({ message: "Appointment not found" });
            }

            // Soft delete by marking as inactive
            await appointment.update({ status: false });

            return res.status(200).json({
                message: "Appointment cancelled successfully"
            });
        } catch (error) {
            console.error("Failed to delete appointment:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    async getPatientsName(req, res) {
        try {
            const patients = await Patient.findAll({
                attributes: ['id', 'name']
            });
            return res.status(200).json({ patients });
        } catch (error) {
            console.error("Failed to fetch patients:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    async getDoctorsName(req, res) {
        try {
            const doctors = await User.findAll({
                attributes: ['id', 'name'],
                where: { userTypeId: 3 }
            });
            return res.status(200).json({ doctors });
        } catch (error) {
            console.error("Failed to fetch doctors:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    async getTypeAppointments(req, res) {
        try {
            const typeAppointments = await TypeAppointment.findAll({
                attributes: ['id', 'name', 'duration', 'color'],
            });
            return res.status(200).json({ typeAppointments });
        } catch (error) {
            console.error("Failed to fetch type appointments:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    async getAppointmentByUser(req, res) {
        try {
            const { id } = req.params;
            const appointments = await Appointment.findAll({
                where: { userId: id },
                include: [
                    { model: User, as: 'user' },
                    { model: Patient, as: 'patient' },
                    { model: TypeAppointment, as: 'appointmentType' }
                ]
            });

            if (!appointments || appointments.length === 0) {
                return res.status(404).json({ message: "No appointments found for this user" });
            }

            return res.status(200).json({ appointments });
        } catch (error) {
            console.error("Failed to fetch appointments:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}