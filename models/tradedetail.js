"use strict";

const { v4: uuidv4 } = require("uuid");

// //function to work out the net proceeds
// function CalculateNetProceeds(tradeDetail) {
//   tradeDetail.net_proceeds =
//     tradeDetail.gross_proceeds -
//     tradeDetail.commission -
//     tradeDetail.sec -
//     tradeDetail.taf -
//     tradeDetail.nscc -
//     tradeDetail.nasdaq -
//     tradeDetail.ecn_remove +
//     tradeDetail.ecn_add;
// }

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TradeDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //each trade detail belongs to one trade
      TradeDetail.belongsTo(models.Trade, {
        foreignKey: "trade_id",
        targetKey: "id",
        sourceKey: "trade_id",
        as: "trade",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  TradeDetail.init(
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
      trade_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "Trades", key: "id" },
        validate: {
          notNull: { msg: "Trade ID cannot be null" },
        },
      },
      account: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      trade_date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: "Trade date cannot be null" },
        },
      },
      settlement_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Currency cannot be null" },
          len: {
            args: [3, 3],
          },
        },
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Type cannot be null" },
        },
      },
      side: {
        type: DataTypes.ENUM("B", "S"),
        allowNull: false,
        validate: {
          notNull: { msg: "Side cannot be null" },
        },
      },
      symbol: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Symbol cannot be null" },
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Quantity cannot be null" },
        },
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          notNull: { msg: "Price cannot be null" },
        },
      },
      execution_time: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
          notNull: { msg: "Execution time cannot be null" },
        },
      },
      commission: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        defaultValue: 0.0,
      },
      sec: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        defaultValue: 0.0,
      },
      taf: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        defaultValue: 0.0,
      },
      nscc: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        defaultValue: 0.0,
      },
      nasdaq: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        defaultValue: 0.0,
      },
      ecn_remove: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        defaultValue: 0.0,
      },
      ecn_add: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        defaultValue: 0.0,
      },
      gross_proceeds: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        defaultValue: 0.0,
      },
      net_proceeds: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        defaultValue: 0.0,
      },
      clearing_broker: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      liquidity: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      hooks: {
        beforeCreate: (tradeDetail, options) => {
          tradeDetail.id = uuidv4();
          // CalculateNetProceeds(tradeDetail);
        },
        // beforeUpdate: (tradeDetail, options) => {
        //   CalculateNetProceeds(tradeDetail);
        // },
      },
      modelName: "TradeDetail",
    }
  );
  return TradeDetail;
};
