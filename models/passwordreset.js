"use strict";

const { v4: uuidv4 } = require("uuid");

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PasswordReset extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PasswordReset.init(
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
      user_email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "Email cannot be null" },
          isEmail: { msg: "Email must be a valid email address" },
        },
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Token cannot be null" },
        },
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
      modelName: "PasswordReset",
    }
  );
  return PasswordReset;
};
