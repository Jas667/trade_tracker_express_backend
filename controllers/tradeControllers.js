// const sequelize = require("sequelize");
const { Sequelize, sequelize } = require("../models");
const Trade = require("../models").Trade;
const TradeDetail = require("../models").TradeDetail;
const { Op } = require("sequelize");
const {
  send201Created,
  send200Ok,
  send204Deleted,
} = require("../utils/responses");

const { AppError } = require("../utils/errorHandler");

module.exports = {
  async getUsersTrades(req, res, next) {
    try {
      const trades = await Trade.findAll({
        where: {
          user_id: req.userId,
        },
        order: [["open_time", "DESC"]],
      });
      if (!trades) {
        return next(new AppError("No trades found", 400));
      }
      return send200Ok(res, "Trades found", { trades: trades });
    } catch (e) {
      return next(new AppError("Error getting trades", 500));
    }
  },
  async getTradesInDateRange(req, res, next) {
    try {
      const startDate = req.query.startDate;

      const endDate = req.query.endDate;

      const trades = await Trade.findAll({
        where: {
          user_id: req.userId,
          open_date: {
            [Op.between]: [startDate, endDate],
          },
        },
        attributes: [
          "id",
          "symbol",
          "status",
          "open_time",
          "close_time",
          "open_date",
          "close_date",
          "notes",
          "profit_loss",
          "open_price",
          //work out total shares for the trade
          [
            sequelize.fn("SUM", sequelize.col("trade_details.quantity")),
            "total_shares_traded",
          ],
          //work out total commission for the trade
          [
            sequelize.fn("SUM", sequelize.col("trade_details.commission")),
            "total_commission",
          ],
          //work out groww p/l for the trade
          [
            sequelize.fn("SUM", sequelize.col("trade_details.gross_proceeds")),
            "gross_profit_loss",
          ],
          //work out total fees for trade
          [
            sequelize.literal(
              "SUM(trade_details.sec + trade_details.taf + trade_details.nscc + trade_details.nasdaq)"
            ),
            "total_fees",
          ],
        ],
        include: [
          {
            model: TradeDetail,
            as: "trade_details",
            attributes: [], // Keep empty because we are getting everything required in the aggregate functions above
          },
        ],
        group: ["Trade.id", "trade_details.trade_id"], // Group by trade id to get aggregates for each trade
        order: [
          ["open_date", "ASC"],
          ["open_time", "ASC"],
        ],
      });
      if (!trades) {
        return next(new AppError("No trades found", 400));
      }
      return send200Ok(res, "Trades found", { trades: trades });
    } catch (e) {
      return next(new AppError("Error getting trades", 500));
    }
  },
  async addTrade(req, res, next) {
    const userId = req.userId;

    try {
      const {
        symbol = "",
        status = "",
        open_time = "",
        close_time = "",
        notes = "",
        profit_loss = 0.0,
        open_date = "",
        close_date = "",
        shares = 0,
      } = req.body;

      //validator
      if (
        !symbol ||
        !status ||
        !open_time ||
        !close_time ||
        !profit_loss ||
        !open_date
      ) {
        return next(new AppError("Missing fields", 400));
      }

      if (typeof symbol !== "string" || typeof notes !== "string") {
        return next(new AppError("Invalid fields", 400));
      }

      if (!["open", "closed"].includes(status)) {
        return next(new AppError("Invalid status value", 400));
      }

      // const isValidTimestamp = (timestamp) => {
      //   const date = new Date(timestamp);
      //   return date instanceof Date && !isNaN(date);
      // };

      // if (!isValidTimestamp(open_time) || !isValidTimestamp(close_time)) {
      //   return next(new AppError("Invalid timestamp value", 400));
      // }

      // Validate time format
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
      if (!timeRegex.test(open_time) || !timeRegex.test(close_time)) {
        return next(
          new AppError("Invalid time format. Expected HH:MM:SS", 400)
        );
      }

      if (typeof profit_loss !== "number" || isNaN(profit_loss)) {
        return next(new AppError("Profit/loss should be numeric", 400));
      }
      // Validate shares
      if (typeof shares !== "number" || isNaN(shares)) {
        return next(new AppError("Shares should be an integer", 400));
      }

      // Validate open_date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(open_date)) {
        return next(
          new AppError("Invalid open_date format. Expected YYYY-MM-DD", 400)
        );
      }

      // Handle close_date
      if (!close_date || close_date.trim() === "") {
        close_date = null; // Set close_date to null if it's blank
      } else if (!dateRegex.test(close_date)) {
        return next(
          new AppError("Invalid close_date format. Expected YYYY-MM-DD", 400)
        );
      }

      const trade = await Trade.create({
        symbol,
        status,
        open_time,
        close_time,
        user_id: userId,
        notes,
        profit_loss,
        open_date,
        close_date,
        shares,
      });
      return send201Created(res, "Trade added", { trade: trade });
    } catch (e) {
      return next(new AppError("Error adding trade", 500));
    }
  },
  async updateTrade(req, res, next) {
    const userId = req.userId;
    const tradeId = req.params.id;

    try {
      const { notes } = req.body;
      const trade = await Trade.findOne({
        where: {
          id: tradeId,
          user_id: userId,
        },
      });
      if (!trade) {
        return next(new AppError("Trade not found", 400));
      }
      await trade.update({
        notes,
      });
      return send200Ok(res, "Trade updated");
    } catch (e) {
      return next(new AppError("Error updating trade", 500));
    }
  },
  async deleteTrade(req, res, next) {
    const userId = req.userId;
    const tradeId = req.params.id;

    try {
      const trade = await Trade.findOne({
        where: {
          id: tradeId,
          user_id: userId,
        },
      });
      if (!trade) {
        return next(new AppError("Trade not found", 400));
      }
      await trade.destroy();
      return send204Deleted(res);
    } catch (e) {
      return next(new AppError("Error deleting trade", 500));
    }
  },
};
