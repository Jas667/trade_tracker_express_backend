// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

// error handling middleware
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  // log the error
  console.error(err.message, err.stack);

  // send the response
  if (req.app.get("env") === "development") {
    res.status(statusCode).send({
      status: "error",
      statusCode,
      message: err.message,
      stack: err.stack,
    });
  } else {
    const message = statusCode === 500 ? "Internal server error" : err.message;
    res.status(statusCode).send({
      status: "error",
      statusCode,
      message,
    });
  }
}

module.exports = {
  errorHandler,
  AppError,
};
