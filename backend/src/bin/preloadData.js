const bcrypt = require("bcrypt");
const { Users, UserTypes, Isapres, Genders, Patients, ClinicalRecord, VisualAcuity, SubjectiveRefractionFar, SubjectiveRefractionNear, ApplanationTonometry } = require("../models");

module.exports = {
  async insertBasicData() {
    try {

      console.log('== CARGANDO DATOS ==');
      console.log('==== TYPE  USER ====');

      await UserTypes.bulkCreate(
        [{
          id: 2,
          type: "Admin",
        },
        {
          id: 3,
          type: "Vendedor",
        }]
      );

      console.log('======= USER =======');
      const hashedPassword = await bcrypt.hash('123', 10);
      await Users.create({
        id: 1,
        username: "elias",
        password: hashedPassword,
        userTypeId: 1,
        status: true
      })

      console.log('====== ISAPRE ======');

      await Isapres.bulkCreate(
        [{
          value: "Banmedica",
        },
        {
          value: "Isalud",
        },
        {
          value: "Colmena",
        },
        {
          value: "Consalud",
        },
        {
          value: "Cruz Blanca",
        },
        {
          value: "Nueva Masvida",
        },
        {
          value: "Fundacion BancoEstado",
        },
        {
          value: "Vida tres",
        },
        {
          value: "Escencial",
        }]
      );

      console.log('====== GENDER ======');
      await Genders.bulkCreate([
        { value: 'Mujer' },
        { value: 'Hombre' },
        { value: 'Otro' }
      ]);
      console.log('== DATOS CARGADOS ==');

    } catch (error) {
      console.error("Error inserting basic data:", error);
    }
  },
  async createDummyPatient() {
    try {
      // Check if we have required gender and isapre entries
      let gender = await Genders.findByPk(1);
      if (!gender) {
        // Create a gender if it doesn't exist
        gender = await Genders.create({
          value: 'Female'
        });
      }

      let isapre = await Isapres.findByPk(1);
      if (!isapre) {
        // Create an isapre if it doesn't exist
        isapre = await Isapres.create({
          value: 'Fonasa'
        });
      }

      // Create the patient with dummy data
      const patient = await Patients.create({
        name: `Patient ${Math.floor(Math.random() * 1000)}`, // Random name to avoid unique constraint error
        passport: `P${Math.floor(Math.random() * 1000000)}`,
        genderId: gender.id,
        tel: '+1234567890',
        birthday: new Date(), // January 1, 1990
        homeAddress: '123 Main Street, Anytown',
        mail: `patient${Math.floor(Math.random() * 10000)}@example.com`, // Random email to avoid unique constraint error
        occupation: 'Software Developer',
        legalRepresentative: false,
        idIsapre: isapre.id
      });

      console.log('Patient created successfully:', patient.toJSON());
      return patient;
    } catch (error) {
      console.error('Error creating patient:', error);
      throw error;
    }
  },

  async createClinicalRecordWithDummyData() {
    // Start a transaction to ensure data consistency
    /* const t = await sequelize.transaction(); */

    try {
      const hashedPassword = await bcrypt.hash('123', 10);
      // Step 1: Create or find a UserType (if it doesn't exist)
      let userType = await UserTypes.findByPk(1/* , { transaction: t } */);
      if (!userType) {
        userType = await UserTypes.create({
          type: 'Doctor'
        }/* , { transaction: t } */);
      }

      // Step 2: Create or find a User (if it doesn't exist)
      let user = await Users.findByPk(1/* , { transaction: t } */);
      if (!user) {
        user = await Users.create({
          username: 'doctor_user',
          password: hashedPassword, // In a real app, you'd hash this
          userTypeId: userType.id,
          status: true
        }/* , { transaction: t } */);
      }

      // Step 3: Create or find Gender and Isapre for Patient
      let gender = await Genders.findByPk(1/* , { transaction: t } */);
      if (!gender) {
        gender = await Genders.create({
          value: 'Male'
        }/* , { transaction: t } */);
      }

      let isapre = await Isapres.findByPk(1/* , { transaction: t } */);
      if (!isapre) {
        isapre = await Isapres.create({
          value: 'Fonasa'
        }/* , { transaction: t } */);
      }

      // Step 4: Create a Patient (if it doesn't exist)
      // Use a random number to avoid unique constraint violations
      const randomNum = Math.floor(Math.random() * 10000);
      let patient = await Patients.create({
        name: `Test Patient ${randomNum}`,
        passport: `P${randomNum}`,
        genderId: gender.id,
        tel: '+1234567890',
        birthday: new Date(1985, 5, 15), // June 15, 1985
        homeAddress: '123 Test Street, City',
        mail: `patient${randomNum}@test.com`,
        occupation: 'Software Developer',
        legalRepresentative: false,
        idIsapre: isapre.id
      }/* , { transaction: t } */);

      // Step 5: Create the Clinical Record
      const clinicalRecord = await ClinicalRecord.create({
        idPatient: patient.id,
        userId: user.id,
        anamnesis: 'Patient complains of headaches and blurry vision when reading for extended periods.',
        othersDetails: 'No previous eye surgery. Family history of glaucoma.'
      }/* , { transaction: t } */);

      // Step 6: Create Visual Acuity data
      await VisualAcuity.create({
        clinicalrecordId: clinicalRecord.id,
        withoutCorrectionLE: '20/50',
        withoutCorrectionRE: '20/40',
        withoutCorrectionBI: '20/40',
        laserCorrectionLE: '20/30',
        laserCorrectionRE: '20/25',
        laserCorrectionBI: '20/25',
        pinholeLE: '20/30',
        pinholeRE: '20/25',
        pinholeBI: '20/25',
        pupilRedLE: 'Normal',
        pupilRedRE: 'Normal'
      }/* , { transaction: t } */);

      // Step 7: Create Subjective Refraction Far data
      await SubjectiveRefractionFar.create({
        clinicalrecordId: clinicalRecord.id,
        sphereLE: -1.75,
        sphereRE: -1.25,
        cylinderLE: -0.50,
        cylinderRE: -0.25,
        axisLE: 180,
        axisRE: 90,
        vareachedLE: '20/25',
        vareachedRE: '20/20',
        pupilarDistance: 62.5
      }/* , { transaction: t } */);

      // Step 8: Create Subjective Refraction Near data
      await SubjectiveRefractionNear.create({
        clinicalrecordId: clinicalRecord.id,
        sphereLE: -1.25,
        sphereRE: -0.75,
        cylinderLE: -0.50,
        cylinderRE: -0.25,
        axisLE: 180,
        axisRE: 90,
        vareachedLE: '20/20',
        vareachedRE: '20/20',
        pupilarDistance: 60.0
      }/* , { transaction: t } */);

      // Step 9: Create Applanation Tonometry data
      await ApplanationTonometry.create({
        clinicalrecordId: clinicalRecord.id,
        leftEye: 16.5,
        rightEye: 15.0,
        dateTime: new Date()
      }/* , { transaction: t } */);

      // Commit the transaction if all operations succeed
      /* await t.commit(); */

      console.log('Clinical record created successfully with ID:', clinicalRecord.id);
      return {
        clinicalRecord,
        patient,
        user
      };

    } catch (error) {
      // Rollback the transaction if any operation fails
      /* await t.rollback(); */
      console.error('Error creating clinical record:', error);
      throw error;
    }
  }



};
