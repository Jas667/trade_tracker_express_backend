const express = require("express");
const router = express.Router();
const { setContext } = require("../middleware/setContext");

const tagController = require("../controllers/tagControllers");
const { isUserAuthenticated } = require("../authorisation/isUserAuthenticated");

/**
 * @swagger
 * /tag/all/:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Tag
 *    summary: Get all tags created by the authenticated user
 *    description: Get all tags created by a specific user
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
 *                        $ref: '#/components/schemas/Tag'
 *      '401':
 *        description: Access denied due to lack of authentication token
 *      '403':
 *        description: Invalid authentication token
 *      '404':
 *        description: No tags found
 *      '429':
 *        description: Too many requests
 *      '500':
 *        description: Error getting tags
 */
router.get("/all/", isUserAuthenticated, setContext, tagController.getAllUserTags);

/**
 * @swagger
 * /tag/create:
 *  post:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Tag
 *    summary: Create a tag
 *    description: Create a tag
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              tag_name:
 *                type: array
 *                items:
 *                  type: string
 *                example: ["10 Sec Pullback", "Dip Buy", "Breakout"]
 *            required:
 *              - tag_name
 *    responses:
 *      '201':
 *        description: Tag created
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Tag created"
 *                data:
 *                  type: object
 *                  default: {"createdTagIds": ["d1b0c1e0-5b1a-4e1a-9c0a-0b8b8b0b8b0b"]}
 *      '400':
 *        description: Tag already exists
 *      '401':
 *        description: Access denied due to lack of authentication token
 *      '403':
 *        description: Invalid authentication token
 *      '429':
 *        description: Too many requests
 *      '500':
 *        description: Error creating tag
 */
router.post("/create", isUserAuthenticated, setContext, tagController.createTag);

/**
 * @swagger
 * /tag/update/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Tag
 *     summary: Update a tag by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID of the tag to be updated
 *     requestBody:
 *       description: Updated tag_name
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tag_name:
 *                 type: string
 *                 example: 'Important'
 *     responses:
 *       '200':
 *         description: Tag updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Tag updated'
 *                 data:
 *                  type: object
 *                  default: {}
 *       '400':
 *         description: Error updating tag / Tag not found / You cannot update this tag / Tag name cannot be empty
 *       '401':
 *         description: Access denied due to lack of authentication token
 *       '403':
 *         description: Invalid authentication token
 *       '429':
 *         description: Too many requests
 *       '500':
 *         description: Internal server error occurred
 */
router.put("/update/:id", isUserAuthenticated, setContext, tagController.updateTag);

/**
 * @swagger
 * /tag/delete/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Tag
 *     summary: Delete a tag by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID of the tag to be deleted
 *     responses:
 *       '204':
 *         description: Tag deleted successfully
 *       '400':
 *         description: Error deleting tag / Tag not found / You cannot delete this tag
 *       '401':
 *         description: Access denied due to lack of authentication token
 *       '403':
 *         description: Invalid authentication token
 *       '429':
 *         description: Too many requests
 *       '500':
 *         description: Internal server error occurred
 */
router.delete("/delete/:id", isUserAuthenticated, setContext, tagController.deleteTag);

module.exports = router;
