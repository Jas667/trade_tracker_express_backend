const express = require("express");
const router = express.Router();

//import the user controller
const tradeController = require("../controllers/tradeControllers");
const { setContext } = require("../middleware/setContext");
const { isUserAuthenticated } = require("../authorisation/isUserAuthenticated");

/**
 * @swagger
 * /trade/:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Trades
 *    summary: Get all trades for the authenticated user
 *    description: Retrieves all trades for the authenticated user
 *    produces:
 *      - application/json
 *    responses:
 *      '200':
 *        description: A list of trades associated with the authenticated user
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
 *                        $ref: '#/components/schemas/Trade'
 *      '400':
 *        description: No trades found
 *      '401':
 *        description: Access denied due to lack of authentication token
 *      '403':
 *        description: Invalid authentication token
 *      '429':
 *        description: Too many requests
 *      '500':
 *        description: Error getting trades
 */
router.get("/", isUserAuthenticated, tradeController.getUsersTrades);

/**
 * @swagger
 * /trade/dateRange:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Trades
 *    summary: Get all trades within a date range
 *    description: Retrieves all trades for the authenticated user within a specified date range
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: startDate
 *        in: query
 *        description: Start date for the trades range
 *        required: true
 *        type: string
 *        format: date
 *        example: "YYYY-MM-DD"
 *      - name: endDate
 *        in: query
 *        description: End date for the trades range
 *        required: true
 *        type: string
 *        format: date
 *        example: "YYYY-MM-DD"
 *    responses:
 *      '200':
 *        description: A list of trades within the specified date range ordered by date and time
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
 *                        $ref: '#/components/schemas/TradeWithAdditionalColumns'
 *      '400':
 *        description: Error getting trades or no trades found in the specified date range
 *      '401':
 *        description: Access denied due to lack of authentication token
 *      '403':
 *        description: Invalid authentication token
 *      '429':
 *        description: Too many requests
 *      '500':
 *        description: Server error
 */
router.get(
  "/dateRange",
  isUserAuthenticated,
  setContext,
  tradeController.getTradesInDateRange
);

/**
 * @swagger
 * /trade/add:
 *  post:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Trades
 *    summary: Add a new trade
 *    description: Add a new trade for the authenticated user
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - symbol
 *              - status
 *              - open_time
 *              - close_time
 *              - profit_loss
 *              - open_date
 *              - shares
 *            properties:
 *              symbol:
 *                type: string
 *                example: "AAPL"
 *              status:
 *                type: string
 *                enum: ["open", "closed"]
 *                example: "open"
 *              open_time:
 *                type: string
 *                description: Time format HH:MM:SS
 *                example: "06:26:14"
 *              close_time:
 *                type: string
 *                description: Time format HH:MM:SS
 *                example: "06:27:54"
 *              notes:
 *                type: string
 *                example: "This is a note"
 *              profit_loss:
 *                type: number
 *                format: float
 *                example: 46.76
 *              open_date:
 *                type: string
 *                description: Date format YYYY-MM-DD
 *                example: "2023-08-01"
 *              close_date:
 *                type: string
 *                description: Date format YYYY-MM-DD
 *                example: "2023-08-01"
 *              shares:
 *                type: integer
 *                format: int32
 *                example: 100
 *    responses:
 *      '201':
 *        description: Trade was successfully added
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Trade added"
 *                data:
 *                  type: object
 *                  properties:
 *                    trade:
 *                      $ref: '#/components/schemas/Trade'
 *      '400':
 *        description: Error due to missing or invalid fields
 *      '401':
 *        description: Access denied due to lack of authentication token
 *      '403':
 *        description: Invalid authentication token
 *      '429':
 *        description: Too many requests
 *      '500':
 *        description: Server error
 */
router.post("/add", isUserAuthenticated, setContext, tradeController.addTrade);

/**
 * @swagger
 * /trade/update/{id}:
 *  put:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Trades
 *    summary: Update a trade by ID
 *    description: Update a trade for the authenticated user
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        format: uuid
 *        example: "94f58a6c-7415-4754-b2fd-54e5dec5002c"
 *        description: ID of the trade to be updated
 *        type: integer
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              notes:
 *                type: string
 *                description: Notes for the trade
 *                example: "This is an updated note"
 *            required:
 *              - notes
 *    responses:
 *      '200':
 *        description: Trade was successfully updated
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Trade updated"
 *                data:
 *                  type: object
 *                  default: {}
 *      '400':
 *        description: Trade not found or invalid fields
 *      '401':
 *        description: Access denied due to lack of authentication token
 *      '403':
 *        description: Invalid authentication token
 *      '429':
 *        description: Too many requests
 *      '500':
 *        description: Error updating trade
 */
router.put(
  "/update/:id",
  isUserAuthenticated,
  setContext,
  tradeController.updateTrade
);

/**
 * @swagger
 * /trade/delete/{id}:
 *  delete:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Trades
 *    summary: Delete a trade by ID
 *    description: Delete a trade for the authenticated user
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: ID of the trade to be deleted
 *        format: uuid
 *        example: "14b85c32-9a4a-4299-8df8-733b30ccf1f9"
 *        type: integer
 *    responses:
 *      '204':
 *        description: Trade was successfully deleted
 *      '400':
 *        description: Trade not found
 *      '401':
 *        description: Access denied due to lack of authentication token
 *      '403':
 *        description: Invalid authentication token
 *      '429':
 *        description: Too many requests
 *      '500':
 *        description: Error deleting trade
 */
router.delete(
  "/delete/:id",
  isUserAuthenticated,
  setContext,
  tradeController.deleteTrade
);

module.exports = router;
