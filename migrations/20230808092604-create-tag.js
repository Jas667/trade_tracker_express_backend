"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Tags", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      tag_name: {
        type: Sequelize.STRING,
        allowNull: false,
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
    await queryInterface.addIndex("Tags", ["user_id", "tag_name"], {
      unique: true,
      name: "tags_unique_user_id_tag_name",
    });
  },
  async down(queryInterface, Sequelize) {
    // await queryInterface.dropTable('Tags');
    // This is a destructive operation. It will remove all tables from the database. It is intended for development purposes only.
    await queryInterface.dropAllTables();
  },
};
