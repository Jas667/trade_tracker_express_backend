'use strict';
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Users', [
      {
      id: '3735a7f4-46e2-4726-811d-8ef4c5037bdf',
      username: 'admin',
      password: '$2b$10$Hr47oFbm27xMXVFfb3F/w.nIeMnkgypRskx56SO.uwAUalQx607C.',
        email: 'james@email.com',
        first_name: 'James',
        last_name: 'Bond',
        profile_picture: 'https://images.pexels.com/photos/17041632/pexels-photo-17041632/free-photo-of-figure-of-skeleton-in-prisoner-uniform.jpeg',
      createdAt: new Date(),
      updatedAt: new Date()
      },
      {
        id: 'a41165da-1543-4dc2-a3a2-c14f11941683',
        username: 'test1',
        password: 'adminadmin',
        email: 'test1@email.com',
        first_name: 'Test',
        last_name: 'User',
        profile_picture: 'https://images.pexels.com/photos/17041632/pexels-photo-17041632/free-photo-of-figure-of-skeleton-in-prisoner-uniform.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '7d2ee91e-0a9e-4b27-b125-85f8c195f44a',
        username: 'test2',
        password: 'adminadmin',
        email: 'test2@email.com',
        first_name: 'Test2',
        last_name: 'User2',
        profile_picture: 'https://images.pexels.com/photos/17041632/pexels-photo-17041632/free-photo-of-figure-of-skeleton-in-prisoner-uniform.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
        },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
      await queryInterface.bulkDelete('Users', null, {});
  }
};
