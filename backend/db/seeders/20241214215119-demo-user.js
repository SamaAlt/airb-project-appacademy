'use strict';

const { User } = require('../models');
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('Seeding demo users...');
    await User.bulkCreate([
      {
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password'),
      },
      {
        email: 'user1@user.io',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password2'),
      },
      {
        email: 'user2@user.io',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password3'),
      },
    ]);
    console.log('Demo users seeded successfully');
  },

  async down(queryInterface, Sequelize) {
    console.log('Deleting demo users...');
    await queryInterface.bulkDelete('Users', null, {});
    console.log('Demo users deleted successfully');
  },
};
