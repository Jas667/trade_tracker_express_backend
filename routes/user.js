const express = require("express");
const router = express.Router();

//import the user controller
const userController = require("../controllers/userControllers");
const { setContext } = require("../middleware/setContext");
const { isUserAuthenticated } = require("../authorisation/isUserAuthenticated");
const { userLimiter } = require("../middleware/rateLimiter");

/**
 * @swagger
 * /user:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Users
 *    summary: Get user by ID
 *    description: Retrieve a user by ID
 *    produces:
 *      - application/json
 *    responses:
 *      '200':
 *        description: User found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "User found"
 *                data:
 *                  type: object
 *                  properties:
 *                    user:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: string
 *                          format: uuid
 *                        username:
 *                          type: string
 *                        first_name:
 *                          type: string
 *                        profile_picture:
 *                          type: string
 *      '400':
 *        description: User not found
 *      '403':
 *        description: You cannot view this user
 *      '401':
 *        description: Access denied due to lack of authentication token
 *      '429':
 *        description: Too many requests
 *      '500':
 *        description: Error getting user or Internal server error occurred
 */
router.get("/", isUserAuthenticated, setContext, userController.getUserById);

/**
 * @swagger
 * /user/register:
 *  post:
 *    tags:
 *      - Users
 *    summary: Register a new user
 *    description: Register a new user
 *    produces:
 *      - application/json
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *                example: User1
 *              password:
 *                type: string
 *                example: password123
 *              email:
 *                type: string
 *                format: email
 *                example: user@email.com
 *              first_name:
 *                type: string
 *                example: John
 *              last_name:
 *                type: string
 *                example: Doe
 *          required:
 *            - username
 *            - password
 *            - email
 *            - first_name
 *            - last_name
 *    responses:
 *      '201':
 *        description: User created. Please log in.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "User created. Please log in."
 *                data:
 *                  type: object
 *      '400':
 *        description: Missing fields or Invalid fields or Email already exists or Username already exists
 *      '429':
 *        description: Too many requests
 *      '500':
 *        description: Error creating user or Internal server error occurred
 */
router.post("/register", userLimiter, userController.registerUser);

/**
 * @swagger
 * /user/login:
 *   post:
 *     tags:
 *       - Authentication/User Login
 *     summary: Login to the application
 *     produces:
 *       - application/json
 *     requestBody:
 *       description: Login credentials
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               identifier:
 *                 type: string
 *                 description: Email or username to identify the user
 *                 example: admin
 *               password:
 *                 type: string
 *                 description: Password for authentication
 *                 example: adminadmin
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logged in successfully"
 *                 data:
 *                   type: object
 *                   description: Data associated with the login response (currently empty)
 *       400:
 *         description: Authentication error. Can be incorrect password, user not found or missing fields.
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Error logging in
 *     description: |
 *       Endpoint to login to the application. Use the following test credentials for testing:
 *
 *       **Identifier (can be username or email)**: admin
 *
 *       **Password**: adminadmin
 */

router.post("/login", userLimiter, userController.loginUser);

/**
 * @swagger
 * /user/logout:
 *  post:
 *    tags:
 *      - Users
 *    summary: Logs out the current user and clear JWT token cookie
 *    description: Logs out the current user by clearing the token cookie
 *    produces:
 *      - application/json
 *    responses:
 *      '200':
 *        description: Logged out successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Logged out successfully"
 *                data:
 *                  type: object
 *      '429':
 *        description: Too many requests
 *      '500':
 *        description: Error logging out or Internal server error occurred
 */
router.post("/logout", isUserAuthenticated, userController.logoutUser);

/**
 * @swagger
 * paths:
 *  /user/update:
 *    put:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Users
 *      summary: Update details of a user
 *      description: Update details of a user. Only certain fields can be updated.
 *      requestBody:
 *        description: The user details to update
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                username:
 *                  type: string
 *                email:
 *                  type: string
 *                first_name:
 *                  type: string
 *                last_name:
 *                  type: string
 *                profile_picture:
 *                  type: string
 *      responses:
 *        '200':
 *          description: User updated successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "User updated"
 *                  data:
 *                    type: object
 *                    description: Additional data (currently empty)
 *        '400':
 *          description: User not found or Invalid input data
 *        '401':
 *          description: Access denied due to lack of authentication token
 *        '403':
 *          description: You cannot update this user
 *        '429':
 *          description: Too many requests
 *        '500':
 *          description: Error updating user or Internal server error occurred
 */

router.put(
  "/update/",
  isUserAuthenticated,
  setContext,
  userController.updateUser
);

/**
 * @swagger
 * paths:
 *  /user/password:
 *    put:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Users
 *      summary: Update the password of a user
 *      description: Allow a user to update their password by providing the old and new password.
 *      requestBody:
 *        description: Required old and new password fields
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - oldPassword
 *                - newPassword
 *              properties:
 *                oldPassword:
 *                  type: string
 *                  format: password
 *                  description: The current password that needs to be updated.
 *                  example: "oldPassword123"
 *                newPassword:
 *                  type: string
 *                  format: password
 *                  description: The new password, must be at least 8 characters long.
 *                  example: "newSecurePassword123"
 *      responses:
 *        '200':
 *          description: Password updated successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "Password updated"
 *        '400':
 *          description: Bad request, missing fields, or password constraints not met
 *        '401':
 *          description: Access denied due to lack of authentication token
 *        '403':
 *          description: Forbidden, cannot update password for the given user
 *        '429':
 *          description: Too many requests
 *        '500':
 *          description: Error updating password or Internal server error occurred
 */
router.put(
  "/password",
  isUserAuthenticated,
  setContext,
  userController.updatePassword
);

/**
 * @swagger
 * paths:
 *  /user/delete:
 *    delete:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Users
 *      summary: Delete a user
 *      description: Deletes a user's account based on the provided ID. The user can only delete their own account.
 *      responses:
 *        '204':
 *          description: User deleted successfully (No Content)
 *        '401':
 *          description: Access denied due to lack of authentication token
 *        '403':
 *          description: You cannot delete this user
 *        '500':
 *          description: Error deleting user or Internal server error occurred
 */
router.delete(
  "/delete/",
  isUserAuthenticated,
  setContext,
  userController.deleteUser
);

/**
 * @swagger
 * paths:
 *  /reset-password:
 *    put:
 *      tags:
 *        - Users
 *      summary: Reset User Password
 *      description: Sends a password reset email to the user if the provided email is associated with an account. The email contains a password reset token.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - email
 *              properties:
 *                email:
 *                  type: string
 *                  format: email
 *                  description: Email address of the user
 *      responses:
 *        '200':
 *          description: Password reset email sent successfully or user not found (for user privacy)
 *        '400':
 *          description: Invalid request data
 *        '500':
 *          description: Error sending password reset email or Internal server error occurred
 */
router.put("/reset-password", userController.resetPasswordEmail);

module.exports = router;
