import confirmPasswordController from "@/controllers/confirmpassword.controller";
import resetPasswordController from "@/controllers/resetpassword.controller";
import { logoutController } from "@/controllers/logout.controller";
import SignupController from "@/controllers/signup.controller";
import { userController } from "@/controllers/user.controller";
import verifyController from "@/controllers/verify.controller";
import { Router } from "express";
import passport from "passport";
import {
  isAuthenticated,
  isUnAuthenticated,
} from "@/middlewares/auth.middleware";

const routes = Router();

/**
 * @swagger
 * /api/signin:
 *   post:
 *     summary: Log in a user.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User logged in successfully.
 *       401:
 *         description: Authentication failed.
 */

routes.post(
  "/signin",
  isUnAuthenticated,
  passport.authenticate("local"),
  (_req, res) => {
    res.send("logged in");
  }
);

/**
 * @swagger
 * /api/signup:
 *   post:
 *     summary: Register a new user.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               fullName:
 *                 type: string
 *               profilePic:
 *                 type: string
 *               userRoles:
 *                 type: array
 *                 items:
 *                   type: string
 *             required:
 *               - email
 *               - password
 *               - fullName
 *               - profilePic
 *               - userRoles
 *     responses:
 *       200:
 *         description: User registration successful.
 *       403:
 *         description: Email already exists.
 *       500:
 *         description: Internal server error.
 */

routes.post("/signup", isUnAuthenticated, SignupController);

/**
 * @swagger
 * /api/verify:
 *   put:
 *     summary: Verify a user by code.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *             required:
 *               - code
 *     responses:
 *       200:
 *         description: User verified successfully.
 *       406:
 *         description: Session expired or invalid code.
 */

routes.put("/verify", isUnAuthenticated, verifyController);

/**
 * @swagger
 * /api/verify/{code}:
 *   get:
 *     summary: Verify a user by code.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         description: Verification code received via email.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User verified successfully.
 *       406:
 *         description: Session expired or invalid code.
 */

routes.get("/verify/:code", isUnAuthenticated, verifyController);

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get user information.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: User information retrieved successfully.
 *       401:
 *         description: Unauthorized.
 */

routes.get("/user", isAuthenticated, userController);

/**
 * @swagger
 * /api/resetpassword:
 *   post:
 *     summary: Initiate the password reset process.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Password reset instructions sent to the provided email (if it exists).
 *       400:
 *         description: Bad request or something went wrong.
 */

routes.post("/resetpassword", isUnAuthenticated, resetPasswordController);

/**
 * @swagger
 * /api/confirmresetpassword:
 *   post:
 *     summary: Confirm the reset of the user's password.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *             required:
 *               - code
 *               - password
 *               - confirmPassword
 *     responses:
 *       200:
 *         description: Password reset successful. Log in with your new password.
 *       403:
 *         description: Passwords don't match.
 *       500:
 *         description: Internal server error or something went wrong.
 */

routes.post(
  "/confirmresetpassword",
  isUnAuthenticated,
  confirmPasswordController
);

/**
 * @swagger
 * /api/logout:
 *   delete:
 *     summary: Log out the authenticated user.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: User logged out successfully.
 *       404:
 *         description: Failed to log out.
 */

routes.delete("/logout", isAuthenticated, logoutController);

export default routes;
