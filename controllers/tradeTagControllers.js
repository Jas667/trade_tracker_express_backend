const Trade = require("../models").Trade;
const Tag = require("../models").Tag;
const TradeTag = require("../models").TradeTag;
const { Op } = require("sequelize");
const sequelize = require("sequelize");
const TradeDetail = require("../models").TradeDetail;

const { AppError } = require("../utils/errorHandler");

const { send200Ok, send204Deleted } = require("../utils/responses");

module.exports = {
  async getAllUserTagsForTrade(req, res, next) {
    try {
      const tradeTags = await Trade.findByPk(req.tradeId, {
        include: [
          {
            model: Tag,
            as: "tags",
            through: {
              model: TradeTag,
              attributes: [],
            },
            attributes: ["id", "tag_name"],
          },
        ],
      });

      if (!tradeTags) {
        return next(new AppError("Trade not found", 400));
      }

      if (tradeTags.tags.length === 0) {
        return next(new AppError("Trade does not have any tags", 400));
      }

      if (tradeTags.user_id !== req.userId) {
        return next(new AppError("User cannot view tags for this trade", 403));
      }

      return send200Ok(res, "Tags found", { tags: tradeTags.tags });
    } catch (e) {
      return next(new AppError("Error getting tags", 500));
    }
  },
  async getTradesWithAssociatedTags(req, res, next) {
    try {
      const tagIds = req.body.tagIds;
      const onlyWithAllTags = req.body.onlyWithAllTags;
      const startDate = req.body.startDate;
      const endDate = req.body.endDate;

      // Additional attributes for aggregate calculations
      const additionalAttributes = [
        [
          sequelize.fn("SUM", sequelize.col("trade_details.quantity")),
          "total_shares_traded",
        ],
        [
          sequelize.fn("SUM", sequelize.col("trade_details.commission")),
          "total_commission",
        ],
        [
          sequelize.fn("SUM", sequelize.col("trade_details.gross_proceeds")),
          "gross_profit_loss",
        ],
        [
          sequelize.literal(
            "SUM(trade_details.sec + trade_details.taf + trade_details.nscc + trade_details.nasdaq)"
          ),
          "total_fees",
        ],
      ];

      let trades;

      const tagFilter = tagIds.length > 0 ? { where: { id: tagIds } } : {};

      const tradeQueryOptions = {
        include: [
          {
            model: TradeDetail,
            as: "trade_details",
            attributes: [], // Exclude attributes, because they are added in aggregate calculations
          },
          {
            model: Tag,
            as: "tags",
            ...tagFilter,
            attributes: ["id", "tag_name"],
            through: {
              attributes: [], // Exclude join table attributes
            },
          },
        ],
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
          ...additionalAttributes,
        ],
        group: ["Trade.id", "trade_details.trade_id", "tags.id"], // Group by trade id to get aggregates for each trade
        order: [
          ["open_date", "ASC"],
          ["open_time", "ASC"],
        ],
      };

      if (startDate && endDate && startDate !== "" && endDate !== "") {
        if (isNaN(Date.parse(startDate)) || isNaN(Date.parse(endDate))) {
          return next(new AppError("Invalid startDate or endDate", 400));
        }
        trades = await Trade.findAll({
          ...tradeQueryOptions,
          where: {
            open_date: {
              [Op.between]: [startDate, endDate],
            },
          },
        });
      } else {
        trades = await Trade.findAll(tradeQueryOptions);
      }

      if (!trades) {
        return next(new AppError("Trades not found", 400));
      }

      if (trades.length === 0) {
        return next(
          new AppError("No trades found for the specified criteria", 400)
        );
      }

      if (onlyWithAllTags) {
        // Filter trades that have all tags
        const tradesWithAllTags = trades.filter((trade) => {
          const tradeTagIds = trade.tags.map((tag) => tag.id);
          return tagIds.every((tagId) => tradeTagIds.includes(tagId));
        });

        if (tradesWithAllTags.length === 0) {
          return next(new AppError("No trades found with all tags", 400));
        }

        return send200Ok(res, "Trades found", { trades: tradesWithAllTags });
      }

      return send200Ok(res, "Trades found", { trades });
    } catch (e) {
      console.log(e);
      return next(new AppError("Error getting trades", 500));
    }
  },

  async addATagToTrade(req, res, next) {
    const tagsToAdd = req.body.tagIds;

    //check if tagsToAdd is empty
    if (!Array.isArray(tagsToAdd) || tagsToAdd.length === 0) {
      return next(
        new AppError("Tags to add cannot be empty or not an array", 400)
      );
    }
    //create a squelize transaction. This will allow for many tags to be added at once
    const transaction = await TradeTag.sequelize.transaction();
    try {
      for (let i = 0; i < tagsToAdd.length; i++) {
        //find or create a tradetag entry for each trade and tag
        const [tradeTag, created] = await TradeTag.findOrCreate({
          where: {
            trade_id: req.tradeId,
            tag_id: tagsToAdd[i],
          },
          defaults: {
            trade_id: req.trade,
            tag_id: tagsToAdd[i],
          },
          transaction: transaction,
        });
        if (!created) {
          await transaction.rollback();
          return next(
            new AppError(
              `Tag with id: '${tagsToAdd[i]}' already exists for this trade`,
              400
            )
          );
        }
      }
      await transaction.commit();
      return send200Ok(res, "Tag added to trade");
    } catch (e) {
      await transaction.rollback();
      return next(new AppError("Error adding tag to trade", 500));
    }
  },
  async removeTagsFromATrade(req, res, next) {
    const tagsToRemove = req.body.tagIds;

    //check if tagsToRemove is empty
    if (!Array.isArray(tagsToRemove) || tagsToRemove.length === 0) {
      return next(
        new AppError("Tag to remove cannot be empty or not an array", 400)
      );
    }
    //create a squelize transaction. This will allow for many tags to be deleted at once
    const transaction = await TradeTag.sequelize.transaction();
    try {
      for (let tagId of tagsToRemove) {
        //find tradeTag entry for the trade and tag
        const tradeTag = await TradeTag.findOne({
          where: {
            trade_id: req.tradeId,
            tag_id: tagId,
          },
        });

        if (!tradeTag) {
          await transaction.rollback();
          return next(
            new AppError(
              `Tag with ID ${tagId} does not exist for this trade`,
              400
            )
          );
        }

        //delete tradeTag entry
        await tradeTag.destroy({ transaction });
      }
      await transaction.commit();
      return send204Deleted(res);
    } catch (e) {
      await transaction.rollback();
      return next(new AppError("Error removing tag from trade", 500));
    }
  },
};
