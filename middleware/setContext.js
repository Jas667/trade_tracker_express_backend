module.exports = {
  setContext(req, res, next) {
    req.userId = req.userId;
    req.tagId = req.params.tagId;
    req.imageId = req.params.imageId;
    req.tradeId = req.params.tradeId;
    req.commentId = req.params.commentId;
    next();
  },
};
