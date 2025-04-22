const jwt = require('jsonwebtoken');
const { User } = require('../models');
const jwtConfig = require('../config/jwt');

module.exports = {
  async register(req, res) {
    try {
      const { username, email, password } = req.body;

      console.log('[register] hi', {username, email, password});
      
      
      if (await User.findOne({ where: { email } })) {
        return res.status(400).json({ message: 'User already exists' });
      }
      
      const user = await User.create({ username, email, password });
      
      // Don't send password in response
      user.password = undefined;
      
      const token = jwt.sign({ id: user.id }, jwtConfig.secret, {
        expiresIn: jwtConfig.expiresIn,
      });
      
      return res.status(201).json({ user, token });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      const user = await User.findOne({ where: { email } });
      
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
      
      if (!(await user.isValidPassword(password))) {
        return res.status(400).json({ message: 'Invalid password' });
      }
      
      // Don't send password in response
      user.password = undefined;
      
      const token = jwt.sign({ id: user.id }, jwtConfig.secret, {
        expiresIn: jwtConfig.expiresIn,
      });
      
      return res.json({ user, token });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
};