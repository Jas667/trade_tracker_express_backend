'use strict';
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Tags', [
      {
        id: '13cf47f4-f3b8-42b4-8cb8-d7e977fc0c67',
        user_id: '3735a7f4-46e2-4726-811d-8ef4c5037bdf',
        tag_name: 'tag1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'fd923a22-2de6-4155-8bba-3ea43e4a8f20',
        user_id: '3735a7f4-46e2-4726-811d-8ef4c5037bdf',
        tag_name: 'tag2',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3e59dbf4-370a-4b4a-94d5-f35197f7127b',
        user_id: 'a41165da-1543-4dc2-a3a2-c14f11941683',
        tag_name: 'tag3',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Tags', null, {});
  }
};
