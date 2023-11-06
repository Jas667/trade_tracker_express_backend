"use strict";

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
    await queryInterface.bulkInsert("TradeDetails", [
      {
        id: "971d4659-7b15-4e5f-8878-80dc97e1e0a8",
        trade_id: "94f58a6c-7415-4754-b2fd-54e5dec5002c",
        account: "RANDO1",
        trade_date: new Date(Date.now() - 24 * 60 * 60 * 1000),
        settlement_date: new Date(Date.now() - 24 * 60 * 60 * 1000),
        currency: "USD",
        type: 2,
        side: "B",
        symbol: "AAPL",
        quantity: 100,
        price: 234.1,
        execution_time: "06:26:14",
        commission: 2,
        sec: 0.02,
        taf: 0.04,
        nscc: 0.033,
        nasdaq: 0.00785,
        ecn_remove: 0,
        ecn_add: 0,
        gross_proceeds: -23410,
        clearing_broker: "LAMP",
        liquidity: "A",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "1f32ccff-9683-4ec7-8a0d-4003cb90268d",
        trade_id: "94f58a6c-7415-4754-b2fd-54e5dec5002c",
        account: "RANDO1",
        trade_date: new Date(Date.now() - 23 * 60 * 60 * 1000),
        settlement_date: new Date(Date.now() - 23 * 60 * 60 * 1000),
        currency: "USD",
        type: 2,
        side: "S",
        symbol: "AAPL",
        quantity: 100,
        price: 240,
        execution_time: "07:29:14",
        commission: 2,
        sec: 0.02,
        taf: 0.04,
        nscc: 0.033,
        nasdaq: 0.00785,
        ecn_remove: 0,
        ecn_add: 0,
        gross_proceeds: 24000,
        clearing_broker: "LAMP",
        liquidity: "A",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "00e8a1f0-b990-4ce9-963c-c7dc429207c7",
        trade_id: "14b85c32-9a4a-4299-8df8-733b30ccf1f9",
        account: "RANDO1",
        trade_date: new Date(Date.now() - 23 * 60 * 60 * 1000),
        settlement_date: new Date(Date.now() - 23 * 60 * 60 * 1000),
        currency: "USD",
        type: 2,
        side: "B",
        symbol: "TSLA",
        quantity: 100,
        price: 250,
        execution_time: "08:33:14",
        commission: 4,
        sec: 0.02,
        taf: 0.04,
        nscc: 0.033,
        nasdaq: 0.00885,
        ecn_remove: 0,
        ecn_add: 0,
        gross_proceeds: -25000,
        clearing_broker: "NSDQ",
        liquidity: "A",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "6dd954d7-d2cf-480f-bc6e-c966455c523a",
        trade_id: "14b85c32-9a4a-4299-8df8-733b30ccf1f9",
        account: "RANDO1",
        trade_date: new Date(Date.now() - 23 * 60 * 60 * 1000),
        settlement_date: new Date(Date.now() - 23 * 60 * 60 * 1000),
        currency: "USD",
        type: 2,
        side: "S",
        symbol: "TSLA",
        quantity: 100,
        price: 280,
        execution_time: "09:26:33",
        commission: 4,
        sec: 0.02,
        taf: 0.04,
        nscc: 0.033,
        nasdaq: 0.00885,
        ecn_remove: 0,
        ecn_add: 0,
        gross_proceeds: 28000,
        clearing_broker: "NSDQ",
        liquidity: "A",
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("TradeDetails", null, {});
  },
};
