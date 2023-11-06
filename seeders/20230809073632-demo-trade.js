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
    await queryInterface.bulkInsert('Trades', [
      {
        id: '94f58a6c-7415-4754-b2fd-54e5dec5002c',
        symbol: 'AAPL',
        status: 'closed',
        open_time: new Date(Date.now() - 24 * 60 * 60 * 1000),
        close_time: new Date(Date.now() - 23 * 60 * 60 * 1000),
        open_date: new Date(Date.now() - 24 * 60 * 60 * 1000),
        user_id: '3735a7f4-46e2-4726-811d-8ef4c5037bdf',
        notes: 'This is a note',
        open_price: 234.1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '14b85c32-9a4a-4299-8df8-733b30ccf1f9',
        symbol: 'TSLA',
        status: 'closed',
        open_time: new Date(Date.now() - 23 * 60 * 60 * 1000),
        close_time: new Date(Date.now() - 21 * 60 * 60 * 1000),
        open_date: new Date(Date.now() - 24 * 60 * 60 * 1000),
        close_date: new Date(Date.now() - 23 * 60 * 60 * 1000),
        user_id: '3735a7f4-46e2-4726-811d-8ef4c5037bdf',
        notes: 'This is a second note',
        open_price: 250.1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '66144caf-f15a-4b86-8ef2-227fcd1826cd',
        symbol: 'AAPL',
        status: 'closed',
        open_time: new Date(),
        close_time: new Date(Date.now() + 300 * 1000),
        open_date: new Date(Date.now() - 24 * 60 * 60 * 1000),
        close_date: new Date(Date.now() - 23 * 60 * 60 * 1000),
        user_id: 'a41165da-1543-4dc2-a3a2-c14f11941683',
        notes: 'This is a third note',
        open_price: 266.51,
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
      await queryInterface.bulkDelete('Trades', null, {});
  }
};
