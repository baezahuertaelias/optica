const bcrypt = require("bcrypt");
const { faker } = require('@faker-js/faker');
// Import the Spanish (Mexico) locale
const { fakerES_MX } = require('@faker-js/faker');
const { User, UserType, Isapre, Gender, Patient, ClinicalRecord, VisualAcuity, SubjectiveRefractionFar, SubjectiveRefractionNear, ApplanationTonometry, TypeAppointment, Appointment } = require("../models");
const { addHours, addDays } = require('date-fns');

module.exports = {
  async createSampleAppointments() {
    try {
      // Check if appointments already exist
      const appointmentCount = await Appointment.count();
      console.log('appoi',appointmentCount);
      
      if (appointmentCount > 0) {
        console.log('Appointments already exist, skipping creation');
        return;
      }

      // Make sure TypeAppointments exist
      const typeAppointmentCount = await TypeAppointment.count();
      if (typeAppointmentCount === 0) {
        await TypeAppointment.bulkCreate([
          {
            name: "Receta de lentes",
            duration: 45,
            color: "green",
            description: "nada"
          },
          {
            name: "Agudeza visual",
            duration: 30,
            color: "blue",
            description: "pronto"
          },
          {
            name: "Tonometria",
            duration: 15,
            color: "yellow",
            description: "pronto"
          },
          {
            name: "Retinografia sin dilatacion",
            duration: 15,
            color: "teal",
            description: "pronto"
          },
          {
            name: "Retinografia con dilatacion",
            duration: 30,
            color: "cyan",
            description: "pronto"
          }
        ]);
        //console.log('No TypeAppointments found, please run createTypeAppointments first');
        //return;
      }

      // Get a patient
      const patient = await Patient.findOne();
      if (!patient) {
        console.log('No patients found, please run createClinicalRecordWithDummyData first');
        return;
      }

      // Get a medical user (userTypeId = 3)
      const medicalUser = await User.findOne({ where: { userTypeId: 3 } });
      if (!medicalUser) {
        console.log('No medical users found, please run createClinicalRecordWithDummyData first');
        return;
      }

      // Get appointment types
      const appointmentTypes = await TypeAppointment.findAll();

      // Create appointments for the next 7 days
      const today = new Date();
      today.setHours(9, 0, 0, 0); // Start at 9 AM

      const appointments = [];

      // Create 3 appointments per day for the next 7 days
      for (let day = 0; day < 7; day++) {
        const dayBase = addDays(today, day);

        // Create appointments at 9 AM, 11 AM, and 2 PM
        const appointmentTimes = [
          dayBase,
          addHours(dayBase, 2),
          addHours(dayBase, 5)
        ];

        for (let i = 0; i < appointmentTimes.length; i++) {
          const startTime = appointmentTimes[i];
          const appointmentType = appointmentTypes[i % appointmentTypes.length];

          // Calculate end time based on appointment type duration
          const endTime = addHours(startTime, appointmentType.duration / 60);

          appointments.push({
            patientId: patient.id,
            userId: medicalUser.id,
            start: startTime,
            end: endTime,
            typeAppointmentId: appointmentType.id,
            status: true,
            notes: `Sample appointment ${i + 1} for day ${day + 1}`
          });
        }
      }

      // Create all appointments
      await Appointment.bulkCreate(appointments);

      console.log(`Created ${appointments.length} sample appointments`);
    } catch (error) {
      console.error('Error creating sample appointments:', error);
      throw error;
    }
  },

  async createClinicalRecordWithDummyData() {
    try {
      const hashedPassword = await bcrypt.hash('123', 10);

      // Step 1: Create UserTypes if they don't exist
      const userTypeCount = await UserType.count();
      if (userTypeCount === 0) {
        await UserType.bulkCreate([
          { id: 1, type: "Admin" },
          { id: 2, type: "Vendedor" },
          { id: 3, type: "Medico" }
        ]);
      }

      // Step 2: Create or find the necessary users
      // First, check if user with ID 2 exists (which we need for the clinical record)
      let vendedorUser = await User.findByPk(2);
      if (!vendedorUser) {
        // If user with ID 2 doesn't exist, create all users
        await User.bulkCreate([
          {
            id: 1,
            username: 'admin',
            password: hashedPassword,
            userTypeId: 1,
            status: true,
            name: 'ADMINISTRADOR'
          },
          {
            id: 2,
            username: 'vendedor',
            password: hashedPassword,
            userTypeId: 2,
            status: true,
            name: 'VendedorADMIN'
          },
          {
            id: 3,
            username: 'medico',
            password: hashedPassword,
            userTypeId: 3,
            status: true,
            name: 'MedicoAdmin'
          }
        ], { returning: true });
      }

      // Step 3: Create Genders if they don't exist
      const genderCount = await Gender.count();
      if (genderCount === 0) {
        await Gender.bulkCreate([
          { id: 1, value: 'Mujer' },
          { id: 2, value: 'Hombre' },
          { id: 3, value: 'Otro' }
        ]);
      }

      // Create Isapres if they don't exist
      const isapreCount = await Isapre.count();
      if (isapreCount === 0) {
        await Isapre.bulkCreate(
          [
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

      // Step 4: Create a Patient with Spanish (Mexico) locale

      console.log({
        name: fakerES_MX.person.fullName(),
        passport: `11.111.111-1`,
        genderId: fakerES_MX.person.sexType() === 'female' ? 1 : 2, // Randomly assign gender from available options
        tel: fakerES_MX.phone.number(),
        birthday: new Date(fakerES_MX.date.birthdate()),
        homeAddress: fakerES_MX.location.streetAddress({ useFullAddress: true }),
        mail: fakerES_MX.internet.email(),
        occupation: fakerES_MX.person.jobTitle(),
        legalRepresentative: fakerES_MX.person.fullName(),
        isapreId: (Math.floor(Math.random() * 9) + 1) // Random number between 1-9
      });


      const patient = await Patient.create({
        name: fakerES_MX.person.fullName(),
        passport: `11.111.111-1`,
        genderId: fakerES_MX.person.sexType() === 'female' ? 1 : 2, // Randomly assign gender from available options
        tel: fakerES_MX.phone.number(),
        birthday: new Date(fakerES_MX.date.birthdate()),
        homeAddress: fakerES_MX.location.streetAddress({ useFullAddress: true }),
        mail: fakerES_MX.internet.email(),
        occupation: fakerES_MX.person.jobTitle(),
        legalRepresentative: fakerES_MX.person.fullName(),
        isapreId: Math.floor(Math.random() * 9) + 1 // Random number between 1-9
      });

      console.log('patientid', patient.id);
      

      // Step 5: Create the Clinical Record
      const clinicalRecord = await ClinicalRecord.create({
        patientId: patient.id,
        userId: 2, // Using vendedor user
        anamnesis: fakerES_MX.lorem.paragraph(2),
        othersDetails: fakerES_MX.lorem.sentence(),
      });

      // Step 6: Create Visual Acuity data
      await VisualAcuity.create({
        clinicalRecordId: clinicalRecord.id,
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
        clinicalRecordId: clinicalRecord.id,
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
        clinicalRecordId: clinicalRecord.id,
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
        clinicalRecordId: clinicalRecord.id,
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