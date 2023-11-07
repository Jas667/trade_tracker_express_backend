const TradeDetail = require("../models").TradeDetail;
const Trade = require("../models").Trade;
const User = require("../models").User;
const XLSX = require("xlsx");
const { deleteFile } = require("../utils/fileUtils");
const { serialToDate } = require("../utils/toDateUtils");
const { parse } = require("dotenv");
const path = require("path");
const fs = require("fs");

const {
  createTradeDetail,
  findExistingTradeDetail,
  createNewTrade,
  findATrade,
  findTradeDetailsById,
  findTradeLinkedToTradeDetails,
  findAllTradeDetailsAssociatedWithTrade,
} = require("./tradeZeroControllers/tradeZeroTradeDetailHelpers");
const {
  roundToMaximumSixDecimals,
  filterBlankRowsAndRowsOfCommas,
  arrangeDataByDateAndExecutionTime,
  workOutInitialProfitAndLoss,
  updateProfitAndLossAndShareSize,
} = require("./tradeZeroControllers/tradeZeroUtils");

const { AppError } = require("../utils/errorHandler");

const {
  send201Created,
  send200Ok,
  send204Deleted,
} = require("../utils/responses");
const { PassThrough } = require("stream");

module.exports = {
  async getAllUsersTradeDetails(req, res, next) {
    try {
      const tradeDetails = await TradeDetail.findAll({
        include: [
          {
            model: Trade,
            as: "trade",
            where: { user_id: req.userId },
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      if (!tradeDetails) {
        return next(new AppError("No trade details found", 400));
      }
      return send200Ok(res, "Trade Details Found", { tradeDetails });
    } catch (e) {
      return res.status(500).send({
        message: "Error Occured",
      });
    }
  },
  async getTradeDetailsByTradeId(req, res, next) {
    // store user id to be used in identifying trade
    const userId = req.userId;

    // store trade id to be used in identifying trade
    const tradeId = req.params.id;

    try {
      const tradeWithDetails = await Trade.findOne({
        where: { user_id: userId, id: tradeId },
        include: [
          {
            model: TradeDetail,
            as: "trade_details",
            order: [["execution_time", "ASC"]],
          },
        ],
      });

      if (!tradeWithDetails) {
        return next(new AppError("No trade details found", 400));
      }

      return send200Ok(res, "Trade Details Found", { tradeWithDetails });
    } catch (e) {
      return res.status(500).send({
        message: "Error Occurred",
      });
    }
  },
  async addTradeDetailsFromExcel(req, res, next) {
    //if no file is uploaded, return error
    if (!req.file) {
      return next(new AppError("No file uploaded", 400));
    }
    //saved file path
    const filePath = req.file.path;

    try {
      const extname = path.extname(filePath); // This gives you the file extension, e.g., '.csv' or '.xlsx'

      let data;
      let workbook;
      let sheetNames;
      let sheet;

      if (extname === ".csv") {
        // read and process the excel data to extrade trade details
        workbook = XLSX.readFile(filePath);
        sheetNames = workbook.SheetNames;
        sheet = workbook.Sheets[sheetNames[0]];
        data = XLSX.utils.sheet_to_json(sheet);
      } else {
        deleteFile(filePath);
        return next(
          new AppError("Invalid file type. Please upload in .csv", 400)
        );
      }

      //This will filter out empty rows and rows full of commas, which were previously causing errors
      filterBlankRowsAndRowsOfCommas(data);

      //if data is empty, return error
      if (data.length === 0) {
        return next(new AppError("No data found in uploaded file", 400));
      }
      //convert excel date to js date
      data.forEach((row) => {
        if (row["T/D"]) {
          row["T/D"] = serialToDate(row["T/D"]);
        }
        if (row["S/D"]) {
          row["S/D"] = serialToDate(row["S/D"]);
        }
        //round necessary columns to 5 decimal places
        if (row["Price"]) {
          row["Price"] = roundToMaximumSixDecimals(row["Price"]);
        }
        if (row["Nasdaq"]) {
          row["Nasdaq"] = roundToMaximumSixDecimals(row["Nasdaq"]);
        }
        if (row["Gross Proceeds"]) {
          row["Gross Proceeds"] = roundToMaximumSixDecimals(
            row["Gross Proceeds"]
          );
        }
        if (row["Net Proceeds"]) {
          row["Net Proceeds"] = roundToMaximumSixDecimals(row["Net Proceeds"]);
        }
      });
      arrangeDataByDateAndExecutionTime(data);

      const transaction = await Trade.sequelize.transaction();

      try {
        for (let row of data) {
          // Check if trade detail already exists
          const existingTradeDetail = await findExistingTradeDetail(
            row,
            transaction
          );
          // If trade detail already exists, skip it
          if (existingTradeDetail) {
            continue;
          }
          //store user id to be used in creating trade
          const userId = req.userId;

          // Check if trade exists. If it doesn't, create it. If it does, update it.
          let trade = await findATrade(userId, row, transaction);

          if (!trade) {
            //math to work out initial profit and loss
            const initialProfitAndLoss = workOutInitialProfitAndLoss(row);
            //create the trade
            trade = await createNewTrade(
              row,
              userId,
              initialProfitAndLoss,
              transaction
            );

            //Now, create the trade detail
            await createTradeDetail(row, trade.id, transaction);
          } else {
            // Update the trade's profit/loss
            const updatedProfitAndLossAndShareSize =
              updateProfitAndLossAndShareSize(row, trade);

            // Update the trade with the new data
            await trade.update(updatedProfitAndLossAndShareSize, {
              transaction,
            });

            //Now, create the trade detail
            await createTradeDetail(row, trade.id, transaction);
          }
        }

        await transaction.commit();
      } catch (e) {
        await transaction.rollback();
        deleteFile(filePath);
        return next(new AppError("Error processing file", 500));
      }

      deleteFile(filePath);
      return send201Created(res, "File uploaded successfully");
    } catch (e) {
      deleteFile(filePath);
      return next(new AppError("Error processing file. Server Error.", 500));
    }
  },
  async editTradeDetails(req, res, next) {
    //store user id to be used in identifying trade
    const userId = req.userId;

    //store tradedetails id to be used in identifying tradedetails
    const tradeDetailsId = req.params.id;

    //start a transaction to ensure that if any part of the update fails, the whole update fails
    const transaction = await Trade.sequelize.transaction();

    try {
      //find the trade details to be updated
      const tradeDetails = await findTradeDetailsById(
        tradeDetailsId,
        transaction
      );

      //if trade details not found, return error
      if (!tradeDetails) {
        await transaction.rollback();
        return next(new AppError("Trade Details not found", 400));
      }
      //update tradedetails with data supplied in the req.body
      const updateFields = [
        "quantity",
        "price",
        "notes",
        "net_proceeds",
      ].filter((field) => req.body[field] !== undefined);

      // If only the 'notes' field is updated, save and exit the function
      if (updateFields.length === 1 && updateFields[0] === "notes") {
        tradeDetails.notes = req.body.notes;
        await tradeDetails.save({ transaction });
        await transaction.commit();
        return send200Ok(res, "Trade details updated");
      }

      for (let field of updateFields) {
        tradeDetails[field] = req.body[field];
      }
      await tradeDetails.save({ transaction });

      //find the trade associated with the trade details
      const trade = await findTradeLinkedToTradeDetails(
        tradeDetails,
        transaction
      );

      if (!trade || trade.user_id !== userId) {
        await transaction.rollback();
        return next(new AppError("Unauthorized access", 403));
      }

      //fetch all of the tradedetails that are associated with the trade so that we can update the trade where required
      const linkedTradeDetails = await findAllTradeDetailsAssociatedWithTrade(
        tradeDetails,
        transaction
      );

      //sort the linked trade details by execution time and trade date so that we can set the close time to the latest execution time and close date if necessary
      linkedTradeDetails.sort((a, b) => {
        const datetimeA = new Date(
          a.trade_date.toISOString().split("T")[0] +
            "T" +
            a.execution_time +
            "Z"
        );
        const datetimeB = new Date(
          b.trade_date.toISOString().split("T")[0] +
            "T" +
            b.execution_time +
            "Z"
        );

        if (datetimeA > datetimeB) return -1;
        if (datetimeA < datetimeB) return 1;

        return 0;
      });

      // 1. Update Trade net profit/loss if 'net_proceeds' has been updated
      if (updateFields.includes("net_proceeds")) {
        const totalNetProceeds = linkedTradeDetails.reduce(
          (sum, detail) => sum + Number(detail.net_proceeds),
          0
        );

        trade.profit_loss = totalNetProceeds.toFixed(2);
      }

      // 2. Update Trade status if 'quantity' has changed
      if (updateFields.includes("quantity")) {
        const netQuantity = linkedTradeDetails.reduce((sum, detail) => {
          if (detail.side === "B") return sum + detail.quantity;
          if (detail.side === "S") return sum - detail.quantity;
          return sum;
        }, 0);

        trade.status = netQuantity === 0 ? "closed" : "open";
        trade.shares = netQuantity;

        //if trade is now open, set close_time and date to null. // Else if netQuantity is 0, set close_time and date to the most recent execution_time
        if (netQuantity !== 0) {
          trade.close_time = null;
          trade.close_date = null;
        } else if (netQuantity === 0 && linkedTradeDetails.length > 0) {
          trade.close_time = linkedTradeDetails[0].execution_time;
          trade.close_date = linkedTradeDetails[0].trade_date;
        }
      }

      await trade.save({ transaction });
      await transaction.commit();
      return send200Ok(res, "Trade details updated");
    } catch (e) {
      await transaction.rollback();

      return next(new AppError("Error updating trade details", 500));
    }
  },
  async deleteTradeDetails(req, res, next) {
    //store user id to be used in identifying trade
    const userId = req.userId;

    //store tradedetails id to be used in identifying tradedetails
    const tradeDetailsId = req.params.id;

    //start a transaction to ensure that if any part of the update fails, the whole update fails
    const transaction = await Trade.sequelize.transaction();

    try {
      //find the trade details to be deleted
      const tradeDetails = await findTradeDetailsById(
        tradeDetailsId,
        transaction
      );

      //if trade details not found, return error
      if (!tradeDetails) {
        await transaction.rollback();
        return next(new AppError("Trade Details not found", 400));
      }

      //find the trade associated with the trade details
      const associatedTrade = await findTradeLinkedToTradeDetails(
        tradeDetails,
        transaction
      );

      if (associatedTrade.user_id !== userId) {
        await transaction.rollback();
        return next(new AppError("Unauthorized access", 403));
      }

      //carry out logic to update the trade associated with the trade details before deleting the trade details
      //update shares owned by the trade
      if (tradeDetails.side === "B") {
        associatedTrade.shares -= tradeDetails.quantity;
      } else {
        associatedTrade.shares += tradeDetails.quantity;
      }

      //update profit/loss of the trade
      associatedTrade.profit_loss -= Number(tradeDetails.net_proceeds).toFixed(
        2
      );

      //check if new trade shares is no longer 0, if it is, update trade status to open and change close_time to null
      if (associatedTrade.shares !== 0) {
        associatedTrade.status = "open";
        associatedTrade.close_time = null;
        associatedTrade.close_date = null;
      }

      await associatedTrade.save({ transaction });
      await tradeDetails.destroy({ transaction });
      await transaction.commit();
      return send204Deleted(res);
    } catch (e) {
      await transaction.rollback();

      return next(new AppError("Error deleting trade details", 500));
    }
  },
};
