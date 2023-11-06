"use strict";

const { v4: uuidv4 } = require("uuid");

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RefreshTokens extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      RefreshTokens.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
        targetKey: "id",
        sourceKey: "user_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  RefreshTokens.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
          notNull: { msg: "ID cannot be null" },
        }
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "Users", key: "id" },
        validate: {
          notNull: { msg: "User ID cannot be null" },
        },
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Token cannot be null" },
        }
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: "Expires at cannot be null" },
        },
      },
    },
    {
      sequelize,
      hooks: {
        beforeCreate: (refreshToken) => {
          refreshToken.id = uuidv4();
        },
      },
      modelName: "RefreshTokens",
    }
  );
  return RefreshTokens;
};
