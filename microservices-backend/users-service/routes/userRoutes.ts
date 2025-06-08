import { Router } from "express";
import {
  registerUserController,
  loginUserController,
  logoutUserController,
  getUserByIdController,
} from "../controllers/user-controller";

const router = Router();

/**
 * @openapi
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               passwordConfirmation:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *               - password
 *               - passwordConfirmation
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post("/register", registerUserController);

/**
 * @openapi
 * /api/users/login:
 *   post:
 *     summary: Login a user
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
 *         description: User logged in successfully
 */
router.post("/login", loginUserController);

/**
 * @openapi
 * /api/users/logout:
 *   get:
 *     summary: Logout a user
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
router.get("/logout", logoutUserController);

/**
 * @openapi
 * /api/users/{userId}:
 *   get:
 *     summary: Get a user by ID
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user to fetch
 *     responses:
 *       200:
 *         description: User fetched successfully
 *       404:
 *         description: User not found
 */
router.get("/users/:userId", getUserByIdController);

export default router;
