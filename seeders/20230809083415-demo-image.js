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
    await queryInterface.bulkInsert('Images', [
      {
        id: '199a2666-f1e9-4506-93a1-4f08bc432666',
        trade_id: '94f58a6c-7415-4754-b2fd-54e5dec5002c',
        user_id: '3735a7f4-46e2-4726-811d-8ef4c5037bdf',
        image_url: 'https://i.imgur.com/1QZz9ZB.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '0de70710-6b44-4df9-a158-a8f1f91714e5',
        trade_id: '14b85c32-9a4a-4299-8df8-733b30ccf1f9',
        user_id: '3735a7f4-46e2-4726-811d-8ef4c5037bdf',
        image_url: 'https://i.imgur.com/1QZz9ZB.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '436827a3-1eee-4c47-9309-9d0752eb005a',
        trade_id: '94f58a6c-7415-4754-b2fd-54e5dec5002c',
        user_id: '3735a7f4-46e2-4726-811d-8ef4c5037bdf',
        image_url: 'https://i.imgur.com/1QZz9ZB.jpeg',
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
      await queryInterface.bulkDelete('Images', null, {});
  }
};
