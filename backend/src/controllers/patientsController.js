const { 
  Patient,  
  Isapre,   
  Gender    
} = require("../models");
// ... rest of code here ...

module.exports = {
  async createPatient(req, res) {
    try {
      const { 
        name, 
        passport, 
        genderId, 
        tel, 
        birthday, 
        homeAddress, 
        mail, 
        occupation, 
        legalRepresentative,
        isapreId,
        countryId
      } = req.body;
      
      if (!name || !genderId || !mail || !birthday) {
        return res.status(400).json({ message: "Required fields missing" });
      }

      const patient = await Patient.create({ 
        name, 
        passport, 
        genderId, 
        tel, 
        birthday, 
        homeAddress, 
        mail, 
        occupation, 
        legalRepresentative, 
        isapreId,
        countryId
      });
      
      return res.status(201).json({ patient });
    } catch (error) {
      console.error("Error creating patient:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async getAllPatients(req, res) {
    try {
      const patients = await Patient.findAll({  
        include: [
          { model: Gender, as: 'gender' },  
          { model: Isapre, as: 'isapre' }   
        ]
      });
      
      return res.status(200).json({ patients });
    } catch (error) {
      console.error("Failed to fetch patients:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async getPatientById(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Patient ID is required" });
      }

      const patient = await Patient.findByPk(id, {  
        include: [
          { model: Gender, as: 'gender' },  
          { model: Isapre, as: 'isapre' }
        ]
      });
      
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      return res.status(200).json({ patient });
    } catch (error) {
      console.error("Failed to fetch patient:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async updatePatient(req, res) {
    try {
      const { id } = req.params;
      const { 
        name, 
        passport, 
        genderId, 
        tel, 
        birthday, 
        homeAddress,   
        mail, 
        occupation, 
        legalRepresentative,  
        isapreId,
        countryId               
      } = req.body;

      const patient = await Patient.findByPk(id);  
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      // Update fields if provided
      if (name !== undefined) patient.name = name;
      if (passport !== undefined) patient.passport = passport;
      if (genderId !== undefined) patient.genderId = genderId;
      if (tel !== undefined) patient.tel = tel;
      if (birthday !== undefined) patient.birthday = birthday;
      if (homeAddress !== undefined) patient.homeAddress = homeAddress;  
      if (mail !== undefined) patient.mail = mail;
      if (occupation !== undefined) patient.occupation = occupation;
      if (legalRepresentative !== undefined) patient.legalRepresentative = legalRepresentative;  
      if (isapreId !== undefined) patient.isapreId = isapreId;
      if (countryId !== undefined) patient.countryId = countryId;  

      await patient.save();

      return res.status(200).json({ patient });
    } catch (error) {
      console.error("Error updating patient:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async deletePatient(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Patient ID is required" });
      }

      const patient = await Patient.findByPk(id);  
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      await patient.destroy();
      return res.status(200).json({ message: "Patient deleted successfully" });
    } catch (error) {
      console.error("Failed to delete patient:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async getIsapres(req, res) {
    try {
      const isapres = await Isapre.findAll();  
      return res.status(200).json({ isapres });
    } catch (error) {
      console.error("Failed to fetch ISAPREs:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async getGenders(req, res) {
    try {
      const genders = await Gender.findAll();  
      return res.status(200).json({ genders });
    } catch (error) {
      console.error("Failed to fetch genders:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};