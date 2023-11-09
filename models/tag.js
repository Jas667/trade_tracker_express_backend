"use strict";

const { v4: uuidv4 } = require("uuid");

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Tag.belongsToMany(models.Trade, {
        through: "TradeTag",
        as: "trades",
        foreignKey: "tag_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Tag.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
        targetKey: "id",
        sourceKey: "user_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Tag.init(
    {
      id: {
        primaryKey: true,
        unique: true,
        type: DataTypes.UUID,
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
      tag_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "Tag name cannot be null" },
          len: {
            args: [3, 40],
            msg: "Tag name must be between 3 and 40 characters",
          },
        },
      },
    },
    {
      sequelize,
      hooks: {
        beforeCreate: (user, options) => {
          user.id = uuidv4();
        },
      },
      modelName: "Tag",
    }
  );
  return Tag;
};
