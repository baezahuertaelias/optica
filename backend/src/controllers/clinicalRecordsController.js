const { ClinicalRecord, 
  Patients, 
  Genders, 
  Isapres, 
  Users, 
  UserTypes, 
  VisualAcuity, 
  SubjectiveRefractionFar, 
  SubjectiveRefractionNear, 
  ApplanationTonometry } = require('../models'); // Adjust import if your file structure is different

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
    //const t = await sequelize.transaction();

    try {
      // 1. Create the Clinical Record first
      const newClinicalRecord = await ClinicalRecord.create({
        idPatient: patientId,
        userId: userId,
        anamnesis: anamnesis,
        othersDetails: othersDetails
      }/* , { transaction: t } */);

      // Get the new clinical record ID
      const clinicalRecordId = newClinicalRecord.id;

      // 2. Create Visual Acuity with the clinical record ID
      await VisualAcuity.create({
        clinicalrecordId: clinicalRecordId,
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
      }/* , { transaction: t } */);

      // 3. Create Subjective Refraction Far
      await SubjectiveRefractionFar.create({
        clinicalrecordId: clinicalRecordId,
        sphereLE: subjectiveRefractionFar.sphereLE,
        sphereRE: subjectiveRefractionFar.sphereRE,
        cylinderLE: subjectiveRefractionFar.cylinderLE,
        cylinderRE: subjectiveRefractionFar.cylinderRE,
        axisLE: subjectiveRefractionFar.axisLE,
        axisRE: subjectiveRefractionFar.axisRE,
        vareachedLE: subjectiveRefractionFar.vareachedLE,
        vareachedRE: subjectiveRefractionFar.vareachedRE,
        pupilarDistance: subjectiveRefractionFar.pupilarDistance
      }/* , { transaction: t } */);

      // 4. Create Subjective Refraction Near
      await SubjectiveRefractionNear.create({
        clinicalrecordId: clinicalRecordId,
        sphereLE: subjectiveRefractionNear.sphereLE,
        sphereRE: subjectiveRefractionNear.sphereRE,
        cylinderLE: subjectiveRefractionNear.cylinderLE,
        cylinderRE: subjectiveRefractionNear.cylinderRE,
        axisLE: subjectiveRefractionNear.axisLE,
        axisRE: subjectiveRefractionNear.axisRE,
        vareachedLE: subjectiveRefractionNear.vareachedLE,
        vareachedRE: subjectiveRefractionNear.vareachedRE,
        pupilarDistance: subjectiveRefractionNear.pupilarDistance
      }/* , { transaction: t } */);

      // 5. Create Applanation Tonometry
      await ApplanationTonometry.create({
        clinicalrecordId: clinicalRecordId,
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
      
      const records = await ClinicalRecord.findAll({include: [
        {
          model: Patients,
          as: 'Patient',
          include: [
            { model: Genders, as: 'Gender' },
            { model: Isapres, as: 'Isapre' }
          ]
        },
        {
          model: Users, as: 'User', include: [
            { model: UserTypes, as: 'UserType' }
          ]
        }/* ,
        { model: VisualAcuity, as: 'VisualAcuity' },
        { model: SubjectiveRefractionFar, as: 'SubjectiveRefractionFar' },
        { model: SubjectiveRefractionNear, as: 'SubjectiveRefractionNear' },
        { model: ApplanationTonometry, as: 'ApplanationTonometry' } */
      ]});
      return res.status(200).json({ records });
    } catch (error) {
      console.error("Failed to fetch clinical records:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async getClinicalRecordWithRelations(req, res) {
    const { id } = req.params;

    console.log('id',id);
    

    try {
      // Find the clinical record by ID and include all related models
      const clinicalRecord = await ClinicalRecord.findByPk(id, {
        include: [
          {
            model: Patients,
            as: 'Patient',
            include: [
              { model: Genders, as: 'Gender' },
              { model: Isapres, as: 'Isapre' }
            ]
          },
          {
            model: Users, as: 'User', include: [
              { model: UserTypes, as: 'UserType' }
            ]
          },
          { model: VisualAcuity, as: 'VisualAcuity' },
          { model: SubjectiveRefractionFar, as: 'SubjectiveRefractionFar' },
          { model: SubjectiveRefractionNear, as: 'SubjectiveRefractionNear' },
          { model: ApplanationTonometry, as: 'ApplanationTonometry' }
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

  async getPatientsName(req, res){
    try {
      const patients = await Patients.findAll({
        attributes: ['id', 'name'],
      });
      return res.status(200).json({ patients });
    } catch (error) {
      console.error("Failed to fetch patients:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};

// Example request body structure
/*
{
  "patientId": 1,
  "userId": 2,
  "anamnesis": "Patient complains of blurry vision in the left eye for 2 weeks...",
  "othersDetails": "Patient has a history of diabetes...",
  
  "visualAcuity": {
    "withoutCorrectionLE": "20/100",
    "withoutCorrectionRE": "20/40",
    "withoutCorrectionBI": "20/40",
    "laserCorrectionLE": "20/40",
    "laserCorrectionRE": "20/20",
    "laserCorrectionBI": "20/20",
    "pinholeLE": "20/30",
    "pinholeRE": "20/20",
    "pinholeBI": "20/20",
    "pupilRedLE": "Normal",
    "pupilRedRE": "Normal"
  },
  
  "subjectiveRefractionFar": {
    "sphereLE": -2.5,
    "sphereRE": -1.0,
    "cylinderLE": -0.75,
    "cylinderRE": -0.5,
    "axisLE": 180,
    "axisRE": 90,
    "vareachedLE": "20/30",
    "vareachedRE": "20/20",
    "pupilarDistance": 62
  },
  
  "subjectiveRefractionNear": {
    "sphereLE": -1.5,
    "sphereRE": -0.5,
    "cylinderLE": -0.75,
    "cylinderRE": -0.5,
    "axisLE": 180,
    "axisRE": 90,
    "vareachedLE": "20/25",
    "vareachedRE": "20/20",
    "pupilarDistance": 60
  },
  
  "applanationTonometry": {
    "leftEye": 17.5,
    "rightEye": 16.2
  }
}
*/



