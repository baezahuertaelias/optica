const {
  ClinicalRecord,
  Patient,  // Changed from Patients to Patient to match model definition
  Gender,   // Changed from Genders to Gender to match model definition
  Isapre,   // Changed from Isapres to Isapre to match model definition
  User,     // Changed from Users to User to match model definition
  UserType, // Changed from UserTypes to UserType to match model definition
  VisualAcuity,
  SubjectiveRefractionFar,
  SubjectiveRefractionNear,
  ApplanationTonometry
} = require('../models'); // Adjust import if your file structure is different

module.exports = {
  async updateClinicalRecord(req, res) {
    try {
      const { id } = req.params;
      const [updatedRows] = await ClinicalRecord.update(req.body, { where: { id } });
      if (updatedRows === 0) {
        return res.status(404).json({ message: "Clinical record not found" });
      }
      const updatedRecord = await ClinicalRecord.findByPk(id);
      return res.status(200).json({ record: updatedRecord });
    } catch (error) {
      console.error("Error updating clinical record:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async deleteClinicalRecord(req, res) {
    try {
      const { id } = req.params;
      const deletedRows = await ClinicalRecord.destroy({ where: { id } });
      if (deletedRows === 0) {
        return res.status(404).json({ message: "Clinical record not found" });
      }
      return res.status(204).send(); // No content on successful deletion
    } catch (error) {
      console.error("Failed to delete clinical record:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async getPatientsName(req, res) {
    try {
      const patients = await Patient.findAll({ // Fixed: changed from Patients to Patient
        attributes: ['id', 'name'],
      });
      return res.status(200).json({ patients });
    } catch (error) {
      console.error("Failed to fetch patients:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async updateClinicalRecord(req, res) {
    try {
      const { id } = req.params;
      const [updatedRows] = await ClinicalRecord.update(req.body, { where: { id } });
      if (updatedRows === 0) {
        return res.status(404).json({ message: "Clinical record not found" });
      }
      const updatedRecord = await ClinicalRecord.findByPk(id);
      return res.status(200).json({ record: updatedRecord });
    } catch (error) {
      console.error("Error updating clinical record:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async deleteClinicalRecord(req, res) {
    try {
      const { id } = req.params;
      const deletedRows = await ClinicalRecord.destroy({ where: { id } });
      if (deletedRows === 0) {
        return res.status(404).json({ message: "Clinical record not found" });
      }
      return res.status(204).send(); // No content on successful deletion
    } catch (error) {
      console.error("Failed to delete clinical record:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async getPatientsName(req, res) {
    try {
      const patients = await Patient.findAll({ // Fixed: changed from Patients to Patient
        attributes: ['id', 'name'],
      });
      return res.status(200).json({ patients });
    } catch (error) {
      console.error("Failed to fetch patients:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async getClinicalRecordWithRelations(req, res) {
    const { id } = req.params;

    try {
      // Find the clinical record by ID and include all related models
      const clinicalRecord = await ClinicalRecord.findByPk(id, {
        include: [
          {
            model: Patient, // Fixed: changed from Patients to Patient
            as: 'patient',  // Fixed: changed from 'Patient' to 'patient'
            include: [
              { model: Gender, as: 'gender' }, // Fixed model and alias names
              { model: Isapre, as: 'isapre' }  // Fixed model and alias names
            ]
          },
          {
            model: User, as: 'user', // Fixed model and alias names
            include: [
              { model: UserType, as: 'userType' } // Fixed model and alias names
            ]
          },
          { model: VisualAcuity, as: 'visualAcuity' }, // Fixed: using camelCase alias
          { model: SubjectiveRefractionFar, as: 'subjectiveRefractionFar' }, // Fixed: using camelCase alias
          { model: SubjectiveRefractionNear, as: 'subjectiveRefractionNear' }, // Fixed: using camelCase alias
          { model: ApplanationTonometry, as: 'applanationTonometry' } // Fixed: using camelCase alias
        ]
      });

      if (!clinicalRecord) {
        return res.status(404).json({
          success: false,
          message: 'Clinical record not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: clinicalRecord
      });
    } catch (error) {
      console.error("Failed to fetch a clinical record:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async getAllrecords(req, res) {
    try {
      const records = await ClinicalRecord.findAll({
        include: [
          { model: Patient, as: 'patient', include: [{ model: Gender, as: 'gender' }, { model: Isapre, as: 'isapre' }] },
          { model: User, as: 'user', include: [{ model: UserType, as: 'userType' }] },
          { model: VisualAcuity, as: 'visualAcuity' },
          { model: SubjectiveRefractionFar, as: 'subjectiveRefractionsFar' }, // Use the correct alias
          { model: SubjectiveRefractionNear, as: 'subjectiveRefractionsNear' } // Use the correct alias
        ]
      });

      if (!records) {
        return res.status(404).json({
          success: false,
          message: 'No clinical records found'
        });
      }

      return res.status(200).json({ records });
    } catch (error) {
      console.error("Failed to fetch all clinical records:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

};