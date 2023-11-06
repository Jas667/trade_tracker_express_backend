const express = require("express");
const router = express.Router();
const { getNewToken } = require("../authorisation/getNewToken");

/**
 * @swagger
 * /refresh/refresh-token:
 *  post:
 *    tags:
 *      - Authentication/User Login
 *    summary: Refresh the access token using a refresh token.
 *    description: Endpoint to get a new access token using a refresh token stored in cookie.
 *    responses:
 *      '200':
 *        description: Token refreshed successfully.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Token refreshed successfully"
 *                data:
 *                  type: object
 *                  description: Additional data payload (currently empty but can be extended in the future).
 *      '401':
 *        description: No refresh token provided.
 *      '403':
 *        description: Invalid refresh token.
 *      '500':
 *        description: Error refreshing the token.
 */
router.post("/refresh-token", getNewToken);


module.exports = router;