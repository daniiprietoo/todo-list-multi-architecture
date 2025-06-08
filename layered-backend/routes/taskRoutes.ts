import { Router } from "express";
import {
  createTaskController,
  deleteTaskController,
  getTasksController,
  updateTaskController,
} from "../controllers/tasks-controller";

const router = Router();

/**
 * @openapi
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               userId:
 *                 type: integer
 *             required:
 *               - title
 *               - description
 *               - userId
 *     responses:
 *       201:
 *         description: Task created successfully
 */
router.post("/", createTaskController);

/**
 * @openapi
 * /api/tasks/{userId}:
 *   get:
 *     summary: Get all tasks for a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of tasks
 */
router.get("/:userId", getTasksController);

/**
 * @openapi
 * /api/tasks/{taskId}:
 *   patch:
 *     summary: Update a task
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               completed:
 *                 type: boolean
 *               userId:
 *                 type: integer
 *             required:
 *               - title
 *               - description
 *               - userId
 *     responses:
 *       200:
 *         description: Task updated successfully
 */
router.patch("/:taskId", updateTaskController);

/**
 * @openapi
 * /api/tasks/{taskId}/complete:
 *   patch:
 *     summary: Mark a task as complete/incomplete
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               completed:
 *                 type: boolean
 *               userId:
 *                 type: integer
 *             required:
 *               - completed
 *               - userId
 *     responses:
 *       200:
 *         description: Task completion status updated
 */
router.patch("/:taskId/complete", updateTaskController);

/**
 * @openapi
 * /api/tasks/{taskId}:
 *   delete:
 *     summary: Delete a task
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *             required:
 *               - userId
 *     responses:
 *       200:
 *         description: Task deleted successfully
 */
router.delete("/:taskId", deleteTaskController);

export default router;
