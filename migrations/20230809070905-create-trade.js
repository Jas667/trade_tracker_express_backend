"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Trades", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
      },
      symbol: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("open", "closed"),
        allowNull: false,
      },
      open_time: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      close_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      open_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      close_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      // tag_id: {
      //   type: Sequelize.UUID,
      //   allowNull: false,
      //   references: { model: "Tags", key: "id" },
      //   onUpdate: "CASCADE",
      //   onDelete: "CASCADE",
      // },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      profit_loss: {
        type: Sequelize.DECIMAL,
        allowNull: false,
        defaultValue: 0,
      },
      open_price: {
        type: Sequelize.DECIMAL,
        allowNull: false,
        defaultValue: 0,
      },
      shares: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
    // await queryInterface.dropTable('Trades');
    // This is a destructive operation. It will remove all tables from the database. It is intended for development purposes only.
    await queryInterface.dropAllTables();
  },
};
