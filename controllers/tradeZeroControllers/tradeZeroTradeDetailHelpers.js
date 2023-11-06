const TradeDetail = require("../../models").TradeDetail;
const Trade = require("../../models").Trade;

module.exports = {
  async createTradeDetail(row, tradeId, transaction) {
    return await TradeDetail.create(
      {
        account: row["Account"],
        trade_date: row["T/D"],
        settlement_date: row["S/D"],
        currency: row["Currency"],
        type: row["Type"],
        side: row["Side"],
        symbol: row["Symbol"],
        quantity: row["Qty"],
        price: row["Price"],
        execution_time: row["Exec Time"],
        commission: row["Comm"],
        sec: row["SEC"],
        taf: row["TAF"],
        nscc: row["NSCC"],
        nasdaq: row["Nasdaq"],
        ecn_removed: row["ECN Removed"],
        ecn_add: row["ECN Add"],
        gross_proceeds: row["Gross Proceeds"],
        net_proceeds: row["Net Proceeds"],
        clearing_broker: row["Clr Broker"],
        liquidity: String(row["Liq"]),
        trade_id: tradeId,
      },
      { transaction }
    );
  },
  async createNewTrade(row, userId, initialProfitAndLoss, transaction) {
    return await Trade.create(
      {
        symbol: row["Symbol"],
        status: "open",
        open_time: row["Exec Time"],
        user_id: userId,
        shares: Number(row["Qty"]),
        open_date: row["T/D"],
        profit_loss: parseFloat(initialProfitAndLoss.toFixed(2)),
        open_price: row["Price"],
      },
      { transaction }
    );
  },
  async findATrade(userId, row, transaction) { 
    return await Trade.findOne({
      where: {
        user_id: userId,
        symbol: row["Symbol"],
        status: "open",
      },
      transaction,
    });
  },
  async findExistingTradeDetail(row, transaction) {
    //format date to ISO string
    const [year, month, day] = row["T/D"].split("-");
    const jsDate = new Date(`${year}-${month}-${day}`);
    const formattedDate = jsDate.toISOString();


    return await TradeDetail.findOne({
      where: {
        account: String(row["Account"]),
        trade_date: formattedDate,
        currency: String(row["Currency"]),
        type: parseInt(row["Type"]),
        side: String(row["Side"]),
        symbol: String(row["Symbol"]),
        quantity: parseInt(row["Qty"]),
        price: Number(row["Price"]),
        execution_time: row["Exec Time"],
        commission: Number(row["Comm"]),
        sec: Number(row["SEC"]),
        taf: Number(row["TAF"]),
        nscc: Number(row["NSCC"]),
        nasdaq: Number(row["Nasdaq"]),
        gross_proceeds: Number(row["Gross Proceeds"]),
        clearing_broker: String(row["Clr Broker"]),
        liquidity: String(row["Liq"]),
      },
      transaction,
    });
  },
  async findTradeDetailsById(tradeDetailsId, transaction) { 
    return await TradeDetail.findOne({
      where: {
        id: tradeDetailsId,
      },
      transaction,
    });
  },
  async findTradeLinkedToTradeDetails(tradeDetails, transaction) { 
    return await Trade.findOne({
      where: {
        id: tradeDetails.trade_id,
      },
      transaction,
    });
  },
  async findAllTradeDetailsAssociatedWithTrade(tradeDetails, transaction) { 
    return await TradeDetail.findAll({
      where: {
        trade_id: tradeDetails.trade_id,
      },
      transaction,
    });
  },
};
