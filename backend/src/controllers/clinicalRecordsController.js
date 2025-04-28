const { ClinicalRecord } = require('../models'); // Adjust import if your file structure is different

module.exports = {
  async createClinicalRecord(req, res) {
    try {
      const record = await ClinicalRecord.create(req.body);
      return res.status(201).json({ record });
    } catch (error) {
      console.error("Error creating clinical record:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async getAllClinicalRecords(req, res) {
    try {
      const records = await ClinicalRecord.findAll();
      return res.status(200).json({ records });
    } catch (error) {
      console.error("Failed to fetch clinical records:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async getClinicalRecordById(req, res) {
    try {
      const { id } = req.params;
      const record = await ClinicalRecord.findByPk(id);
      if (!record) {
        return res.status(404).json({ message: "Clinical record not found" });
      }
      return res.status(200).json({ record });
    } catch (error) {
      console.error("Failed to fetch clinical record:", error);
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
};

//RESPUESTA DE CLAUDE
// Example function to create a new clinical record with all related data
async function createClinicalRecordWithRelations(req, res) {
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
  const t = await sequelize.transaction();

  try {
    // 1. Create the Clinical Record first
    const newClinicalRecord = await models.ClinicalRecord.create({
      idPatient: patientId,
      userId: userId,
      anamnesis: anamnesis,
      othersDetails: othersDetails
    }, { transaction: t });

    // Get the new clinical record ID
    const clinicalRecordId = newClinicalRecord.id;

    // 2. Create Visual Acuity with the clinical record ID
    await models.VisualAcuity.create({
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
    }, { transaction: t });

    // 3. Create Subjective Refraction Far
    await models.SubjectiveRefractionFar.create({
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
    }, { transaction: t });

    // 4. Create Subjective Refraction Near
    await models.SubjectiveRefractionNear.create({
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
    }, { transaction: t });

    // 5. Create Applanation Tonometry
    await models.ApplanationTonometry.create({
      clinicalrecordId: clinicalRecordId,
      leftEye: applanationTonometry.leftEye,
      rightEye: applanationTonometry.rightEye,
      dateTime: new Date() // Or use a provided date
    }, { transaction: t });

    // Commit the transaction if all operations succeed
    await t.commit();

    // Return the newly created clinical record with its ID
    return res.status(201).json({
      success: true,
      data: {
        clinicalRecord: newClinicalRecord
      },
      message: 'Clinical record created successfully with all related data'
    });

  } catch (error) {
    // Rollback the transaction if any operation fails
    await t.rollback();
    
    console.error('Error creating clinical record:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while creating the clinical record'
    });
  }
}

// Example of how to call this function (e.g., in an Express route)
// POST /api/clinical-records
router.post('/', createClinicalRecordWithRelations);

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

// Function to get a clinical record with all related information
async function getClinicalRecordWithRelations(req, res) {
  const { id } = req.params;

  try {
    // Find the clinical record by ID and include all related models
    const clinicalRecord = await models.ClinicalRecord.findByPk(id, {
      include: [
        {
          model: models.Patients,
          as: 'Patient',
          include: [
            { model: models.Genders, as: 'Gender' },
            { model: models.Isapres, as: 'Isapre' }
          ]
        },
        { model: models.Users, as: 'User', include: [
          { model: models.UserTypes, as: 'UserType' }
        ]},
        { model: models.VisualAcuity, as: 'VisualAcuity' },
        { model: models.SubjectiveRefractionFar, as: 'SubjectiveRefractionFar' },
        { model: models.SubjectiveRefractionNear, as: 'SubjectiveRefractionNear' },
        { model: models.ApplanationTonometry, as: 'ApplanationTonometry' }
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
}

// Example of how to use this function in an Express route
// GET /api/clinical-records/:id
router.get('/:id', getClinicalRecordWithRelations);

