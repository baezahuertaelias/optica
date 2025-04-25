const jwt = require("jsonwebtoken");
const { User } = require("../models");
const jwtConfig = require("../config/jwt");

module.exports = {
  async login(req, res) {
    try {
      const { password, username } = req.body;

      const user = await User.findOne({ where: { Username: username } });

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      if (!(await user.isValidPassword(password))) {
        return res.status(400).json({ message: "Invalid password" });
      }

      // Don't send password in response
      user.password = undefined;

      const token = jwt.sign({ id: user.Id }, jwtConfig.secret, {
        expiresIn: jwtConfig.expiresIn,
      });

      return res.json({ user, token });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  async registerUser(req, res) {
    try {
      const { username, password } = req.body;

      if (await User.findOne({ where: { Username: username } })) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = await User.create({
        Username: username,
        Password: password,
      });

      // Don't send password in response
      user.password = undefined;

      const token = jwt.sign({ id: user.Id }, jwtConfig.secret, {
        expiresIn: jwtConfig.expiresIn,
      });

      return res.status(201).json({ user, token });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  async getAllUsers(req, res) {
    try {
      const users = await User.findAll({
        attributes: ["Id", "Username"],
      });
      res.status(200).json({ users });
    } catch (error) {
      console.error("Failed to fetch users:", error);
      res.status(500).send("Internal Server Error");
    }
  },

  async updateUser(req, res) {
    try {
      const { id } = req.params;

      const { username, password, userTypeId } = req.body;

      //Find user by id
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // Update fields if provided
      if (username) user.Username = username;
      if (password) user.Password = password;
      if (userTypeId) user.UserTypeId = userTypeId;

      await user.save();

      return res.status(200).json({
        Id: user.Id,
        Username: user.Username,
        UserTypeId: user.UserTypeId,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  },

  async findOneUser(req, res) {
    try {
      const { id } = req.params;

      // Validate input
      if (!id) {
        return res.status(400).json({ message: "User ID is required." });
      }

      const user = await User.findByPk(id, {
        attributes: ["Id", "Username", "UserTypeId"], // Exclude sensitive information
      });

      res.status(200).json({ user });
    } catch (error) {
      console.error("Failed to fetch user:", error);
      res.status(500).send("Internal Server Error");
    }
  },

  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      // Validate input
      if (!id) {
        return res.status(400).json({ message: "User ID is required." });
      }

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      await user.destroy();

      return res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
      console.error("Failed to delete user:", error);
      res.status(500).send("Internal Server Error");
    }
  },

  async getAllUserTypes(req, res) {
    try {
      const userTypes = await UserType.findAll();
      if (!userTypes) {
        return res.status(404).json({ message: "No user types found." });
      }
      res.status(200).json(userTypes);
    } catch (error) {
      console.error("Failed to fetch UserTypes:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  },
};
