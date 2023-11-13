const express = require("express");
const router = express.Router();

router.get('/ip', (request, response) => response.send(request.ip))

module.exports = router;