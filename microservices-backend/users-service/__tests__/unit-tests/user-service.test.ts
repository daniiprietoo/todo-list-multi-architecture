import {
  loginUserService,
  registerUserService,
} from "../../services/user-service";
import * as userRepo from "../../repositories/users-repository";
import bcrypt from "bcrypt";

jest.mock("bcrypt");

jest.mock("../repositories/users-repository");

describe("registerUserService", () => {
  it("should throw ConflictError if email already exists", async () => {
    (userRepo.getUserByEmail as jest.Mock).mockResolvedValue({
      id: 1,
      email: "test@example.com",
    });
    await expect(
      registerUserService({
        name: "Test",
        email: "test@example.com",
        password: "Password1!",
      })
    ).rejects.toThrow("Email already registered");
  });

  it("should return user without password on success", async () => {
    (userRepo.getUserByEmail as jest.Mock).mockResolvedValue(null);
    (userRepo.createUser as jest.Mock).mockResolvedValue({
      id: 1,
      name: "Test",
      email: "test@example.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const user = await registerUserService({
      name: "Test",
      email: "test@example.com",
      password: "Password1!",
    });
    expect(user).toHaveProperty("id");
    expect(user).not.toHaveProperty("password");
  });
});

describe("loginUserService", () => {
  it("should throw UnauthorizedError if user does not exist", async () => {
    (userRepo.getUserByEmail as jest.Mock).mockResolvedValue(null);
    await expect(
      loginUserService({
        email: "test@example.com",
        password: "Password1!",
      })
    ).rejects.toThrow("Invalid Credentials");
  });

  it("should throw UnauthorizedError if password is incorrect", async () => {
    (userRepo.getUserByEmail as jest.Mock).mockResolvedValue({
      id: 1,
      email: "test@example.com",
      password: "Password1!",
    });
    await expect(
      loginUserService({
        email: "test@example.com",
        password: "Password2!",
      })
    ).rejects.toThrow("Invalid Credentials");
  });

  it("should return user without password on success", async () => {
    (userRepo.getUserByEmail as jest.Mock).mockResolvedValue({
      id: 1,
      email: "test@example.com",
      password: "Password1!",
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    const user = await loginUserService({
      email: "test@example.com",
      password: "Password1!",
    });
    expect(user).toHaveProperty("id");
    expect(user).not.toHaveProperty("password");
    expect(user).toHaveProperty("email");
    expect(user).toHaveProperty("name");
    expect(user).toHaveProperty("createdAt");
    expect(user).toHaveProperty("updatedAt");
  });
});
