const bcrypt = require("bcrypt");
const { Users, UserTypes, Isapres, Genders, Patients, ClinicalRecord, VisualAcuity, SubjectiveRefractionFar, SubjectiveRefractionNear, ApplanationTonometry } = require("../models");

module.exports = {
  async createClinicalRecordWithDummyData() {
    try {
      const hashedPassword = await bcrypt.hash('123', 10);
      
      // Step 1: Create UserTypes if they don't exist
      const userTypeCount = await UserTypes.count();
      if (userTypeCount === 0) {
        await UserTypes.bulkCreate([
          { id: 1, type: "Admin" },
          { id: 2, type: "Vendedor" },
          { id: 3, type: "Medico" }
        ]);
      }

      // Step 2: Create or find the necessary users
      // First, check if user with ID 2 exists (which we need for the clinical record)
      let vendedorUser = await Users.findByPk(2);
      if (!vendedorUser) {
        // If user with ID 2 doesn't exist, create all users
        await Users.bulkCreate([
          {
            id: 1,
            username: 'admin',
            password: hashedPassword,
            userTypeId: 1,
            status: true
          }, 
          {
            id: 2,
            username: 'vendedor',
            password: hashedPassword,
            userTypeId: 2,
            status: true
          }, 
          {
            id: 3,
            username: 'medico',
            password: hashedPassword,
            userTypeId: 3,
            status: true
          }
        ], { returning: true });
      }

      // Step 3: Create Genders if they don't exist
      const genderCount = await Genders.count();
      if (genderCount === 0) {
        await Genders.bulkCreate([
          { id: 1, value: 'Mujer' },
          { id: 2, value: 'Hombre' },
          { id: 3, value: 'Otro' }
        ]);
      }

      // Create Isapres if they don't exist
      const isapreCount = await Isapres.count();
      if (isapreCount === 0) {
        await Isapres.bulkCreate([
          { id: 1, value: "Banmedica" },
          { id: 2, value: "Isalud" },
          { id: 3, value: "Colmena" },
          { id: 4, value: "Consalud" },
          { id: 5, value: "Cruz Blanca" },
          { id: 6, value: "Nueva Masvida" },
          { id: 7, value: "Fundacion BancoEstado" },
          { id: 8, value: "Vida tres" },
          { id: 9, value: "Escencial" }
        ]);
      }

      // Step 4: Create a Patient
      const randomNum = Math.floor(Math.random() * 10000);
      // Generate random gender ID (1, 2, or 3) corresponding to the three gender options
      const randomGenderId = Math.floor(Math.random() * 3) + 1;
      
      const patient = await Patients.create({
        name: `Test Patient ${randomNum}`,
        passport: `P${randomNum}`,
        genderId: randomGenderId, // Randomly assign gender from available options
        tel: '+1234567890',
        birthday: new Date(1985, 5, 15), // June 15, 1985
        homeAddress: '123 Test Street, City',
        mail: `patient${randomNum}@test.com`,
        occupation: 'Software Developer',
        legalRepresentative: false,
        idIsapre: Math.floor(Math.random() * 9) + 1 // Random number between 1-9
      });

      // Step 5: Create the Clinical Record
      const clinicalRecord = await ClinicalRecord.create({
        idPatient: patient.id,
        userId: 2, // Using vendedor user
        anamnesis: 'Patient complains of headaches and blurry vision when reading for extended periods.',
        othersDetails: 'No previous eye surgery. Family history of glaucoma.'
      });

      // Step 6: Create Visual Acuity data
      await VisualAcuity.create({
        clinicalrecordId: clinicalRecord.id,
        withoutCorrectionLE: parseFloat((Math.random() * 10).toFixed(2)),
        withoutCorrectionRE: parseFloat((Math.random() * 10).toFixed(2)),
        withoutCorrectionBI: parseFloat((Math.random() * 10).toFixed(2)),
        laserCorrectionLE: parseFloat((Math.random() * 10).toFixed(2)),
        laserCorrectionRE: parseFloat((Math.random() * 10).toFixed(2)),
        laserCorrectionBI: parseFloat((Math.random() * 10).toFixed(2)),
        pinholeLE: parseFloat((Math.random() * 10).toFixed(2)),
        pinholeRE: parseFloat((Math.random() * 10).toFixed(2)),
        pinholeBI: parseFloat((Math.random() * 10).toFixed(2)),
        pupilRedLE: parseFloat((Math.random() * 10).toFixed(2)),
        pupilRedRE: parseFloat((Math.random() * 10).toFixed(2))
      });

      // Step 7: Create Subjective Refraction Far data
      await SubjectiveRefractionFar.create({
        clinicalrecordId: clinicalRecord.id,
        sphereLE: parseFloat((Math.random() * 10).toFixed(2)),
        sphereRE: parseFloat((Math.random() * 10).toFixed(2)),
        cylinderLE: parseFloat((Math.random() * 10).toFixed(2)),
        cylinderRE: parseFloat((Math.random() * 10).toFixed(2)),
        axisLE: parseFloat((Math.random() * 10).toFixed(2)),
        axisRE: parseFloat((Math.random() * 10).toFixed(2)),
        vareachedLE: parseFloat((Math.random() * 10).toFixed(2)),
        vareachedRE: parseFloat((Math.random() * 10).toFixed(2)),
        pupilarDistance: parseFloat((Math.random() * 10).toFixed(2))
      });

      // Step 8: Create Subjective Refraction Near data
      await SubjectiveRefractionNear.create({
        clinicalrecordId: clinicalRecord.id,
        sphereLE: parseFloat((Math.random() * 10).toFixed(2)),
        sphereRE: parseFloat((Math.random() * 10).toFixed(2)),
        cylinderLE: parseFloat((Math.random() * 10).toFixed(2)),
        cylinderRE: parseFloat((Math.random() * 10).toFixed(2)),
        axisLE: parseFloat((Math.random() * 10).toFixed(2)),
        axisRE: parseFloat((Math.random() * 10).toFixed(2)),
        vareachedLE: parseFloat((Math.random() * 10).toFixed(2)),
        vareachedRE: parseFloat((Math.random() * 10).toFixed(2)),
        pupilarDistance: parseFloat((Math.random() * 10).toFixed(2))
      });

      // Step 9: Create Applanation Tonometry data
      await ApplanationTonometry.create({
        clinicalrecordId: clinicalRecord.id,
        leftEye: parseFloat((Math.random() * 10).toFixed(2)),
        rightEye: parseFloat((Math.random() * 10).toFixed(2)),
        dateTime: new Date()
      });

      console.log('Clinical record created successfully with ID:', clinicalRecord.id);
      return {
        clinicalRecord,
        patient
      };

    } catch (error) {
      console.error('Error creating clinical record:', error);
      throw error;
    }
  }
};