'use strict';

const { v4: uuidv4 } = require("uuid");

const {
  Model
} = require('sequelize');
const trade = require('./trade');
module.exports = (sequelize, DataTypes) => {
  class TradeTag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TradeTag.belongsTo(models.Trade, {
        foreignKey: 'trade_id',
        targetKey: 'id',
        sourceKey: 'trade_id',
        as: 'trade',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      TradeTag.belongsTo(models.Tag, {
        foreignKey: 'tag_id',
        targetKey: 'id',
        sourceKey: 'tag_id',
        as: 'tag',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  TradeTag.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    tag_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Tags', key: 'id' },
    },
    trade_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Trades', key: 'id' },
    },
  },
  {
    sequelize,
    hooks: {
      beforeCreate: (tradeTag, options) => { 
        tradeTag.id = uuidv4();
      }
    },
  modelName: 'TradeTag',
});
  return TradeTag;
};