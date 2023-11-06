const Comment = require("../models").Comment;
const Trade = require("../models").Trade;
const {
  send201Created,
  send200Ok,
  send204Deleted,
} = require("../utils/responses");

const { AppError } = require("../utils/errorHandler");

module.exports = {
  async addComment(req, res, next) {
    if (!req.body.comment_text) {
      return next(new AppError("Comment cannot be empty", 400));
    }

    if (!req.tradeId) {
      return next(new AppError("Comment must be associated with a trade", 400));
    }

    try {
      //find if the trade id exists before trying to add the comment to it
      const trade = await Trade.findOne({
        where: {
          id: req.tradeId,
        },
      });

      if (trade.user_id !== req.userId) {
        return next(
          new AppError("User cannot add a comment to this trade", 403)
        );
      }

      if (!trade) {
        return next(new AppError("Trade not found", 400));
      }

      //add the comment to the trade
      const comment = await Comment.create({
        comment_text: req.body.comment_text,
        trade_id: req.tradeId,
        user_id: req.userId,
      });

      return send201Created(res, "Comment added", {
        comment_text: comment.comment_text,
      });
    } catch (e) {
      return next(new AppError("Error adding comment", 500));
    }
  },

  async editComment(req, res, next) {
    if (!req.body.comment_text) {
      return next(new AppError("Comment cannot be empty", 400));
    }

    try {
      //find if the comment id exists before trying to edit the comment
      const commentToEdit = await Comment.findOne({
        where: {
          id: req.commentId,
        },
      });

      if (!commentToEdit) {
        return next(new AppError("Comment not found", 400));
      }

      if (commentToEdit.user_id !== req.userId) {
        return next(new AppError("User cannot edit this comment", 403));
      }

      //update the comment
      commentToEdit.comment_text = req.body.comment_text;
      await commentToEdit.save();

      return send200Ok(res, "Comment updated", {
        comment_text: commentToEdit.comment_text,
      });
    } catch (e) {
      return next(new AppError("Error updating comment", 500));
    }
  },

  async deleteComment(req, res, next) {
    try {
      //find if the comment id exists before trying to delete the comment
      const commentToDelete = await Comment.findOne({
        where: {
          id: req.commentId,
        },
      });

      if (!commentToDelete) {
        return next(new AppError("Comment not found", 400));
      }

      if (commentToDelete.user_id !== req.userId) {
        return next(new AppError("User cannot delete this comment", 403));
      }

      //delete the comment
      await commentToDelete.destroy();

      return send204Deleted(res);
    } catch (e) {
      return next(new AppError("Error deleting comment", 500));
    }
  },

  async getAllCommentsForTrade(req, res, next) {
    try {
      //find if the trade id exists before trying to get the comments
      const trade = await Trade.findOne({
        where: {
          id: req.tradeId,
        },
      });

      if (!trade) {
        return next(new AppError("Trade not found", 400));
      }

      if (trade.user_id !== req.userId) {
        return next(
          new AppError("User cannot view comments for this trade", 403)
        );
      }

      //get the comments for the trade
      const comments = await Comment.findAll({
        where: {
          trade_id: req.tradeId,
        },
      });

      return send200Ok(res, "Comments retrieved", { comments: comments });
    } catch (e) {
      return next(new AppError("Error retrieving comments", 500));
    }
  },
};
