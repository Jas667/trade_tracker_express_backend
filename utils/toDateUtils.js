//function to convert excel date to js date

function serialToDate(serial) {

  const epoch = new Date(1899, 11, 30); // Excel's epoch is December 30, 1899
  const date = new Date(epoch.getTime() + serial * 24 * 60 * 60 * 1000); // Convert serial to milliseconds and add to epoch

  //extract the year, month and day and format it
  const yyyy = date.getUTCFullYear();
  let mm = date.getUTCMonth() + 1;
  let dd = date.getUTCDate();

  mm = mm < 10 ? `0` + mm : mm;
  dd = dd < 10 ? `0` + dd : dd;

  return `${yyyy}-${mm}-${dd}`;
}

module.exports = {
  serialToDate,
};
