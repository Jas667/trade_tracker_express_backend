"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("TradeDetails", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
      },
      trade_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "Trades", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      account: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      trade_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      settlement_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      side: {
        type: Sequelize.ENUM("B", "S"),
        allowNull: false,
      },
      symbol: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      execution_time: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      commission: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      sec: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      taf: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      nscc: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      nasdaq: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      ecn_remove: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      ecn_add: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      gross_proceeds: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      net_proceeds: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      clearing_broker: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      liquidity: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    // await queryInterface.dropTable('TradeDetails');
    // This is a destructive operation. It will remove all tables from the database. It is intended for development purposes only.
    await queryInterface.dropAllTables();
  },
};
