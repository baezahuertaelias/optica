const { Patients, Isapres, Genders } = require("../models");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");
const bcrypt = require("bcryptjs"); // Ensure this package is installed

module.exports = {
  async createPatient(req, res) {
    try {
      const { name, passport, genderId, tel, birthday, homeaddress, mail, occupation, legalrepresentative, idIsapre } = req.body;
      if (!name || !genderId || !mail || !birthday) {
        return res.status(400).json({ message: "Required fields missing" });
      }

      const patient = await Patients.create({ name, passport, genderId, tel, birthday, homeaddress, mail, occupation, legalrepresentative, idIsapre });
      return res.status(201).json({ patient });
    } catch (error) {
      console.error("Error creating patient:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async getAllPatients(req, res) {
    try {
      const patients = await Patients.findAll({
        include: [
          {
            model: Genders,
            as: 'genders' // Use the alias specified in your association
          },
          {
            model: Isapres,
            as: 'isapre' // Use the alias specified in your association
          }
        ],
  
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

      const patient = await Patients.findByPk(id);
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
      const { name, passport, genderId, tel, birthday, homeaddress, mail, occupation, legalrepresentative, idIsapre } = req.body;

      const patient = await Patients.findByPk(id);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      console.log(`updatePatient ${id}`,req.body);
      

      // Update fields if provided
      if (name !== undefined) patient.name = name;
      if (passport !== undefined) patient.passport = passport;
      if (genderId !== undefined) patient.genderId = genderId;
      if (tel !== undefined) patient.tel = tel;
      if (birthday !== undefined) patient.birthday = birthday;
      if (homeaddress !== undefined) patient.homeaddress = homeaddress;
      if (mail !== undefined) patient.mail = mail;
      if (occupation !== undefined) patient.occupation = occupation;
      if (legalrepresentative !== undefined) patient.legalrepresentative = legalrepresentative;
      if (idIsapre !== undefined) patient.idIsapre = idIsapre;

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

      const patient = await Patients.findByPk(id);
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
      const isapres = await Isapres.findAll();
      return res.status(200).json({ isapres });
    } catch (error) {
      console.error("Failed to fetch ISAPREs:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async getGenders(req, res) {
    try {
      const genders = await Genders.findAll();
      return res.status(200).json({ genders });
    } catch (error) {
      console.error("Failed to fetch genders:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

};