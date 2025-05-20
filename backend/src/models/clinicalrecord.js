module.exports = (sequelize, DataTypes) => {
    const ClinicalRecord = sequelize.define(
        "ClinicalRecord",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            patientId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            anamnesis: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            latestClinicalDate: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            ophthalmologicalMedicalHistory: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            familyMedicalHistory: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            generalMedicalHistory: {
                type: DataTypes.TEXT,     
                allowNull: true,
            },
            otherExam: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            observations: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            artificialTear: {         
                type: DataTypes.BOOLEAN,  
                allowNull: false,
                defaultValue: false,
            },
            indicationId: { // New column for indication
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            controlId: { // New column for control
                type: DataTypes.INTEGER,
                allowNull: false,
            }
        },
        {
            tableName: "ClinicalRecords",
            timestamps: true,
        }
    );

    ClinicalRecord.associate = (models) => {
        ClinicalRecord.belongsTo(models.User, { foreignKey: "userId", as: "user" });
        ClinicalRecord.hasOne(models.Indication, { foreignKey: 'indicationId', as: 'indication' });
        ClinicalRecord.hasOne(models.Control, { foreignKey: 'controlId', as: 'control' });
    };

    return ClinicalRecord;
};