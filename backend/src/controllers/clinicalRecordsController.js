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
  async createClinicalRecordWithRelations(req, res) {
    const {
      // Clinical Record data
      patientId,
      userId,
      anamnesis,
      othersDetails,

      // Visual Acuity data
      visualAcuity,

      // Subjective Refraction Far data
      subjectiveRefractionFar,

      // Subjective Refraction Near data
      subjectiveRefractionNear,

      // Applanation Tonometry data
      applanationTonometry
    } = req.body;

    // Start a transaction to ensure data consistency
    // Uncomment this if you want to use transactions
    // const t = await sequelize.transaction();

    try {
      // 1. Create the Clinical Record first
      const newClinicalRecord = await ClinicalRecord.create({
        patientId: patientId,
        userId: userId,
        anamnesis: anamnesis,
        othersDetails: othersDetails
      });


      // Get the new clinical record ID
      const clinicalRecordId = newClinicalRecord.id;

      // 2. Create Visual Acuity with the clinical record ID
      await VisualAcuity.create({
        clinicalRecordId: clinicalRecordId, // Fixed: changed from clinicalrecordId to clinicalRecordId
        withoutCorrectionLE: visualAcuity.withoutCorrectionLE,
        withoutCorrectionRE: visualAcuity.withoutCorrectionRE,
        withoutCorrectionBI: visualAcuity.withoutCorrectionBI,
        laserCorrectionLE: visualAcuity.laserCorrectionLE,
        laserCorrectionRE: visualAcuity.laserCorrectionRE,
        laserCorrectionBI: visualAcuity.laserCorrectionBI,
        pinholeLE: visualAcuity.pinholeLE,
        pinholeRE: visualAcuity.pinholeRE,
        pinholeBI: visualAcuity.pinholeBI,
        pupilRedLE: visualAcuity.pupilRedLE,
        pupilRedRE: visualAcuity.pupilRedRE
      });


      // 3. Create Subjective Refraction Far
      await SubjectiveRefractionFar.create({
        clinicalRecordId: clinicalRecordId, // Fixed: changed from clinicalrecordId to clinicalRecordId
        sphereLE: subjectiveRefractionFar.sphereLE,
        sphereRE: subjectiveRefractionFar.sphereRE,
        cylinderLE: subjectiveRefractionFar.cylinderLE,
        cylinderRE: subjectiveRefractionFar.cylinderRE,
        axisLE: subjectiveRefractionFar.axisLE,
        axisRE: subjectiveRefractionFar.axisRE,
        vareachedLE: subjectiveRefractionFar.vareachedLE,
        vareachedRE: subjectiveRefractionFar.vareachedRE,
        pupilarDistance: subjectiveRefractionFar.pupilarDistance
      });


      // 4. Create Subjective Refraction Near
      await SubjectiveRefractionNear.create({
        clinicalRecordId: clinicalRecordId, // Fixed: changed from clinicalrecordId to clinicalRecordId
        sphereLE: subjectiveRefractionNear.sphereLE,
        sphereRE: subjectiveRefractionNear.sphereRE,
        cylinderLE: subjectiveRefractionNear.cylinderLE,
        cylinderRE: subjectiveRefractionNear.cylinderRE,
        axisLE: subjectiveRefractionNear.axisLE,
        axisRE: subjectiveRefractionNear.axisRE,
        vareachedLE: subjectiveRefractionNear.vareachedLE,
        vareachedRE: subjectiveRefractionNear.vareachedRE,
        pupilarDistance: subjectiveRefractionNear.pupilarDistance
      });

      // 5. Create Applanation Tonometry
      await ApplanationTonometry.create({
        clinicalRecordId: clinicalRecordId, // Fixed: changed from clinicalrecordId to clinicalRecordId
        leftEye: applanationTonometry.leftEye,
        rightEye: applanationTonometry.rightEye,
        dateTime: new Date() // Or use a provided date
      }/* , { transaction: t } */);

      // Commit the transaction if all operations succeed
      /* await t.commit(); */

      // Return the newly created clinical record with its ID
      return res.status(201).json({
        success: true,
        data: {
          clinicalRecord: newClinicalRecord
        },
        message: 'Ficha clinica guardada'
      });

    } catch (error) {
      // Rollback the transaction if any operation fails
      /* await t.rollback(); */

      console.error('Error creating clinical record:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'An error occurred while creating the clinical record'
      });
    }
  },

  async getAllClinicalRecords(req, res) {
    try {
      
      const records = await ClinicalRecord.findAll({
        include: [
          {
            model: Patient, // Fixed: changed from Patients to Patient
            as: 'patient',  // Fixed: changed from 'Patient' to 'patient' to match model association
            include: [
              { model: Gender, as: 'gender' }, // Fixed: changed from Genders to Gender and 'Gender' to 'gender'
              { model: Isapre, as: 'isapre' }  // Fixed: changed from Isapres to Isapre and 'Isapre' to 'isapre'
            ]
          },
          {
            model: User, as: 'user', // Fixed: changed from Users to User and 'User' to 'user'
            include: [
              { model: UserType, as: 'userType' } // Fixed: changed from UserTypes to UserType and 'UserType' to 'userType'
            ]
          }
          // Commented out in original but fixed naming convention:
          /* 
          { model: VisualAcuity, as: 'visualAcuity' }, // Changed from 'VisualAcuity' to match camelCase
          { model: SubjectiveRefractionFar, as: 'subjectiveRefractionFar' }, // Changed from 'SubjectiveRefractionFar'
          { model: SubjectiveRefractionNear, as: 'subjectiveRefractionNear' }, // Changed from 'SubjectiveRefractionNear'
          { model: ApplanationTonometry, as: 'applanationTonometry' } // Changed from 'ApplanationTonometry'
          */
        ]
      });
      
      return res.status(200).json({ records });
    } catch (error) {
      console.error("Failed to fetch clinical records:", error);
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
      console.error('Error retrieving clinical record:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'An error occurred while retrieving the clinical record'
      });
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
  }
};