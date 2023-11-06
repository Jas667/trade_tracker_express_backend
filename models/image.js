"use strict";

const { v4: uuidv4 } = require("uuid");

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Image.belongsTo(models.Trade, {
        foreignKey: "trade_id",
        targetKey: "id",
        sourceKey: "trade_id",
        as: "trade",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Image.belongsTo(models.User, {
        foreignKey: "user_id",
        targetKey: "id",
        sourceKey: "user_id",
        as: "user",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Image.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
          notNull: { msg: "ID cannot be null" },
        },
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "Users", key: "id" },
        validate: {
          notNull: { msg: "User ID cannot be null" },
        },
      },
      trade_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "Trades", key: "id" },
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Image location cannot be null" },
        },
      },
    },
    {
      sequelize,
      hooks: {
        beforeCreate: (image, options) => {
          image.id = uuidv4();
        },
      },
      modelName: "Image",
    }
  );
  return Image;
};
