const { WorkOrder, WorkOrderFar, WorkOrderNear, Patient, User, TypeAppointment, Appointment } = require('../models');

module.exports = {
    async createWorkOrderWithRelations(req, res) {
        const {
            patientId,
            status,
            deliveryDate,
            total,
            prepaid,
            userId,
            store,
            farRefraction,
            nearRefraction
        } = req.body;

        try {
            // Start a transaction
            const result = await db.sequelize.transaction(async (t) => {
                // Create the work order
                const workOrder = await WorkOrder.create({
                    patientId,
                    status,
                    deliveryDate,
                    total,
                    prepaid,
                    userId,
                    store
                }, { transaction: t });

                // If far refraction data is provided
                if (farRefraction) {
                    await WorkOrderFar.create({
                        workOrderId: workOrder.id,
                        sphereLE: farRefraction.sphereLE,
                        sphereRE: farRefraction.sphereRE,
                        cylinderLE: farRefraction.cylinderLE,
                        cylinderRE: farRefraction.cylinderRE,
                        axisLE: farRefraction.axisLE,
                        axisRE: farRefraction.axisRE,
                        vareachedLE: farRefraction.vareachedLE,
                        vareachedRE: farRefraction.vareachedRE,
                        pupilarDistance: farRefraction.pupilarDistance
                    }, { transaction: t });
                }

                // If near refraction data is provided
                if (nearRefraction) {
                    await WorkOrderNear.create({
                        workOrderId: workOrder.id,
                        sphereLE: nearRefraction.sphereLE,
                        sphereRE: nearRefraction.sphereRE,
                        cylinderLE: nearRefraction.cylinderLE,
                        cylinderRE: nearRefraction.cylinderRE,
                        axisLE: nearRefraction.axisLE,
                        axisRE: nearRefraction.axisRE,
                        vareachedLE: nearRefraction.vareachedLE,
                        vareachedRE: nearRefraction.vareachedRE,
                        pupilarDistance: nearRefraction.pupilarDistance
                    }, { transaction: t });
                }

                return workOrder;
            });

            res.status(201).send({
                success: true,
                message: "Work order created successfully",
                data: result
            });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Failed to create work order",
                error: error.message
            });
        }
    },

    async getAllWorkOrders(req, res) {
        const { page = 1, limit = 10, status, patientId } = req.query;
        const offset = (page - 1) * limit;

        // Prepare filter condition
        const condition = {};
        if (status) condition.status = status;
        if (patientId) condition.patientId = patientId;

        try {
            const { count, rows } = await WorkOrder.findAndCountAll({
                where: condition,
                limit: parseInt(limit),
                offset: parseInt(offset),
                include: [
                    { model: Patient, as: 'Patient' },
                    { model: User, as: 'User' }
                ],
                order: [['createdAt', 'DESC']]
            });

            res.send({
                success: true,
                total: count,
                totalPages: Math.ceil(count / limit),
                currentPage: parseInt(page),
                data: rows
            });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Failed to retrieve work orders",
                error: error.message
            });
        }
    },

    async findOne(req, res) {
        {
            const { id } = req.params;

            try {
                const workOrder = await WorkOrder.findByPk(id, {
                    include: [
                        { model: Patient, as: 'Patient' },
                        { model: User, as: 'User' },
                        { model: WorkOrderFar },
                        { model: WorkOrderNear }
                    ]
                });

                if (!workOrder) {
                    return res.status(404).send({
                        success: false,
                        message: `Work order with id ${id} not found`
                    });
                }

                res.send({
                    success: true,
                    data: workOrder
                });
            } catch (error) {
                res.status(500).send({
                    success: false,
                    message: `Error retrieving work order with id ${id}`,
                    error: error.message
                });
            }
        }
    },

    async update(req, res) {
        const { id } = req.params;
        const {
            patientId,
            status,
            deliveryDate,
            total,
            prepaid,
            userId,
            store,
            farRefraction,
            nearRefraction
        } = req.body;

        try {
            // Start a transaction
            await db.sequelize.transaction(async (t) => {
                // Update the work order
                const workOrder = await WorkOrder.findByPk(id, { transaction: t });

                if (!workOrder) {
                    throw new Error(`Work order with id ${id} not found`);
                }

                // Update main work order data
                await workOrder.update({
                    patientId: patientId || workOrder.patientId,
                    status: status || workOrder.status,
                    deliveryDate: deliveryDate || workOrder.deliveryDate,
                    total: total || workOrder.total,
                    prepaid: prepaid || workOrder.prepaid,
                    userId: userId || workOrder.userId,
                    store: store || workOrder.store
                }, { transaction: t });

                // Update far refraction data if provided
                if (farRefraction) {
                    const [farData, created] = await WorkOrderFar.findOrCreate({
                        where: { workOrderId: id },
                        defaults: {
                            workOrderId: id,
                            ...farRefraction
                        },
                        transaction: t
                    });

                    if (!created) {
                        await farData.update(farRefraction, { transaction: t });
                    }
                }

                // Update near refraction data if provided
                if (nearRefraction) {
                    const [nearData, created] = await WorkOrderNear.findOrCreate({
                        where: { workOrderId: id },
                        defaults: {
                            workOrderId: id,
                            ...nearRefraction
                        },
                        transaction: t
                    });

                    if (!created) {
                        await nearData.update(nearRefraction, { transaction: t });
                    }
                }
            });

            // Fetch the updated work order with all related data
            const updatedWorkOrder = await WorkOrder.findByPk(id, {
                include: [
                    { model: Patient, as: 'Patient' },
                    { model: User, as: 'User' },
                    { model: WorkOrderFar },
                    { model: WorkOrderNear }
                ]
            });

            res.send({
                success: true,
                message: "Work order updated successfully",
                data: updatedWorkOrder
            });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: `Error updating work order with id ${id}`,
                error: error.message
            });
        }
    },

    async delete(req, res) {
        {
            const { id } = req.params;

            try {
                await db.sequelize.transaction(async (t) => {
                    // Find the work order
                    const workOrder = await WorkOrder.findByPk(id, { transaction: t });

                    if (!workOrder) {
                        throw new Error(`Work order with id ${id} not found`);
                    }

                    // Delete related far refraction data
                    await WorkOrderFar.destroy({
                        where: { workOrderId: id },
                        transaction: t
                    });

                    // Delete related near refraction data
                    await WorkOrderNear.destroy({
                        where: { workOrderId: id },
                        transaction: t
                    });

                    // Delete the work order
                    await workOrder.destroy({ transaction: t });
                });

                res.send({
                    success: true,
                    message: "Work order deleted successfully"
                });
            } catch (error) {
                res.status(500).send({
                    success: false,
                    message: `Error deleting work order with id ${id}`,
                    error: error.message
                });
            }
        }
    },

    async findByPatient(req, res) {
        {
            const { patientId } = req.params;
            const { page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            try {
                const { count, rows } = await WorkOrder.findAndCountAll({
                    where: { patientId },
                    limit: parseInt(limit),
                    offset: parseInt(offset),
                    include: [
                        { model: Patient, as: 'Patient' },
                        { model: User, as: 'User' }
                    ],
                    order: [['createdAt', 'DESC']]
                });

                res.send({
                    success: true,
                    total: count,
                    totalPages: Math.ceil(count / limit),
                    currentPage: parseInt(page),
                    data: rows
                });
            } catch (error) {
                res.status(500).send({
                    success: false,
                    message: `Error retrieving work orders for patient ${patientId}`,
                    error: error.message
                });
            }
        }
    },

    async updateStatus(req, res) {
        {
            const { id } = req.params;
            const { status } = req.body;

            try {
                const workOrder = await WorkOrder.findByPk(id);

                if (!workOrder) {
                    return res.status(404).send({
                        success: false,
                        message: `Work order with id ${id} not found`
                    });
                }

                await workOrder.update({ status });

                res.send({
                    success: true,
                    message: "Work order status updated successfully",
                    data: workOrder
                });
            } catch (error) {
                res.status(500).send({
                    success: false,
                    message: `Error updating status for work order with id ${id}`,
                    error: error.message
                });
            }
        }
    },

    async getPatientsName(req, res) {
        try {
            const patients = await Patient.findAll({
                attributes: ['id', 'name'],
            });
            return res.status(200).json({ patients });
        } catch (error) {
            console.error("Failed to fetch patients:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    },
}

