const { AppError } = require("../utils/errorHandler");
const jwt = require("jsonwebtoken");
const {
  verifyRefreshToken,
  generateAccessToken,
} = require("./helperFunctions");

module.exports = {
  async isUserAuthenticated(req, res, next) {
    const token = req.cookies.token;
    const refreshToken = req.cookies.refreshToken;
  
    if (!token && !refreshToken) {
      return next(new AppError("You are not logged in", 401));
    }
  
    if (token) {
      try {
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        req.userId = decodedToken.id;
        return next();
      } catch (e) {
        // If the error is NOT because of token expiration, immediately return an error
        if (e.name !== "TokenExpiredError") {
          return next(new AppError("Invalid token", 403));
        }
        // If there's no refresh token alongside an expired access token, return an error
        if (!refreshToken) {
          return next(new AppError("Access token expired", 401));
        }
      }
    }
  
    // At this point, either there's no access token or it's expired, so we proceed with the refresh token
    try {
      const decoded = await verifyRefreshToken(refreshToken);
      req.userId = decoded.id;
      const newAccessToken = generateAccessToken(decoded.id);
      res.cookie("token", newAccessToken, {
        httpOnly: true,
        maxAge: 3 * 60 * 60 * 1000,  // 3 hours
      });
      return next();
    } catch (error) {
      return next(new AppError("Error validating user. Please log in again.", 403));
    }
  }
  
};
