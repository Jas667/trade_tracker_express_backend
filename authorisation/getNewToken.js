const RefreshToken = require("../models/").RefreshTokens;

const jwt = require("jsonwebtoken");

const { send200Ok } = require("../utils/responses");
const {
  verifyRefreshToken,
  generateAccessToken,
} = require("./helperFunctions");

module.exports = {
  async getNewToken(req, res, next) {
    const refreshToken = req.cookies.refreshToken;

    try {
      const decoded = await verifyRefreshToken(refreshToken);
      const accessToken = generateAccessToken(decoded.id);
      res.cookie("token", accessToken, {
        httpOnly: true,
        maxAge: 3 * 60 * 60 * 1000,
      });
      return send200Ok(res, "Token refreshed successfully");
    } catch (error) {
      return next(error);
    }
  },
};
