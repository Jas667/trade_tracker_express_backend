const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/multerConfig");
const { setContext } = require("../middleware/setContext");

const imageController = require("../controllers/imageControllers");
const { isUserAuthenticated } = require("../authorisation/isUserAuthenticated");

/**
 * @swagger
 * /image/single/{imageId}:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Image
 *    summary: Retrieve a single image for the authenticated user by ID
 *    description: Retrieve a single image for the authenticated user
 *    parameters:
 *      - in: path
 *        name: imageId
 *        type: string
 *        format: uuid
 *        example: 0de70710-6b44-4df9-a158-a8f1f91714e5
 *        required: true
 *    responses:
 *      '200':
 *        description: Image found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Image found
 *                data:
 *                  type: object
 *                  properties:
 *                    image:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: string
 *                          format: uuid
 *                          example: 0de70710-6b44-4df9-a158-a8f1f91714e5
 *                        user_id:
 *                          type: string
 *                          format: uuid
 *                          example: 14b85c32-9a4a-4299-8df8-733b30ccf1f9
 *                        trade_id:
 *                          type: string
 *                          format: uuid
 *                          example: 3735a7f4-46e2-4726-811d-8ef4c5037bdf
 *                        image_url:
 *                          type: string
 *                          example: www.newimage.com

 *      '400':
 *        description: Image id not provided or Image not found or Error getting image
 *      '401':
 *        description: Access denied due to lack of authentication token
 *      '403':
 *        description: Invalid authentication token
 *      '429':
 *        description: Too many requests
 *      '500':
 *        description: Internal server error occurred
 */
//get a single image by id
router.get("/single/:imageId", isUserAuthenticated, setContext, imageController.getImage);

/**
 * @swagger
 * /image/all/{tradeId}:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Image
 *    summary: Retrieve all images associated with a specific trade ID for the authenticated user
 *    description: Retrieve all images associated with a specific trade ID for the authenticated user
 *    parameters:
 *      - in: path
 *        name: tradeId
 *        type: string
 *        example: 0de70710-6b44-4df9-a158-a8f1f91714e5
 *        format: uuid
 *        description: ID of the trade to retrieve images for
 *        required: true
 *    responses:
 *      '200':
 *        description: Images found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Images found
 *                data:
 *                  type: object
 *                  properties:
 *                    imnages:
 *                      type: array
 *                      items:
 *                        type: object
 *                        properties:
 *                          id:
 *                            type: string
 *                            format: uuid
 *                            example: 0de70710-6b44-4df9-a158-a8f1f91714e5
 *                          user_id:
 *                            type: string
 *                            format: uuid
 *                            example: 14b85c32-9a4a-4299-8df8-733b30ccf1f9
 *                          trade_id:
 *                            type: string
 *                            format: uuid
 *                            example: 3735a7f4-46e2-4726-811d-8ef4c5037bdf
 *                          image_url:
 *                            type: string
 *                            example: https://i.imgur.com/1QZz9ZB.jpeg
 *      '400':
 *        description: Image id not provided or Missing fields or Invalid fields or Error editing image
 *      '401':
 *        description: Access denied due to lack of authentication token
 *      '403':
 *        description: Invalid authentication token
 *      '429':
 *        description: Too many requests
 *      '500':
 *        description: Error editing image
 */
//get all images for a trade
router.get(
  "/all/:tradeId",
  isUserAuthenticated,
  setContext,
  imageController.getImagesForTrade
);

/**
/**
 * @swagger
 * /image/edit/{imageId}:
 *  put:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Image
 *    summary: Edit an image by ID
 *    description: Edit an image by specifying the image ID
 *    parameters:
 *      - in: path
 *        name: imageId
 *        type: string
 *        format: uuid
 *        example: 48278baf-2717-4fc3-b82c-c250dd3284b9
 *        required: true
 *    requestBody:
 *      description: Provide the new image URL
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              image_url:
 *                type: string
 *                example: 1693039947834-7th Aug VTGN 1.png
 *                description: New image location
 *                required: true
 *    responses:
 *      '200':
 *        description: Image edited successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Image edited successfully
 *                data:
 *                  type: object
 *                  properties:
 *                    image_url:
 *                      type: string
 *                      example: 1693039947834-7th Aug VTGN 1.png
 *      '400':
 *        description: Image id not provided or Missing fields or Invalid fields or Image not found or Error editing image (if Image URL is not a valid URL)
 *      '401':
 *        description: Access denied due to lack of authentication token
 *      '403':
 *        description: Invalid authentication token
 *      '429':
 *        description: Too many requests
 *      '500':
 *        description: Error editing image
 */

router.put("/edit/:imageId", isUserAuthenticated, setContext, imageController.editImage);

/**
 * @swagger
 * /image/add/{tradeId}:
 *  post:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Image
 *    summary: Upload a new image to be associated with a trade by ID
 *    description: Upload a new image by specifying the trade ID
 *    parameters:
 *      - in: path
 *        name: tradeId
 *        type: string
 *        format: uuid
 *        example: 14b85c32-9a4a-4299-8df8-733b30ccf1f9
 *        required: true
 *    requestBody:
 *      description: Provide the image file to be uploaded
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              image:
 *                type: string
 *                format: binary
 *    responses:
 *      '201':
 *        description: Image uploaded successfully
 *      '400':
 *        description: No image provided
 *      '401':
 *        description: Access denied due to lack of authentication token
 *      '403':
 *        description: Invalid authentication token
 *      '429':
 *        description: Too many requests
 *      '500':
 *        description: Error uploading image
 */
router.post(
  "/add/:tradeId",
  isUserAuthenticated,
  setContext,
  upload.single("image"),
  imageController.uploadNewImage
);

/**
 * @swagger
 * /image/delete/{imageId}:
 *  delete:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Image
 *    summary: Delete an image by ID
 *    description: Delete an existing image by specifying the image ID
 *    parameters:
 *      - in: path
 *        name: imageId
 *        type: string
 *        format: uuid
 *        example: 0de70710-6b44-4df9-a158-a8f1f91714e5
 *        required: true
 *    responses:
 *      '204':
 *        description: Image deleted successfully
 *      '400':
 *        description: Image id not provided | Image not found
 *      '401':
 *        description: Access denied due to lack of authentication token
 *      '403':
 *        description: Invalid authentication token
 *      '429':
 *        description: Too many requests
 *      '500':
 *        description: Error deleting image
 */

router.delete(
  "/delete/:imageId",
  isUserAuthenticated,
  setContext,
  imageController.deleteImage
);

module.exports = router;
