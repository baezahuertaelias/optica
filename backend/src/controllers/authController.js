const { Users, UserTypes } = require("../models");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");
const bcrypt = require("bcryptjs");

module.exports = {
  async login(req, res) {
    try {
      const { username, password } = req.body;

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
        id: user.id,
        username: user.username,
        userTypeId: user.userTypeId,
        status: user.status
      };

      const token = jwt.sign({ id: user.id }, jwtConfig.secret, {
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
        return res.status(400).json({ message: "Usuario y clave son requeridos" });
      }

      // Password strength validation
      if (password.length < 8) {
        return res.status(400).json({ message: "Contraseña tiene que ser mayor a 8 caracteres" });
      }

      if (userTypeId === null || userTypeId === undefined) {
        return res.status(400).json({ message: "Tipo usuario es necesario" });
      }

      const existingUser = await Users.findOne({ where: { username } });

      if (existingUser) {
        return res.status(409).json({ message: "Usuario ya existe" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await Users.create({
        username,
        password: hashedPassword,
        status: 1,
        userTypeId
      });

      // Create a user object without the password for the token payload
      const userForToken = {
        id: user.id,
        username: user.username
      };

      const token = jwt.sign({ id: user.id }, jwtConfig.secret, {
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
          { model: UserTypes, as: 'UserType' }
        ],
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

      // Find user by id
      const user = await Users.findOne({
        where: { id },
        include: { model: UserTypes, as: 'UserType' }
      });

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // Update fields if provided
      if (username) user.username = username;

      // Password validation if provided
      if (password) {
        if (password.length < 8) {
          return res.status(400).json({ message: "Contraseña tiene que ser mayor a 8 caracteres" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
      }

      if (userTypeId !== undefined) user.userTypeId = userTypeId;

      if (status !== undefined) user.status = status;

      await user.save();

      return res.status(200).json({
        id: user.id,
        username: user.username,
        userTypeId: user.userTypeId,
        status: user.status
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
        return res.status(400).json({ message: "ID usuario es requerido" });
      }

      // Find user by id
      const user = await Users.findByPk(id);

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
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
        return res.status(400).json({ message: "ID usuario es requerido" });
      }

      // Find user by id
      const user = await Users.findOne({
        where: { id }
      });

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      await user.destroy();
      return res.status(200).json({ message: "Usuario eliminado" });
    } catch (error) {
      console.error("Failed to delete user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async getAllUserTypes(req, res) {
    try {
      // Check if UserType model exists
      const userTypes = await UserTypes.findAll();
      if (!userTypes || userTypes.length === 0) {
        return res.status(404).json({ message: "No se encontraron tipos de usuario" });
      }

      return res.status(200).json({ userTypes });
    } catch (error) {
      console.error("Failed to fetch UserTypes:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};