const express = require("express");
const router = express.Router();

const commentController = require("../controllers/commentControllers");
const { setContext } = require("../middleware/setContext");
const { isUserAuthenticated } = require("../authorisation/isUserAuthenticated");


/**
 * @swagger
 * /comment/all/{tradeId}:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Comment
 *    summary: Get all comments for a trade by trade ID
 *    description: Retrieve all comments associated with a specific trade ID for the authenticated user
 *    parameters:
 *      - in: path
 *        name: tradeId
 *        type: string
 *        format: uuid
 *        example: 14b85c32-9a4a-4299-8df8-733b30ccf1f9
 *        required: true
 *    responses:
 *      '200':
 *        description: Comments retrieved
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Comments retrieved
 *                data:
 *                  type: object
 *                  properties:
 *                    comments:
 *                      type: array
 *                      items:
 *                        type: object
 *                        properties:
 *                          id:
 *                            type: string
 *                            format: uuid
 *                            example: c4e227d1-6019-4515-b91f-2c9d261f7e03
 *                          comment_text:
 *                            type: string
 *                            example: This is a test comment
 *                          trade_id:
 *                            type: string
 *                            format: uuid
 *                            example: 14b85c32-9a4a-4299-8df8-733b30ccf1f9
 *                          user_id:
 *                            type: string
 *                            format: uuid
 *                            example: 3735a7f4-46e2-4726-811d-8ef4c5037bdf
 *      '400':
 *        description: Trade not found
 *      '401':
 *        description: Access Denied
 *      '403':
 *        description: User cannot view comments for this trade or Invalid authentication token
 *      '429':
 *        description: Too many requests
 *      '500':
 *        description: Error retrieving comments
 */

router.get("/all/:tradeId", isUserAuthenticated, setContext, commentController.getAllCommentsForTrade);

/**
 * @swagger
 * /comment/add/{tradeId}:
 *  post:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Comment
 *    summary: Add a comment to a trade by trade ID
 *    description: Add a comment to a specific trade for the authenticated user
 *    parameters:
 *      - in: path
 *        name: tradeId
 *        type: string
 *        format: uuid
 *        example: 94f58a6c-7415-4754-b2fd-54e5dec5002c
 *        required: true
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              comment_text:
 *                type: string
 *                example: This is a test comment
 *            required:
 *              - comment_text
 *    responses:
 *      '201':
 *        description: Comment added
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Comment added
 *                data:
 *                  type: object
 *                  properties:
 *                    comment_text:
 *                      type: string
 *                      example: This is a test comment
 *      '400':
 *        description: Comment cannot be empty or Comment must be associated with a trade or Trade not found
 *      '401':
 *        description: Access Denied
 *      '403':
 *        description: User cannot add a comment to this trade or Invalid authentication token
 *      '429':
 *        description: Too many requests
 *      '500':
 *        description: Error adding comment
 */

router.post("/add/:tradeId", isUserAuthenticated, setContext, commentController.addComment);

/**
 * @swagger
 * /comment/edit/{commentId}:
 *  put:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Comment
 *    summary: Edit a comment by ID
 *    description: Edit a comment associated with a specific comment ID for the authenticated user
 *    parameters:
 *      - in: path
 *        name: commentId
 *        type: string
 *        format: uuid
 *        example: 38470a21-7661-4559-b95b-48ee38d7aa33
 *        required: true
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              comment_text:
 *                type: string
 *                example: This is an edited comment.
 *                required: true
 *    responses:
 *      '200':
 *        description: Comment updated
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Comment updated
 *                data:
 *                  type: object
 *                  properties:
 *                    comment_text:
 *                      type: string
 *                      example: This is an updated test comment
 *      '400':
 *        description: Comment cannot be empty or Comment not found
 *      '403':
 *        description: User cannot edit this comment or Invalid authentication token
 *      '429':
 *        description: Too many requests
 *      '500':
 *        description: Error updating comment
 */
router.put("/edit/:commentId", isUserAuthenticated, setContext, commentController.editComment);

/**
 * @swagger
 * /comment/delete/{commentId}:
 *  delete:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Comment
 *    summary: Delete a comment by ID
 *    description: Delete a comment for the authenticated user
 *    parameters:
 *      - in: path
 *        name: commentId
 *        type: string
 *        format: uuid
 *        example: 38470a21-7661-4559-b95b-48ee38d7aa33
 *        required: true
 *    responses:
 *      '204':
 *        description: Comment deleted
 *      '400':
 *        description: Comment not found
 *      '401':
 *        description: Access Denied
 *      '403':
 *        description: User cannot delete this comment or Invalid authentication token
 *      '429':
 *        description: Too many requests
 *      '500':
 *        description: Error deleting comment
 */
router.delete("/delete/:commentId", isUserAuthenticated, setContext, commentController.deleteComment);


module.exports = router;