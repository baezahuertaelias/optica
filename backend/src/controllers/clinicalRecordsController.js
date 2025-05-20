const {
  ClinicalRecord,
  VisualAcuity,
  SubjectiveRefractionFar,
  SubjectiveRefractionNear,
  ApplanationTonometry,
  Lensometry,
  Autorefractometry,
  Patient,
  Gender,
  User,
  TypeUser,
} = require("../models");
const { sequelize } = require("../models");

module.exports = {
  async createClinicalRecordWithRelations(req, res) {
    const transaction = await sequelize.transaction();

    try {
      console.log("body", req.body);

      const clinicalRecord = await ClinicalRecord.create(
        req.body.clinicalRecord,
        { transaction }
      );

      if (req.body.visualAcuity) {
        await VisualAcuity.create(
          { ...req.body.visualAcuity, clinicalRecordId: clinicalRecord.id },
          { transaction }
        );
      }

      if (req.body.subjectiveRefractionFar) {
        await SubjectiveRefractionFar.create(
          {
            ...req.body.subjectiveRefractionFar,
            clinicalRecordId: clinicalRecord.id,
          },
          { transaction }
        );
      }

      if (req.body.autorefractometry) {
        await Autorefractometry.create(
          {
            ...req.body.autorefractometry,
            clinicalRecordId: clinicalRecord.id,
          },
          { transaction }
        );
      }

      if (req.body.applanationTonometry) {
        await ApplanationTonometry.create(
          {
            ...req.body.applanationTonometry,
            clinicalRecordId: clinicalRecord.id,
          },
          { transaction }
        );
      }

      if (req.body.lensometry) {
        await Lensometry.create(
          { ...req.body.lensometry, clinicalRecordId: clinicalRecord.id },
          { transaction }
        );
      }

      // Add other related models here...

      await transaction.commit();
      res.status(201).send(clinicalRecord);
    } catch (error) {
      await transaction.rollback();
      res.status(400).send(error.message);
    }
  },

  async getPatientsName(req, res) {
    try {
      const patients = await Patient.findAll({
        attributes: ["id", "name"],
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
      const [updatedRows] = await ClinicalRecord.update(req.body, {
        where: { id },
      });
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
      const patients = await Patient.findAll({
        attributes: ["id", "name"],
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
            as: "patient", // Fixed: changed from 'Patient' to 'patient'
            include: [
              { model: Gender, as: "gender" }, // Fixed model and alias names
              /* { model: Isapre, as: 'isapre' } */ // Fixed model and alias names
            ],
          },
          {
            model: User,
            as: "user", // Fixed model and alias names
            include: [
              { model: UserType, as: "userType" }, // Fixed model and alias names
            ],
          },
          { model: VisualAcuity, as: "visualAcuity" }, // Fixed: using camelCase alias
          { model: SubjectiveRefractionFar, as: "subjectiveRefractionsFar" }, // Corrected alias
          { model: SubjectiveRefractionNear, as: "subjectiveRefractionsNear" }, // Corrected alias
          { model: ApplanationTonometry, as: "applanationTonometry" }, // Include ApplanationTonometry
          /* { model: SubjectiveRefractionDefects, as: 'subjectiveRefractionDefects' } // Include SubjectiveRefractionDefects */
        ],
      });

      if (!clinicalRecord) {
        return res.status(404).json({
          success: false,
          message: "Clinical record not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: clinicalRecord,
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
          {
            model: Patient,
            as: "patient",
            include: [
              { model: Gender, as: "gender" },
              /* { model: Isapre, as: 'isapre' } */
            ],
          },
          {
            model: User,
            as: "user",
            include: [{ model: TypeUser, as: "typeUser" }],
          },
          { model: VisualAcuity, as: "visualAcuity" },
          { model: SubjectiveRefractionFar, as: "subjectiveRefractionsFar" }, // Updated alias
          { model: SubjectiveRefractionNear, as: "subjectiveRefractionsNear" }, // Updated alias
          /* { model: SubjectiveRefractionDefects, as: 'subjectiveRefractionDefects' } */
        ],
      });

      if (!records) {
        return res.status(404).json({
          success: false,
          message: "No clinical records found",
        });
      }

      return res.status(200).json({ records });
    } catch (error) {
      console.error("Failed to fetch all clinical records:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },


  async generatePDF(req, res) {
    try {
      const { id } = req.params;

      const clinicalRecord = await ClinicalRecord.findByPk(id, {
        include: [
          {
            model: Patient, // Fixed: changed from Patients to Patient
            as: "patient", // Fixed: changed from 'Patient' to 'patient'
            include: [
              { model: Gender, as: "gender" }, // Fixed model and alias names
              { model: Isapre, as: "isapre" }, // Fixed model and alias names
            ],
          },
          {
            model: User,
            as: "user", // Fixed model and alias names
            include: [
              { model: UserType, as: "userType" }, // Fixed model and alias names
            ],
          },
          { model: VisualAcuity, as: "visualAcuity" }, // Fixed: using camelCase alias
          { model: SubjectiveRefractionFar, as: "subjectiveRefractionsFar" }, // Corrected alias
          { model: SubjectiveRefractionNear, as: "subjectiveRefractionsNear" }, // Corrected alias
          { model: ApplanationTonometry, as: "applanationTonometry" }, // Include ApplanationTonometry
          {
            model: SubjectiveRefractionDefects,
            as: "subjectiveRefractionDefects",
          }, // Include SubjectiveRefractionDefects
        ],
      });

      // Create the PDF document
      const pdfDoc = createPdfDocument(clinicalRecord);

      // Set response headers
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=orden_trabajo.pdf"
      );

      // Pipe the PDF to the response
      pdfDoc.pipe(res);

      // End the document
      pdfDoc.end();
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).send("Error generating PDF");
    }
  },
};
