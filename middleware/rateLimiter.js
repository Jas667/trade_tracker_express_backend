const { rateLimit } = require("express-rate-limit");

const userLimiter = rateLimit({
      windowMs: 10 * 60 * 1000, // 10 minutes
      limit: 10, // 10 requests
      message: {message: "Too many login attempts, please try again later."},
      standardHeaders: "draft-7",
      legacyHeaders: false,
});

const standardLimiter = rateLimit({
      windowMs: 3600 * 1000, // 1 hour
      limit: 500, // 500 requests
      message: {message: "Too many requests, please try again later."},
      standardHeaders: "draft-7",
      legacyHeaders: false,
});

module.exports = { userLimiter, standardLimiter };