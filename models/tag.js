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
      indexes: [
        {
          unique: true,
          fields: ["user_id", "tag_name"],
          name: "user_id_tag_name_unique",
        },
      ],
    }
  );
  return Tag;
};
