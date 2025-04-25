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
      const { email, password,username } = req.body;
      
      const user = await User.findOne({ where: { username } });
      
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
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

  async getAllUsers (req, res) {
    try {
      const users = await User.findAll({ attributes: ['id', 'username', 'email'] });
      res.status(200).json({ users });
    } catch (error) {
      console.error('Failed to fetch users:', error);
      res.status(500).send('Internal Server Error');
    }
  }
};
