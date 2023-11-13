const Image = require("../models").Image;
const fs = require("fs");
const path = require("path");
const {
  send201Created,
  send200Ok,
  send204Deleted,
} = require("../utils/responses");

const { AppError } = require("../utils/errorHandler");

module.exports = {
  async getImage(req, res, next) {
    if (!req.imageId) {
      return next(new AppError("Image id not provided", 400));
    }
    try {
      const image = await Image.findOne({
        where: {
          id: req.imageId,
          user_id: req.userId,
        },
      });
      if (!image) {
        return next(new AppError("Image not found", 400));
      }
      return send200Ok(res, "Image found", { image: image });
    } catch (e) {
      return next(new AppError("Error getting image", 500));
    }
  },
  async getImagesForTrade(req, res, next) {
    if (!req.tradeId) {
      return next(new AppError("Trade id not provided", 400));
    }
    try {
      const images = await Image.findAll({
        where: {
          trade_id: req.tradeId,
          user_id: req.userId,
        },
      });
      if (!images) {
        return next(new AppError("No images found", 400));
      }
      return send200Ok(res, "Images found", { imnages: images });
    } catch (e) {
      return next(new AppError("Error getting images", 500));
    }
  },
  async editImage(req, res, next) {
    const { image_url = "" } = req.body;

    if (!req.imageId) {
      return next(new AppError("Image id not provided", 400));
    }

    if (!image_url) {
      return next(new AppError("Missing fields", 400));
    }

    if (typeof image_url !== "string") {
      return next(new AppError("Invalid fields", 400));
    }

    try {
      const image = await Image.findOne({
        where: {
          id: req.imageId,
          user_id: req.userId,
        },
      });

      if (!image) {
        return next(new AppError("Image not found", 400));
      }

      await Image.update({ image_url }, { where: { id: req.imageId } });
      return send200Ok(res, "Image edited successfully", {
        image_url: image_url,
      });
    } catch (e) {
      if (e.name === "SequelizeValidationError") {
        const errorMessages = e.errors.map((err) => err.message);
        if (errorMessages.includes("Image URL must be a valid URL")) {
          return next(new AppError("Error editing image", 400));
        }
      }
      return next(new AppError("Error editing image", 500));
    }
  },
  async uploadNewImage(req, res, next) {
    if (!req.file) {
      return next(new AppError("No image provided", 400));
    }

    const imagePath = path.join(
      __dirname,
      "..",
      "public",
      "userImageUploads",
      req.userId.toString(),
      req.file.filename
    );

    try {
      const image = await Image.create({
        trade_id: req.tradeId,
        user_id: req.userId,
        image_url: req.file.filename,
      });

      return send201Created(res, "Image uploaded successfully");
    } catch (e) {
      //if there's an error, delete the image from the userImageUploads folder
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error removing the file", err);
        }
      });

      return next(new AppError("Error uploading image", 500));
    }
  },
  async deleteImage(req, res, next) {
    if (!req.imageId) {
      return next(new AppError("Image id not provided", 400));
    }

    try {
      const image = await Image.findOne({
        where: {
          id: req.imageId,
          user_id: req.userId,
        },
      });

      if (!image) {
        return next(new AppError("Image not found", 400));
      }

      const imagePath = path.join(
        __dirname,
        "..",
        "public",
        "userImageUploads",
        req.userId.toString(),
        image.image_url
      );
      //remove image from the DB
      await Image.destroy({ where: { id: req.imageId } });

      //remove image from server
      fs.unlink(imagePath, async (err) => {
        if (err) {
          console.error("Error removing the file", err);
          return next(new AppError("Error deleting image", 500));
        }
        return send204Deleted(res);
      });
    } catch (e) {
      return next(new AppError("Error deleting image", 500));
    }
  },
};
