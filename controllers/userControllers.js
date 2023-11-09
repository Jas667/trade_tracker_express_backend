const User = require("../models/").User;
const RefreshToken = require("../models/").RefreshTokens;

const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const { query } = require("express");
const jwt = require("jsonwebtoken");

const { AppError } = require("../utils/errorHandler");

const {
  send201Created,
  send200Ok,
  send204Deleted,
} = require("../utils/responses");

module.exports = {


  async getUserById(req, res, next) {
    try {
      //check if user is the same as the one logged in
      // if (req.params.id !== req.userId) {
      //   return next(new AppError("You cannot view this user", 403));
      // }
      if (!req.userId) { 
        return next(new AppError("You cannot view this user", 403));
      }
      const user = await User.findByPk(req.userId, {
        attributes: ["id", "username", "first_name", "last_name", "profile_picture", "email"],
      });
      if (!user) {
        return next(new AppError("User not found", 400));
      }
      return send200Ok(res, "User found", { user: user });
    } catch (e) {
      return next(new AppError("Error getting user", 500));
    }
  },
  async registerUser(req, res, next) {
    try {
      const {
        username = "",
        password = "",
        email = "",
        first_name = "",
        last_name = "",
      } = req.body;

      //validation
      if (!username || !password || !email || !first_name || !last_name) {
        return next(new AppError("Missing fields", 400));
      }

      if (
        typeof username !== "string" ||
        typeof password !== "string" ||
        typeof email !== "string" ||
        typeof first_name !== "string" ||
        typeof last_name !== "string"
      ) {
        return next(new AppError("Invalid fields", 400));
      }

      if (username.length < 3 || username.length > 20) {
        return next(
          new AppError("Username must be between 3 and 20 characters", 400)
        );
      }

      if (!email.includes("@")) {
        return next(new AppError("Invalid email", 400));
      }

      if (password.length < 8) {
        return next(
          new AppError("Password must be at least 8 characters", 400)
        );
      }

      //REMOVE THIS FOR PRODUCTION, THIS SETTING IS TO DISABLE FOR TESTING PURPOSES
      //REMOVE THIS FOR PRODUCTION, THIS SETTING IS TO DISABLE FOR TESTING PURPOSES
      //REMOVE THIS FOR PRODUCTION, THIS SETTING IS TO DISABLE FOR TESTING PURPOSES
      //REMOVE THIS FOR PRODUCTION, THIS SETTING IS TO DISABLE FOR TESTING PURPOSES
      return res.status(401).send("Registration disabled for testing purposes");


      const user = await User.findOne({
        //check if user with the same username or email already exists
        where: {
          [Op.or]: [{ username }, { email }],
        },
      });
      //logic to handle if user already exists
      if (user) {
        if (user.email === email) {
          return next(new AppError("Email already exists", 400));
        }
        if (user.username === username) {
          return next(new AppError("Username already exists", 400));
        }
      }

      //hash the password
      const saltRounds = parseInt(process.env.SALT_ROUNDS);
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      //create the user
      const createdUser = await User.create({
        username,
        password: hashedPassword,
        email,
        first_name,
        last_name,
      });

      return send201Created(res, "User created. Please log in.");
    } catch (e) {
      return next(new AppError("Error creating user", 500));
    }
  },
  async updateUser(req, res, next) {
    //check if user is the same as the one logged in
    if (!req.userId) {
      return next(new AppError("You cannot update this user", 403));
    }
    const userId = req.userId;
    //define the fields that can be updated
    const allowedUpdates = [
      "username",
      "email",
      "first_name",
      "last_name",
      "profile_picture",
    ];

    //Object containing the allowed updates
    const updates = {};
    //loop through the request body and add the allowed updates to the updates object
    allowedUpdates.forEach((update) => {
      if (req.body[update]) {
        updates[update] = req.body[update];
      }
    });
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return next(new AppError("User not found", 400));
      }
      //update the user
      await User.update(updates, { where: { id: userId } });
      return send200Ok(res, "User updated");
    } catch (e) {
      return next(new AppError("Error updating user", 500));
    }
  },
  async loginUser(req, res, next) {
    //create a sequelize transaction
    const transaction = await RefreshToken.sequelize.transaction();

    try {
      const { identifier, password } = req.body;
      let query;
      const expirationTimeInMilliseconds = 3 * 60 * 60 * 1000; // 3 hours

      //check if both fields are filled
      if (!identifier || !password) {
        await transaction.rollback();
        return next(new AppError("Missing fields", 400));
      }
      //check if email or username has been provided
      if (identifier.includes("@")) {
        query = { email: identifier };
      } else {
        query = { username: identifier };
      }

      //check if user exists
      const user = await User.findOne({ where: query });

      if (!user) {
        await transaction.rollback();
        return next(new AppError("User not found", 400));
      } else {
        //check if password is correct
        const comparedPassword = await bcrypt.compare(password, user.password);

        if (!comparedPassword) {
          await transaction.rollback();
          return next(new AppError("Incorrect password", 400));
        } else {
          //refresh token expiry set to 7 days
          const refreshTokenExpirationTimeInMilliseconds =
            7 * 24 * 60 * 60 * 1000; // 7 days
          // Calculate the exact Date when the refreshToken will expire
          const refreshTokenExpiresAt = new Date(
            Date.now() + refreshTokenExpirationTimeInMilliseconds
          );
          //delete any current refresh tokens for user from db
          await RefreshToken.destroy(
            { where: { user_id: user.id } },
            { transaction }
          );
          //create a jwt refresh token
          const refreshToken = jwt.sign(
            { id: user.id },
            process.env.REFRESH_TOKEN_SECRET
          );
          //create a refresh token in the db
          await RefreshToken.create(
            {
              user_id: user.id,
              token: refreshToken,
              expires_at: refreshTokenExpiresAt,
            },
            { transaction }
          );
          //commit the transaction if everything is successful
          await transaction.commit();

          //create jwt token
          const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET, {
            expiresIn: expirationTimeInMilliseconds / 1000,
          });
          //set cookie
          res.clearCookie("token");
          res.cookie("token", token, {
            httpOnly: true,
            maxAge: expirationTimeInMilliseconds,
          });
          res.clearCookie("refreshToken");
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: refreshTokenExpirationTimeInMilliseconds,
          });
          return send200Ok(res, "Logged in successfully");
        }
      }
    } catch (e) {
      //rollback the transaction if there is an error
      await transaction.rollback();
      return next(new AppError("Error logging in", 500));
    }
  },
  async logoutUser(req, res, next) {
    const userId = req.userId;
    console.log(userId);
    try {
      //delete any current refresh tokens for user from db
      await RefreshToken.destroy({ where: { user_id: userId } });

      res.clearCookie("token");
      res.clearCookie("refreshToken");

      return send200Ok(res, "Logged out successfully");
    } catch (e) {
      return next(new AppError("Error logging out", 500));
    }
  },
  async deleteUser(req, res, next) {
    try {
      const id = req.userId;

      if (!id) {
        return next(new AppError("You cannot delete this user", 403));
      }
      const user = await User.destroy({ where: { id } });
      return send204Deleted(res);
    } catch (e) {
      console.log(e);
      return next(new AppError("Error deleting user", 500));
    }
  },
  async updatePassword(req, res, next) { 
    try {
      const userId = req.userId;
      console.log(userId);
      const { oldPassword, newPassword } = req.body;
      if (!userId) {
        return next(new AppError("You cannot update this user", 403));
      }
      if (!oldPassword || !newPassword) {
        return next(new AppError("Missing fields", 400));
      }
      if (newPassword.length < 8) {
        return next(
          new AppError("Password must be at least 8 characters", 400)
        );
      }
      const user = await User.findByPk(userId);
      if (!user) {
        return next(new AppError("User not found", 400));
      }
      const comparedPassword = await bcrypt.compare(oldPassword, user.password);
      if (!comparedPassword) {
        return next(new AppError("Incorrect password", 400));
      }
      const saltRounds = parseInt(process.env.SALT_ROUNDS);
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      await User.update({ password: hashedPassword }, { where: { id: userId } });
      return send200Ok(res, "Password updated");
    } catch (e) {
      console.log(e);
      return next(new AppError("Error updating password", 500));
    }
  },
};
