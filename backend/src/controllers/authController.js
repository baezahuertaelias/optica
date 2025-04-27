const jwt = require("jsonwebtoken");
const { Users, UserTypes } = require("../models");
const jwtConfig = require("../config/jwt");
const bcrypt = require("bcryptjs"); // Make sure this package is installed

module.exports = {
  async login(req, res) {
    try {
      const { password, username } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Usuario y clave es requerido" });
      }

      const user = await Users.findOne({ where: { username } });

      if (!user) {
        return res.status(401).json({ message: "Usuario no encontrado" });
      }

      // Direct password comparison with bcrypt
      const passwordMatch = await bcrypt.compare(password, user.password);
      
      if (!passwordMatch) {
        return res.status(401).json({ message: "Clave invalida" });
      }

      // Create a user object without password for response
      const userResponse = {
        id: user.id ,
        username: user.username,
        userTypeId: user.userTypeId,
        status: user.status
      };

      const token = jwt.sign({ id: user.id || user.Id }, jwtConfig.secret, {
        expiresIn: jwtConfig.expiresIn,
      });

      return res.json({ 
        user: userResponse, 
        token 
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async registerUser(req, res) {
    try {
      const { username, password, userTypeId } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      // Password strength validation
      if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long" });
      }


      if (userTypeId === null || userTypeId === undefined) {
        return res.status(400).json({ message: "Usertype cant be null" });
      }

      const existingUser = await Users.findOne({ where: { username } });
      if (existingUser) {
        return res.status(409).json({ message: "Username already taken" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await Users.create({
        username,
        password: hashedPassword, // Password will be hashed in the model's beforeSave hook
        status: 1,
        userTypeId
      });

      // Create a user object without the password for the token payload
      const userForToken = {
        id: user.id,
        username: user.username
      };

      const token = jwt.sign({ id: user.Id || user.id }, jwtConfig.secret, {
        expiresIn: jwtConfig.expiresIn,
      });

      return res.status(201).json({ 
        user: userForToken, 
        token 
      });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async getAllUsers(req, res) {
    try {
      const users = await Users.findAll({
        include: [
          {
            model: UserTypes,
            as: 'userType' // Use the alias specified in your association
          }
        ], // Include the related UserType for each user
        attributes: { exclude: ['password'] },
      });
      return res.status(200).json({ users });
    } catch (error) {
      console.error("Failed to fetch users:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { username, password, userTypeId, status } = req.body;

      // Find user by id, handling both capitalization cases
      const user = await Users.findOne({
        where: {
          id
        },
        include: UserTypes
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update fields if provided
      if (username) user.username = username;
      
      // Password validation if provided
      if (password) {
        if (password.length < 8) {
          return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
      }
      
      if (userTypeId) user.userTypeId = userTypeId;

      await user.save();

      return res.status(200).json({
        id: user.id,
        username: user.username,
        userTypeId: user.userTypeId
      });
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async findOneUser(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "User ID is required" });
      }

      // Find user by id, handling both capitalization cases
      const user = await Users.findByPk(id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ user });
    } catch (error) {
      console.error("Failed to fetch user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "User ID is required" });
      }

      // Find user by id, handling both capitalization cases
      const user = await Users.findOne({
        where: {
          [Users.sequelize.or]: [{ id }, { Id: id }]
        }
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await user.destroy();
      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Failed to delete user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async getAllUserTypes(req, res) {
    try {
      // Check if UserType model exists
      if (!UserTypes) {
        return res.status(500).json({ message: "UserType model not found" });
      }
      
      const userTypes = await UserTypes.findAll();
      if (!userTypes || userTypes.length === 0) {
        return res.status(404).json({ message: "No user types found" });
      }
      
      return res.status(200).json({ userTypes });
    } catch (error) {
      console.error("Failed to fetch UserTypes:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};