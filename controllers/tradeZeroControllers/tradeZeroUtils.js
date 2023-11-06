module.exports = {
  roundToMaximumSixDecimals(number) {
    // Ensure the input is a string
    let strNum = String(number);

    // Check if the string contains a decimal point
    if (strNum.includes(".")) {
      // Split the string at the decimal point
      let parts = strNum.split(".");

      // If there's a decimal part and it has more than 4 digits, round the number
      if (parts.length > 1 && parts[1].length > 5) {
        let number = parseFloat(strNum);
        return number.toFixed(5);
      }
    }

    // Otherwise, return the original string (either it doesn't have a decimal point or has 6 or fewer digits after it)
    return strNum;
  },

  //filter blank rows and rows filled with commas, which is common in excel
  filterBlankRowsAndRowsOfCommas(data) {
    //This will filter out empty rows and rows full of commas, which were previously causing errors
    data.filter((row) => {
      // Check for entirely blank rows.
      if (Object.keys(row).length === 0) {
        return false;
      }

      // Check if all keys in the row have undefined or empty values.
      for (let key in row) {
        if (row[key] !== undefined && row[key] !== "") {
          return true;
        }
      }

      return false;
    });
  },
  arrangeDataByDateAndExecutionTime(data) {
    // make sure the data is sorted in ascending order of trade date and time
    data.sort((a, b) => {
      // Convert string dates to Date objects
      const dateA = new Date(a["T/D"]);
      const dateB = new Date(b["T/D"]);

      // Convert the Date objects to time (number of milliseconds since 1970)
      const timeA = dateA.getTime();
      const timeB = dateB.getTime();

      if (timeA !== timeB) {
        return timeA - timeB;
      }

      // If trade dates are the same, compare execution times
      // return a["Exec Time"].localeCompare(b["Exec Time"]);

      // If trade dates are the same, compare execution times
      const execComparison = a["Exec Time"].localeCompare(b["Exec Time"]);

      if (execComparison !== 0) {
        return execComparison;
      }

      // If execution times are the same and type is 2, place the buy trade first
      if (a["Type"] === 2 && b["Type"] === 2) {
        return a["Side"] === "B" ? -1 : 1;
      }
      return 0;
    });
  },
  workOutInitialProfitAndLoss(row) {
    const initialProfitAndLoss =
      Number(row["Gross Proceeds"]) -
      Number(row["Comm"]) -
      Number(row["SEC"]) -
      Number(row["TAF"]) -
      Number(row["NSCC"]) -
      Number(row["Nasdaq"]);

    return initialProfitAndLoss;
  },
  updateProfitAndLossAndShareSize(row, trade) {
    const updatedProfitAndLoss =
      Number(trade.profit_loss) +
      Number(row["Gross Proceeds"]) -
      Number(row["Comm"]) -
      Number(row["SEC"]) -
      Number(row["TAF"]) -
      Number(row["NSCC"]) -
      Number(row["Nasdaq"]);

    const updatedData = {
      shares:
        row["Side"] === "B"
          ? trade.shares + Number(row["Qty"])
          : trade.shares - Number(row["Qty"]),
      profit_loss: parseFloat(updatedProfitAndLoss.toFixed(2)),
    };

    if (updatedData.shares === 0) {
      updatedData.status = "closed";
      updatedData.close_date = row["T/D"];
      updatedData.close_time = row["Exec Time"];
    }

    return updatedData;
  },
  adjustTradeShareSizeAndTradeStatusToSuitAddedTradeDetail(
    row,
    updatedProfitAndLoss,
    trade
  ) {
    const updatedData = {
      shares:
        row["Side"] === "B"
          ? trade.shares + Number(row["Qty"])
          : trade.shares - Number(row["Qty"]),
      profit_loss: parseFloat(updatedProfitAndLoss.toFixed(2)),
    };

    if (updatedData.shares === 0) {
      updatedData.status = "closed";
      updatedData.close_time = row["Exec Time"];
    }
    return updatedData;
  },
};
