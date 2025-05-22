const { createPDFClinicalRecord } = require("../helpers/pdf");
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
  TypeIndication,
  TypeControl,
  TypeDiagnosis
} = require("../models");
const { sequelize } = require("../models");

module.exports = {
  async createClinicalRecordWithRelations(req, res) {
    const transaction = await sequelize.transaction();

    try {
      
      const clinicalRecord = await ClinicalRecord.create(
        req.body,
        { transaction }
      );
      console.log('[createClinicalRecordWithRelations] paso1', clinicalRecord);

      console.log('[createClinicalRecordWithRelations] visualAcuity', req.body.visualAcuity);

      if (req.body.visualAcuity) {
        await VisualAcuity.create(
          { ...req.body.visualAcuity, clinicalRecordId: clinicalRecord.id },
          { transaction }
        );
      }

      console.log('[createClinicalRecordWithRelations] subjectiveRefractionFar', req.body.subjectiveRefractionFar);

      if (req.body.subjectiveRefractionFar) {
        await SubjectiveRefractionFar.create(
          {
            ...req.body.subjectiveRefractionFar,
            clinicalRecordId: clinicalRecord.id,
          },
          { transaction }
        );
      }

      console.log('[createClinicalRecordWithRelations] subjectiveRefractionNear', req.body.subjectiveRefractionNear);

      if (req.body.subjectiveRefractionNear) {
        await SubjectiveRefractionNear.create(
          {
            ...req.body.subjectiveRefractionNear,
            clinicalRecordId: clinicalRecord.id,
          },
          { transaction }
        );
      }
      console.log('[createClinicalRecordWithRelations] applanationTonometry', req.body.applanationTonometry);
      
      if (req.body.applanationTonometry) {
        await ApplanationTonometry.create(
          {
            ...req.body.applanationTonometry,
            clinicalRecordId: clinicalRecord.id,
            dateTime: new Date()
          },
          { transaction }
        );
      }
      
      console.log('[createClinicalRecordWithRelations] lensometry', req.body.lensometry);

      if (req.body.lensometry) {
        await Lensometry.create(
          { ...req.body.lensometry, clinicalRecordId: clinicalRecord.id },
          { transaction }
        );
      }

      console.log('[createClinicalRecordWithRelations] autorefractometry', req.body.autorefractometry);

      if (req.body.autorefractometry) {
        await Autorefractometry.create(
          {
            ...req.body.autorefractometry,
            clinicalRecordId: clinicalRecord.id,
          },
          { transaction }
        );
      }

      console.log('[createClinicalRecordWithRelations] typeDiagnosis', req.body.typeDiagnosis);

      if (req.body.typeDiagnosis) {
        await TypeDiagnosis.create(
          {
            //...req.body.typeDiagnosis,
            myopia: req.body.typeDiagnosis.myopia || false,
            hyperopia: req.body.typeDiagnosis.hyperopia || false,
            astigmatism: req.body.typeDiagnosis.astigmatism || false,
            presbyopia: req.body.typeDiagnosis.presbyopia || false,
            emmetrope: req.body.typeDiagnosis.emmetrope || false,
            derived: req.body.typeDiagnosis.derived || false,
            artificialTear: req.body.typeDiagnosis.artificialTear || false,
            clinicalRecordId: clinicalRecord.id,
          },
          { transaction }
        );
      }
      




      console.log('[createClinicalRecordWithRelations] paso7');

      // Add other related models here...

      await transaction.commit();
      res.status(201).send(clinicalRecord);
    } catch (error) {
      console.log('[CreateClinicalRecord] error', error);

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
                    model: Patient,
                    as: "patient",
                    include: [
                        { model: Gender, as: "gender" },
                        // { model: Isapre, as: 'isapre' } // Uncomment if needed
                    ],
                },
                {
                    model: User,
                    as: "user",
                    include: [
                        { model: TypeUser, as: "typeUser" },
                    ],
                },
                { 
                    model: VisualAcuity, 
                    as: "visualAcuity",
                    required: false // This makes it a LEFT JOIN instead of INNER JOIN
                },
                { 
                    model: SubjectiveRefractionFar, 
                    as: "subjectiveRefractionsFar",
                    required: false
                },
                { 
                    model: SubjectiveRefractionNear, 
                    as: "subjectiveRefractionsNear",
                    required: false
                },
                { 
                    model: ApplanationTonometry, 
                    as: "applanationTonometry",
                    required: false
                },
                { 
                    model: Lensometry, 
                    as: 'lensometry',
                    required: false
                },
                { 
                    model: Autorefractometry, 
                    as: 'autorefractometry',
                    required: false
                },
                { 
                    model: TypeDiagnosis, 
                    as: 'typeDiagnosis',
                    required: false
                },
                {
                    model: TypeControl,
                    as: "control",
                    required: false
                },
                {
                    model: TypeIndication,
                    as: "typeIndication",
                    required: false
                }
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
        return res.status(500).json({ 
            success: false,
            message: "Internal server error",
            error: error.message // Add error details for debugging
        });
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
            model: Patient,
            as: "patient",
            include: [{ model: Gender, as: "gender" }],
          },
          {
            model: User,
            as: "user",
            include: [{ model: TypeUser, as: "typeUser" }],
          },
          { model: VisualAcuity, as: "visualAcuity" },
          { model: SubjectiveRefractionFar, as: "subjectiveRefractionsFar" },
          { model: SubjectiveRefractionNear, as: "subjectiveRefractionsNear" },
          { model: ApplanationTonometry, as: "applanationTonometry" },
          { model: Lensometry, as: "lensometry" },
          { model: Autorefractometry, as: "autorefractometry" },
          { model: TypeDiagnosis, as: 'typeDiagnosis' },
          { model: TypeControl, as: "control" },
          { model: TypeIndication, as: "typeIndication" }
        ],
      });

      // Create the PDF document
      const pdfDoc = createPDFClinicalRecord(clinicalRecord);

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

  async getAllIndications(req, res) {
    try {
      const indications = await TypeIndication.findAll();
      return res.status(200).json({ indications });
    } catch (error) {
      console.error("Failed to fetch indications:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async getAllControls(req, res) {
    try {
      const controls = await TypeControl.findAll();
      return res.status(200).json({ controls });
    } catch (error) {
      console.error("Failed to fetch controls:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

};
