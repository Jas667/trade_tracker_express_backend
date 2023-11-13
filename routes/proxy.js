//This is used for troubleshooting Proxy issues with the client when deployed to Railway (or similar services)

const express = require("express");
const router = express.Router();

router.get('/', (request, response) => response.send(request.ip))

module.exports = router;