'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Hash the password with 10 salt rounds
    const hashedPassword = bcrypt.hashSync('admin', 10);
    
    await queryInterface.bulkInsert('Users', [{
      id: 1,
      username: 'admin',
      password: hashedPassword,
      userTypeId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', { id: 1 }, {});
  }
};
