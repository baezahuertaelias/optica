const bcrypt = require("bcrypt");
const { faker } = require('@faker-js/faker');
// Import the Spanish (Mexico) locale
const { fakerES_MX } = require('@faker-js/faker');
const { User, 
  TypeUser, 
  Isapre, 
  Gender, 
  Patient, 
  ClinicalRecord, 
  VisualAcuity, 
  SubjectiveRefractionFar, 
  SubjectiveRefractionNear, 
  ApplanationTonometry, 
  TypeAppointment, 
  Appointment, 
  Country, 
  TypeIndication, 
  TypeControl,
  Autorefractometry,
  TypeDiagnosis,
  Lensometry } = require("./models"); // Added Indications and Control
const { addHours, addDays } = require('date-fns');

/**
 * Calculates the verification digit for a Chilean RUT
 * @param {number} rutNumber - The RUT number without verification digit
 * @returns {string} The verification digit (0-9 or K)
 */
function calculateVerificationDigit(rutNumber) {
  const rutDigits = rutNumber.toString().split('').reverse();

  // Multipliers sequence: 2, 3, 4, 5, 6, 7, repeat from 2...
  const multipliers = [2, 3, 4, 5, 6, 7];

  let sum = 0;

  // Calculate the weighted sum
  for (let i = 0; i < rutDigits.length; i++) {
    sum += parseInt(rutDigits[i]) * multipliers[i % multipliers.length];
  }

  // Calculate the verification digit
  const remainder = sum % 11;
  const verificationDigit = 11 - remainder;

  // Convert the verification digit to the expected format
  if (verificationDigit === 11) {
    return '0';
  } else if (verificationDigit === 10) {
    return 'K';
  } else {
    return verificationDigit.toString();
  }
}

/**
 * Generates a valid Chilean RUT
 * @param {boolean} formatted - Whether to return the RUT with formatting (dots and dash)
 * @param {number} min - Minimum value for the RUT number (default: 1000000)
 * @param {number} max - Maximum value for the RUT number (default: 25000000)
 * @returns {string} A valid Chilean RUT
 */
function generateChileanRut(formatted = true, min = 1000000, max = 25000000) {
  // Generate a random number for the RUT (without verification digit)
  const rutNumber = Math.floor(Math.random() * (max - min + 1)) + min;

  // Calculate the verification digit
  const verificationDigit = calculateVerificationDigit(rutNumber);

  // Format the RUT if requested
  if (formatted) {
    // Convert number to string
    let rutString = rutNumber.toString();

    // Add dots for thousand separators
    let formattedRut = '';
    for (let i = rutString.length - 1, j = 0; i >= 0; i--, j++) {
      if (j % 3 === 0 && j !== 0) {
        formattedRut = '.' + formattedRut;
      }
      formattedRut = rutString[i] + formattedRut;
    }

    return `${formattedRut}-${verificationDigit}`;
  }

  return `${rutNumber}${verificationDigit}`;
}

module.exports = {

  async createSampleAppointments() {
    try {
      // Check if appointments already exist
      const appointmentCount = await Appointment.count();

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
      const hashedPassword = await bcrypt.hash('123.Admin.', 10);

      // Step 1: Create UserTypes if they don't exist
      const typeUserCount = await TypeUser.count();
      if (typeUserCount === 0) {
        await TypeUser.bulkCreate([
          { color: "blue", type: "Admin" },
          { color: "green", type: "Vendedor" },
          { color: "teal", type: "Medico" }
        ]);
      }

      // Step 2: Create or find the necessary users
      // First, check if user with ID 2 exists (which we need for the clinical record)
      let vendedorUser = await User.findByPk(2);
      if (!vendedorUser) {
        // If user with ID 2 doesn't exist, create all users
        await User.bulkCreate([
          {
            username: 'admin',
            password: hashedPassword,
            userTypeId: 1,
            status: true,
            name: 'ADMINISTRADOR'
          },
          {
            username: 'vendedor',
            password: hashedPassword,
            userTypeId: 2,
            status: true,
            name: 'VendedorADMIN'
          },
          {
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
          { value: 'Mujer' },
          { value: 'Hombre' },
          { value: 'Otro' }
        ]);
      }

      // Create Isapres if they don't exist
      const isapreCount = await Isapre.count();
      if (isapreCount === 0) {
        await Isapre.bulkCreate(
          [
            { color: "blue", value: "Banmedica" },
            { color: "green", value: "Isalud" },
            { color: "yellow", value: "Colmena" },
            { color: "cyan", value: "Consalud" },
            { color: "pink", value: "Cruz Blanca" },
            { color: "indigo", value: "Nueva Masvida" },
            { color: "teal", value: "Fundacion BancoEstado" },
            { color: "orange", value: "Vida tres" },
            { color: "purple", value: "Escencial" },
            { color: "bluegray", value: "Otra" },
          ]);
      }

      const countryCount = await Country.count();
      if (countryCount === 0) {
        await Country.bulkCreate(
          [
            { name: "Chile", code: "CL" },
          ]);
      }

      // Step 4: Create a Patient with Spanish (Mexico) locale
      // Important: Now calling the function directly, not through this
      const patient = await Patient.create({
        name: fakerES_MX.person.fullName(),
        passport: generateChileanRut(), // Fixed: using direct function call
        countryId: 1,
        genderId: fakerES_MX.person.sexType() === 'female' ? 1 : 2, // Randomly assign gender from available options
        tel: fakerES_MX.phone.number(),
        birthday: new Date(fakerES_MX.date.birthdate()),
        homeAddress: fakerES_MX.location.streetAddress({ useFullAddress: true }),
        mail: fakerES_MX.internet.email(),
        occupation: fakerES_MX.person.jobTitle(),
        legalRepresentative: fakerES_MX.person.fullName(),
        isapreId: Math.floor(Math.random() * 9) + 1 // Random number between 1-9
      });

      // Create Indication and Control if they don't exist
      const typeIndicationCount = await TypeIndication.count();
      if (typeIndicationCount === 0) {
        await TypeIndication.bulkCreate([
          { value: "Lentes Para Lejos" },
          { value: "Lentes para Cerca" },
          { value: "Lentes para Lejos y Cerca" },
          { value: "Lentes Permanentes" },
          { value: "Lentes Selectivo" },
        ]);
      }

      const typeControlCount = await TypeControl.count();
      if (typeControlCount === 0) {
        await TypeControl.bulkCreate([
          { value: "Control 1 Año" },
          { value: "Control 6 Meses" },
          { value: "Control 3 Meses" },
          { value: "Control 1 Mes" }
        ]);
      }


      // Step 5: Create the Clinical Record
      const clinicalRecord = await ClinicalRecord.create({
        patientId: patient.id,
        userId: 2, // Using vendedor user
        anamnesis: fakerES_MX.lorem.paragraph(2),
        latestClinicalDate: new Date(fakerES_MX.date.birthdate()),
        ophthalmologicalMedicalHistory: fakerES_MX.lorem.sentence(),
        familyMedicalHistory: fakerES_MX.lorem.sentence(),
        generalMedicalHistory: fakerES_MX.lorem.sentence(),
        otherExam: fakerES_MX.lorem.sentence(),
        observations: fakerES_MX.lorem.sentence(),
        artificialTear: Math.random() >= 0.5,
        indicationId: Math.floor(Math.random() * 5) + 1, // Assuming the Indications table is pre-populated with id=1
        controlId: Math.floor(Math.random() * 4) + 1     // Assuming the Controls table is pre-populated with id=1
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
        pupilRedLE: Math.random() >= 0.5,
        pupilRedRE: Math.random() >= 0.5
      });

      // Step 7: Create Subjective Refraction Far data
      await SubjectiveRefractionFar.create({
        clinicalRecordId: clinicalRecord.id,
        sphereLE: parseFloat((Math.random() * 10).toFixed(2)),
        sphereRE: parseFloat((Math.random() * 10).toFixed(2)),
        cylinderLE: parseFloat((Math.random() * 10).toFixed(2)),
        cylinderRE: parseFloat((Math.random() * 10).toFixed(2)),
        axisLE: Math.floor(Math.random() * 100) + 1,
        axisRE: Math.floor(Math.random() * 100) + 1,
        vareachedLE: parseFloat((Math.random() * 10).toFixed(2)),
        vareachedRE: parseFloat((Math.random() * 10).toFixed(2)),
        pupilarDistance: Math.floor(Math.random() * 100) + 1
      });

      // Step 8: Create Subjective Refraction Near data
      await SubjectiveRefractionNear.create({
        clinicalRecordId: clinicalRecord.id,
        sphereLE: parseFloat((Math.random() * 10).toFixed(2)),
        sphereRE: parseFloat((Math.random() * 10).toFixed(2)),
        cylinderLE: parseFloat((Math.random() * 10).toFixed(2)),
        cylinderRE: parseFloat((Math.random() * 10).toFixed(2)),
        axisLE: Math.floor(Math.random() * 100) + 1,
        axisRE: Math.floor(Math.random() * 100) + 1,
        vareachedLE: parseFloat((Math.random() * 10).toFixed(2)),
        vareachedRE: parseFloat((Math.random() * 10).toFixed(2)),
        pupilarDistance: Math.floor(Math.random() * 100) + 1,
        add: Math.floor(Math.random() * 100) + 1
      });

      // Step 9: Create Applanation Tonometry data
      await ApplanationTonometry.create({
        clinicalRecordId: clinicalRecord.id,
        leftEye: Math.floor(Math.random() * 100) + 1,
        rightEye: Math.floor(Math.random() * 100) + 1,
        dateTime: new Date()
      });

      // Step 10: Create Autorefractometry data
      await Autorefractometry.create({
        clinicalRecordId: clinicalRecord.id,
        sphereLE: parseFloat((Math.random() * 10).toFixed(2)),
        sphereRE: parseFloat((Math.random() * 10).toFixed(2)),
        cylinderLE: parseFloat((Math.random() * 10).toFixed(2)),
        cylinderRE: parseFloat((Math.random() * 10).toFixed(2)),
        axisLE: Math.floor(Math.random() * 100) + 1,
        axisRE: Math.floor(Math.random() * 100) + 1,
        add: parseFloat((Math.random() * 10).toFixed(2))
      });

      // Step 11: Create Diagnosis data
      await TypeDiagnosis.create({
        clinicalRecordId: clinicalRecord.id,
        myopia: Math.random() >= 0.5,
        hyperopia: Math.random() >= 0.5,
        astigmatism: Math.random() >= 0.5,
        presbyopia: Math.random() >= 0.5,
        emmetrope: Math.random() >= 0.5,
        derived: Math.random() >= 0.5
      });

      // Step 12: Create Lensometry data
      await Lensometry.create({
        clinicalRecordId: clinicalRecord.id,
        sphereLE: parseFloat((Math.random() * 10).toFixed(2)),
        sphereRE: parseFloat((Math.random() * 10).toFixed(2)),
        cylinderLE: parseFloat((Math.random() * 10).toFixed(2)),
        cylinderRE: parseFloat((Math.random() * 10).toFixed(2)),
        axisLE: Math.floor(Math.random() * 100) + 1,
        axisRE: Math.floor(Math.random() * 100) + 1,
        add: parseFloat((Math.random() * 10).toFixed(2))
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
  },

}