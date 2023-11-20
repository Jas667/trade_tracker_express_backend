const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/").RefreshTokens;
const { AppError } = require("../utils/errorHandler");

module.exports = {
  // This function verifies a given refresh token and returns the decoded data if it's valid
  async verifyRefreshToken(refreshToken) {
    const validTokenEntry = await RefreshToken.findOne({
      where: { token: refreshToken },
    });

    if (!validTokenEntry) {
      throw new AppError("Invalid refresh token", 403);
    }

    return new Promise((resolve, reject) => {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
          if (err) reject(new AppError("Invalid Refresh Token", 403));
          else resolve(decoded);
        }
      );
    });
  },

  // This function generates a new access token given a user's ID
  generateAccessToken(userId) {
    return jwt.sign({ id: userId }, process.env.TOKEN_SECRET, {
      expiresIn: 3 * 60 * 60, // 3 hours
    });
  },

  generatePasswordResetToken(userEmail) { 
    return jwt.sign({ email: userEmail }, process.env.PASSWORD_RESET_TOKEN_SECRET, {
      expiresIn: 15 * 60, // 15 minutes
    });
  },

};
