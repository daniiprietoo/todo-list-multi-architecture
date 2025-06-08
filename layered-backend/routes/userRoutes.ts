import { Router } from "express";
import {
  registerUserController,
  loginUserController,
  logoutUserController,
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

export default router;
