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
    await queryInterface.bulkInsert('Comments', [
      {
        id: 'c4e227d1-6019-4515-b91f-2c9d261f7e03',
        user_id: '3735a7f4-46e2-4726-811d-8ef4c5037bdf',
        trade_id: '14b85c32-9a4a-4299-8df8-733b30ccf1f9',
        comment_text: 'This is a comment',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '38470a21-7661-4559-b95b-48ee38d7aa33',
        user_id: '3735a7f4-46e2-4726-811d-8ef4c5037bdf',
        trade_id: '94f58a6c-7415-4754-b2fd-54e5dec5002c',
        comment_text: 'This is another comment',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '4798cfbc-5798-4f82-97a8-acbf6d615c9c',
        user_id: 'a41165da-1543-4dc2-a3a2-c14f11941683',
        trade_id: '66144caf-f15a-4b86-8ef2-227fcd1826cd',
        comment_text: 'This is a third comment',
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
      await queryInterface.bulkDelete('Comments', null, {});
  }
};
