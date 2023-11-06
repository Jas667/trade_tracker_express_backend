const express = require("express");
const router = express.Router();
const { setContext } = require("../middleware/setContext");

const tradeTagController = require("../controllers/tradeTagControllers");
const { isUserAuthenticated } = require("../authorisation/isUserAuthenticated");

/**
 * @swagger
 * /tradetag/all/{tradeId}:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - TradeTags
 *    summary: Get all user tags for a trade
 *    description: Get all user tags for a trade
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: tradeId
 *        in: path
 *        description: The ID of the trade
 *        required: true
 *        type: string
 *        format: uuid
 *        example: "66144caf-f15a-4b86-8ef2-227fcd1826cd"
 *    responses:
 *      '200':
 *        description: Tags found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Tags found"
 *                data:
 *                  type: object
 *                  properties:
 *                    tags:
 *                      type: array
 *                      items:
 *                        type: object
 *                        properties:
 *                          id:
 *                            type: string
 *                            format: uuid
 *                            example: "13cf47f4-f3b8-42b4-8cb8-d7e977fc0c67"
 *                          tag_name:
 *                            type: string
 *                            example: "tag1"
 *      '400':
 *        description: Trade not found or Trade does not have any tags
 *      '403':
 *        description: User cannot view tags for this trade
 *      '401':
 *        description: Access denied due to lack of authentication token
 *      '429':
 *        description: Too many requests
 *      '500':
 *        description: Error getting tags or Internal server error occurred
 */
router.get(
  "/all/:tradeId",
  isUserAuthenticated,
  setContext,
  tradeTagController.getAllUserTagsForTrade
);

/**
 * @swagger
 * /tradetag/addatagtotrade/{tradeId}:
 *  post:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - TradeTags
 *    summary: Add one or multiple tags to a trade
 *    description: Add one or multiple tags to a trade
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: tradeId
 *        in: path
 *        description: The ID of the trade
 *        required: true
 *        type: string
 *        format: uuid
 *        example: "94f58a6c-7415-4754-b2fd-54e5dec5002c"
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              tagIds:
 *                type: array
 *                items:
 *                  type: string
 *                  format: uuid
 *                example: ["fd923a22-2de6-4155-8bba-3ea43e4a8f20", "another-uuid"]
 *            required:
 *              - tagIds
 *    responses:
 *      '200':
 *        description: Tag added to trade
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Tag added to trade"
 *                data:
 *                  type: object
 *                  additionalProperties: false
 *      '400':
 *        description: Tag already exists for this trade or Invalid request body
 *      '401':
 *        description: Access denied due to lack of authentication token
 *      '403':
 *        description: User cannot view tags for this trade
 *      '429':
 *        description: Too many requests
 *      '500':
 *        description: Error adding tag to trade or Internal server error occurred
 */
router.post(
  "/addatagtotrade/:tradeId",
  isUserAuthenticated,
  setContext,
  tradeTagController.addATagToTrade
);

/**
 * @swagger
 * /tradetag/retrieve:
 *  post:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - TradeTags
 *    summary: Retrieve trades associated with the provided tag IDs within the given date range
 *    description: Get trades that have any or all of the specified tag IDs based on the provided filters and date range. If no tag id is provided, all trades within the date range will be returned.
 *    produces:
 *      - application/json
 *    requestBody:
 *      description: Array of tag IDs, flag for filtering by all tags, and optional date range
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              tagIds:
 *                type: array
 *                items:
 *                  type: string
 *                  format: uuid
 *                example:
 *                  - "13cf47f4-f3b8-42b4-8cb8-d7e977fc0c67"
 *                  - "3e59dbf4-370a-4b4a-94d5-f35197f7127b"
 *              onlyWithAllTags:
 *                type: boolean
 *                example: false
 *              startDate:
 *                type: string
 *                format: date
 *                example: "2023-09-20"
 *              endDate:
 *                type: string
 *                format: date
 *                example: "2023-09-24"
 *    responses:
 *      '200':
 *        description: Trades successfully retrieved
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Trades found"
 *                data:
 *                  type: object
 *                  properties:
 *                    trades:
 *                      type: array
 *                      items:
 *                        $ref: '#/components/schemas/TradeWithTags'
 *      '400':
 *        description: Invalid input parameters provided
 *      '401':
 *        description: Access denied due to lack of authentication token
 *      '429':
 *        description: Too many requests
 *      '500':
 *        description: Error getting trades or Internal server error occurred
 */
router.post(
  "/retrieve",
  isUserAuthenticated,
  setContext,
  tradeTagController.getTradesWithAssociatedTags
);

/**
 * @swagger
 * /tradetag/delete/{tradeId}:
 *  delete:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - TradeTags
 *    summary: Remove tags from a trade
 *    description: Remove one or more tags from a trade by providing an array of tag IDs.
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: tradeId
 *        in: path
 *        description: The ID of the trade
 *        required: true
 *        type: string
 *        format: uuid
 *        example: "66144caf-f15a-4b86-8ef2-227fcd1826cd"
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              tagIds:
 *                type: array
 *                items:
 *                  type: string
 *                  format: uuid
 *                example: ["3e59dbf4-370a-4b4a-94d5-f35197f7127b", "a1b2c3d4-5678-9ef0-1234-567890abcdef"]
 *            required:
 *              - tagIds
 *    responses:
 *      '204':
 *        description: Successfully deleted
 *      '400':
 *        description: Tag does not exist for this trade or provided tag IDs are not valid
 *      '401':
 *        description: Access denied due to lack of authentication token
 *      '429':
 *        description: Too many requests
 *      '500':
 *        description: Error removing tag(s) from trade or Internal server error occurred
 */
router.delete(
  "/delete/:tradeId",
  isUserAuthenticated,
  setContext,
  tradeTagController.removeTagsFromATrade
);

module.exports = router;
