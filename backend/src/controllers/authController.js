const { User, TypeUser } = require("../models");
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

      const user = await User.findOne({ where: { username } });

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
        typeUserId: user.typeUserId,
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
      const { username, password, typeUserId, name } = req.body;

      console.log('registerUser req',req.body);
      

      if (!username || !password) {
        return res.status(400).json({ message: "Usuario y clave son requeridos" });
      }

      // Password strength validation
      if (password.length < 8) {
        return res.status(400).json({ message: "Contraseña tiene que ser mayor a 8 caracteres" });
      }

      if (typeUserId === null || typeUserId === undefined) {
        return res.status(400).json({ message: "Tipo usuario es necesario" });
      }

      const existingUser = await User.findOne({ where: { username } });

      if (existingUser) {
        return res.status(409).json({ message: "Usuario ya existe" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        username,
        password: hashedPassword,
        status: 1,
        typeUserId
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
      const users = await User.findAll({
        include: [
          { model: TypeUser, as: 'typeUser' } // Changed to singular
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
      const { username, password, typeUserId, status, name } = req.body;

      console.log('updateUser body',req.body);
      

      // Find user by id
      const user = await User.findOne({
        where: { id },
        include: { model: TypeUser, as: 'typeUser' } // Changed to singular
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

      if (typeUserId !== undefined) user.typeUserId = typeUserId;

      if (status !== undefined) user.status = status;
      if (name !== undefined) user.name = name;

      await user.save();

      return res.status(200).json({
        id: user.id,
        username: user.username,
        typeUserId: user.typeUserId,
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
      const user = await User.findByPk(id);

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
      const user = await User.findOne({
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

  async getAllTypeUsers(req, res) {
    try {
      // Check if TypeUser model exists
      const typeUsers = await TypeUser.findAll();
      if (!typeUsers || typeUsers.length === 0) {
        return res.status(404).json({ message: "No se encontraron tipos de usuario" });
      }

      return res.status(200).json({ typeUsers });
    } catch (error) {
      console.error("Failed to fetch UserTypes:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};