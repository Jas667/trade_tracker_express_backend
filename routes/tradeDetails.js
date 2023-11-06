const express = require("express");
const router = express.Router();
const { excelUpload } = require("../middleware/multerConfig");

//import the user controller
const tradeDetailsController = require("../controllers/tradeDetailsControllers");
const { setContext } = require("../middleware/setContext");
const { isUserAuthenticated } = require("../authorisation/isUserAuthenticated");

/**
 * @swagger
 * /tradedetails/:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - TradeDetails
 *    summary: Get all trade details for the authenticated user
 *    description: Retrieves all trade details for the authenticated user
 *    produces:
 *      - application/json
 *    responses:
 *      '200':
 *        description: Successfully retrieved trade details
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Trade Details Found"
 *                data:
 *                  type: object
 *                  properties:
 *                    tradeDetails:
 *                      type: array
 *                      items:
 *                        $ref: '#/components/schemas/TradeDetailWithTrade'
 *
 *      '400':
 *        description: No trade details found
 *      '401':
 *        description: Access denied due to lack of authentication token
 *      '403':
 *        description: Invalid authentication token
 *      '429':
 *        description: Too many requests
 *      '500':
 *        description: Error Occurred                 
 */
router.get("/", isUserAuthenticated, setContext, tradeDetailsController.getAllUsersTradeDetails);

/**
 * @swagger
 * /tradedetails/gettradedetailsbytradeid/{id}:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - TradeDetails
 *    summary: Fetch trade details by trade ID
 *    description: Retrieves trade details associated with a specific trade ID for the authenticated user
 *    parameters:
 *      - name: id
 *        in: path
 *        format: uuid
 *        example: "14b85c32-9a4a-4299-8df8-733b30ccf1f9"
 *        description: ID of the trade
 *        required: true
 *        schema:
 *          type: string
 *    produces:
 *      - application/json
 *    responses:
 *      '200':
 *        description: Successfully retrieved trade details by trade ID
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Trade Details Found"
 *                data:
 *                  type: object
 *                  properties:
 *                    tradeWithDetails:
 *                      $ref: '#/components/schemas/TradeWithDetails'
 *
 *      '400':
 *        description: No trade details found
 *      '401':
 *        description: Access denied due to lack of authentication token
 *      '403':
 *        description: Invalid authentication token
 *      '429':
 *        description: Too many requests
 *      '500':
 *        description: Error Occurred
 */
router.get("/gettradedetailsbytradeid/:id", isUserAuthenticated, setContext, tradeDetailsController.getTradeDetailsByTradeId);

/**
 * @swagger
 * /tradedetails/upload-trades/:
 *  post:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - TradeDetails
 *    summary: Uploads a CSV file containing trade details and processes its contents
 *    description: Uploads a CSV file containing trade details and processes its contents
 *    produces:
 *      - application/json
 *    requestBody:
 *      description: CSV file containing trade details
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              excelFile:
 *                type: string
 *                format: binary
 *                description: CSV file to upload.
 *    responses:
 *      '201':
 *        description: Successfully uploaded trade details
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "File uploaded successfully"
 *                data:
 *                  type: object
 *      '400':
 *        description: Bad request (e.g. No file uploaded, Invalid file type, No data in the uploaded file)
 *      '401':
 *        description: Access denied due to lack of authentication token
 *      '403':
 *        description: Invalid authentication token
 *      '429':
 *        description: Too many requests
 *      '500':
 *        description: Server error (e.g. Error processing file)
 */
router.post(
  "/upload-trades",
  isUserAuthenticated,
  setContext,
  excelUpload.single("excelFile"),
  tradeDetailsController.addTradeDetailsFromExcel
);

/**
 * @swagger
 * /tradedetails/{id}:
 *  put:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - TradeDetails
 *    summary: Edit trade details by ID
 *    description: Allows the editing of trade details by providing the ID of the trade detail.
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: ID of the trade detail to edit
 *        schema:
 *          type: string
 *          format: uuid
 *          example: 00e8a1f0-b990-4ce9-963c-c7dc429207c7
 *    requestBody:
 *      description: The trade detail data to be updated (Minimum of 1 field required)
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              quantity:
 *                type: number
 *                description: The quantity of the trade
 *              price:
 *                type: number
 *                format: float
 *                description: The price of the trade
 *              notes:
 *                type: string
 *                description: Notes related to the trade
 *              net_proceeds:
 *                type: number
 *                format: float
 *                description: Net proceeds of the trade
 *    responses:
 *      '200':
 *        description: Trade details updated successfully!
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                data:
 *                  type: object
 *      '400':
 *        description: Error updating trade details or Trade Details not found
 *      '401':
 *        description: Access denied due to lack of authentication token
 *      '403':
 *        description: Invalid authentication token
 *      '429':
 *        description: Too many requests
 *      '500':
 *        description: Internal server error occurred
 */
router.put("/:id", isUserAuthenticated, setContext, tradeDetailsController.editTradeDetails);

/**
 * @swagger
 * /tradedetails/{id}:
 *  delete:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - TradeDetails
 *    summary: Delete trade details by ID
 *    description: Deletes a trade detail by its ID and updates associated trade's shares, profit/loss, and status.
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: ID of the trade detail to be deleted
 *        schema:
 *          type: string
 *          format: uuid
 *          example: 00e8a1f0-b990-4ce9-963c-c7dc429207c7
 *    responses:
 *      '204':
 *        description: Trade details deleted successfully
 *      '400':
 *        description: Trade Details not found
 *      '401':
 *        description: Access denied due to lack of authentication token
 *      '403':
 *        description: Invalid authentication token
 *      '429':
 *        description: Too many requests
 *      '500':
 *        description: Internal server error occurred
 */
router.delete("/:id", isUserAuthenticated, tradeDetailsController.deleteTradeDetails);

module.exports = router;
