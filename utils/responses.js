module.exports = {
  send200Ok(res, message, data = {}) {
    res.status(200).send({
      message,
      data,
    });
  },
  send201Created(res, message, data = {}) {
    res.status(201).send({
      message,
      data,
    });
  },
  send204Deleted(res) {
    res.status(204).send();
  },
};
