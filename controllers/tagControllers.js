const sequelize = require("sequelize");

const Tag = require("../models").Tag;
const {
  send201Created,
  send200Ok,
  send204Deleted,
} = require("../utils/responses");

const { AppError } = require("../utils/errorHandler");

module.exports = {
  async getAllUserTags(req, res, next) {
    try {
      const tags = await Tag.findAll({
        where: {
          user_id: req.userId,
        },
      });
      if (tags.length === 0) {
        return next(new AppError("No tags found", 404));
      }
      return send200Ok(res, "Tags found", { tags: tags });
    } catch (e) {
      return next(new AppError("Error getting tags", 500));
    }
  },
  async createTag(req, res, next) {
    const newTags = req.body.tag_name;
    //check if tag_name is empty
    if (!Array.isArray(newTags) || newTags.length === 0) {
      return next(
        new AppError("Tag name cannot be empty or not an array", 400)
      );
    }
    //create a squelize transaction. This will allow for many tags to be added at once
    const transaction = await Tag.sequelize.transaction();

    const createdTagIds = [];

    try {
      for (let i = 0; i < newTags.length; i++) {
        const [tag, created] = await Tag.findOrCreate({
          where: {
            tag_name: newTags[i],
            user_id: req.userId,
          },
          defaults: {
            tag_name: newTags[i],
            user_id: req.userId,
          },
          transaction: transaction,
        });
        if (created) {
          createdTagIds.push(tag.id);
        } else {
          await transaction.rollback();
          return next(new AppError(`Tag '${newTags[i]}' already exists`, 400));
        }
      }
      await transaction.commit();
      return send201Created(res, "Tag(s) created", {
        createdTagIds: createdTagIds,
      });
    } catch (e) {
      await transaction.rollback();
      return next(new AppError("Error creating tag", 500));
    }
  },

  async updateTag(req, res, next) {
    //check if tag_name is empty
    if (!req.body.tag_name) {
      return next(new AppError("Tag name cannot be empty", 400));
    }

    try {
      //check if tag violates unique constraint before continuing
      const conflictingTag = await Tag.findOne({
        where: {
          tag_name: req.body.tag_name,
          id: { [sequelize.Op.ne]: req.params.id },
        },
      });

      if (conflictingTag) {
        return next(new AppError("Tag name already exists", 400));
      }

      //find tag by id
      const tag = await Tag.findOne({
        where: {
          id: req.params.id,
        },
      });

      //if no tag found, return error
      if (!tag) {
        return next(new AppError("Tag not found", 400));
      }

      //if tag found, but userId doesn't match, return error
      if (tag.user_id !== req.userId) {
        return next(new AppError("You cannot update this tag", 403));
      }

      //update the tag
      tag.tag_name = req.body.tag_name;
      await tag.save();
      return send200Ok(res, "Tag updated");
    } catch (e) {
      return next(new AppError("Error updating tag", 500));
    }
  },

  async deleteTag(req, res, next) {
    try {
      //find tag by id
      const tag = await Tag.findOne({
        where: {
          id: req.params.id,
        },
      });

      //if no tag found, return error
      if (!tag) {
        return next(new AppError("Tag not found", 400));
      }
      //if tag found, but userId doesn't match, return error
      if (tag.user_id !== req.userId) {
        return next(new AppError("You cannot delete this tag", 403));
      }
      //delete the tag
      await tag.destroy();
      return send204Deleted(res);
    } catch (e) {
      return next(new AppError("Error deleting tag", 500));
    }
  },
};
