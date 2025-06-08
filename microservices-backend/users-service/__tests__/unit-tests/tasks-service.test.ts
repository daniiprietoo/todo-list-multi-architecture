import {
  createTaskService,
  getTasksService,
  getTaskByIdService,
  updateTaskService,
  deleteTaskService,
} from "../../services/tasks-service";
import * as tasksRepo from "../../repositories/tasks-repositories";
import * as usersRepo from "../../repositories/users-repository";

jest.mock("../repositories/tasks-repositories");
jest.mock("../repositories/users-repository");

describe("tasks-service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createTaskService", () => {
    it("should throw NotFoundError if user does not exist", async () => {
      (usersRepo.getUserById as jest.Mock).mockResolvedValue(null);
      await expect(
        createTaskService({ title: "T", description: "D", userId: 1 }, 1)
      ).rejects.toThrow("User not found");
    });

    it("should throw AppError if task creation fails", async () => {
      (usersRepo.getUserById as jest.Mock).mockResolvedValue({ id: 1 });
      (tasksRepo.createTask as jest.Mock).mockResolvedValue(null);
      await expect(
        createTaskService({ title: "T", description: "D", userId: 1 }, 1)
      ).rejects.toThrow("Failed to create task");
    });

    it("should return the new task on success", async () => {
      (usersRepo.getUserById as jest.Mock).mockResolvedValue({ id: 1 });
      const newTask = { id: 1, title: "T", description: "D", userId: 1 };
      (tasksRepo.createTask as jest.Mock).mockResolvedValue(newTask);
      const result = await createTaskService(
        { title: "T", description: "D", userId: 1 },
        1
      );
      expect(result).toEqual(newTask);
    });
  });

  describe("getTasksService", () => {
    it("should throw NotFoundError if user does not exist", async () => {
      (usersRepo.getUserById as jest.Mock).mockResolvedValue(null);
      await expect(getTasksService(1)).rejects.toThrow("User not found");
    });

    it("should return tasks for the user", async () => {
      (usersRepo.getUserById as jest.Mock).mockResolvedValue({ id: 1 });
      const tasks = [{ id: 1, title: "T", description: "D", userId: 1 }];
      (tasksRepo.getTasks as jest.Mock).mockResolvedValue(tasks);
      const result = await getTasksService(1);
      expect(result).toEqual(tasks);
    });
  });

  describe("getTaskByIdService", () => {
    it("should throw NotFoundError if task does not exist", async () => {
      (tasksRepo.getTaskById as jest.Mock).mockResolvedValue(null);
      await expect(getTaskByIdService(1)).rejects.toThrow("Task not found");
    });

    it("should return the task if found", async () => {
      const task = { id: 1, title: "T", description: "D", userId: 1 };
      (tasksRepo.getTaskById as jest.Mock).mockResolvedValue(task);
      const result = await getTaskByIdService(1);
      expect(result).toEqual(task);
    });
  });

  describe("updateTaskService", () => {
    it("should throw NotFoundError if task does not exist", async () => {
      (tasksRepo.getTaskById as jest.Mock).mockResolvedValue(null);
      await expect(
        updateTaskService({ title: "T", description: "D" }, 1, 1)
      ).rejects.toThrow("Task not found");
    });

    it("should throw ForbiddenError if user is not the owner", async () => {
      (tasksRepo.getTaskById as jest.Mock).mockResolvedValue({
        id: 1,
        userId: 2,
      });
      await expect(
        updateTaskService({ title: "T", description: "D" }, 1, 1)
      ).rejects.toThrow("Unauthorized to update this task");
    });

    it("should throw NotFoundError if update fails", async () => {
      (tasksRepo.getTaskById as jest.Mock).mockResolvedValue({
        id: 1,
        userId: 1,
      });
      (tasksRepo.updateTask as jest.Mock).mockResolvedValue(null);
      await expect(
        updateTaskService({ title: "T", description: "D" }, 1, 1)
      ).rejects.toThrow("Task not found or failed to update");
    });

    it("should return updated task on success", async () => {
      const updatedTask = { id: 1, title: "T", description: "D", userId: 1 };
      (tasksRepo.getTaskById as jest.Mock).mockResolvedValue({
        id: 1,
        userId: 1,
      });
      (tasksRepo.updateTask as jest.Mock).mockResolvedValue(updatedTask);
      const result = await updateTaskService(
        { title: "T", description: "D" },
        1,
        1
      );
      expect(result).toEqual(updatedTask);
    });
  });

  describe("deleteTaskService", () => {
    it("should throw NotFoundError if task does not exist", async () => {
      (tasksRepo.getTaskById as jest.Mock).mockResolvedValue(null);
      await expect(deleteTaskService(1)).rejects.toThrow("Task not found");
    });

    it("should throw NotFoundError if delete fails", async () => {
      (tasksRepo.getTaskById as jest.Mock).mockResolvedValue({ id: 1 });
      (tasksRepo.deleteTask as jest.Mock).mockResolvedValue(false);
      await expect(deleteTaskService(1)).rejects.toThrow(
        "Task not found or failed to delete"
      );
    });

    it("should resolve if delete succeeds", async () => {
      (tasksRepo.getTaskById as jest.Mock).mockResolvedValue({ id: 1 });
      (tasksRepo.deleteTask as jest.Mock).mockResolvedValue(true);
      await expect(deleteTaskService(1)).resolves.toBeUndefined();
    });
  });
});
