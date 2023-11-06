"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //one user can have many comments
      User.hasMany(models.Comment, {
        foreignKey: "user_id",
        as: "comments",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      User.hasMany(models.Image, {
        foreignKey: "user_id",
        as: "images",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      User.hasMany(models.Tag, {
        foreignKey: "user_id",
        as: "tags",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  User.init(
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
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "Username cannot be null" },
          len: {
            args: [3, 20],
            msg: "Username must be between 3 and 20 characters",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Password cannot be null" },
          len: {
            args: [8],
            msg: "Password must be at least 8 characters",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "Email cannot be null" },
          isEmail: { msg: "Email must be a valid email address" },
        },
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "First name cannot be null" },
        },
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Last name cannot be null" },
        },
      },
      profile_picture: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl: { msg: "Profile picture must be a valid URL" },
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

      modelName: "User",
    }
  );
  return User;
};
