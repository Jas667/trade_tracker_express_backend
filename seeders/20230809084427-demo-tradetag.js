'use strict';

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
    await queryInterface.bulkInsert('TradeTags', [
      {
        id: '43956132-6ae3-4f82-b117-438ff69f5954',
        tag_id: '13cf47f4-f3b8-42b4-8cb8-d7e977fc0c67',
        trade_id: '94f58a6c-7415-4754-b2fd-54e5dec5002c',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '011d2912-4c2e-4032-a4d8-4319ead6a0dc',
        tag_id: '3e59dbf4-370a-4b4a-94d5-f35197f7127b',
        trade_id: '66144caf-f15a-4b86-8ef2-227fcd1826cd',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'e3056f00-da37-4c8d-bffa-bd84e3d68801',
        tag_id: 'fd923a22-2de6-4155-8bba-3ea43e4a8f20',
        trade_id: '66144caf-f15a-4b86-8ef2-227fcd1826cd',
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
      await queryInterface.bulkDelete('TradeTags', null, {});
  }
};
