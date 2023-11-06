"use strict";

const { v4: uuidv4 } = require("uuid");

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Trade extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //one to many relationship between user and trade
      Trade.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
        targetKey: "id",
        sourceKey: "user_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      //one to many relationship between trade and comment
      Trade.hasMany(models.Comment, {
        foreignKey: "trade_id",
        as: "comments",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      //one to many relationship between tag and trade
      Trade.belongsToMany(models.Tag, {
        through: "TradeTag",
        as: "tags",
        foreignKey: "trade_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      //one to one relationship between trade and image
      Trade.hasMany(models.Image, {
        foreignKey: "trade_id",
        as: "image",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      //each trade can have many trade_details
      Trade.hasMany(models.TradeDetail, {
        foreignKey: "trade_id",
        as: "trade_details",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Trade.init(
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
      symbol: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Symbol cannot be null" },
          len: {
            args: [2, 5],
            msg: "Symbol must be between 2 and 5 characters",
          },
        },
      },
      status: {
        type: DataTypes.ENUM("open", "closed"),
        allowNull: false,
        defaultValue: "open",
        validate: {
          notNull: { msg: "Status cannot be null" },
        },
      },
      open_time: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
          notNull: { msg: "Open time cannot be null" },
        },
      },
      close_time: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      open_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      close_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "Users", key: "id" },
        validate: {
          notNull: { msg: "User ID cannot be null" },
        },
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: {
            args: [0, 2500],
            msg: "Notes must be less than 2500 characters",
          },
        },
      },
      profit_loss: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0,
        validate: {
          notNull: { msg: "Profit loss cannot be null" },
        },
      },
      open_price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0,
        validate: {
          notNull: { msg: "Open price cannot be null" },
        },
      },
      shares: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          notNull: { msg: "Shares owned cannot be null" },
        },
      },
    },
    {
      sequelize,
      hooks: {
        beforeCreate: (trade, options) => {
          trade.id = uuidv4();
        },
      },
      modelName: "Trade",
    }
  );
  return Trade;
};
