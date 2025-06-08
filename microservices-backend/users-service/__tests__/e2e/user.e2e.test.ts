import request from "supertest";
import app from "../../index";
import db from "../../drizzle";
import { sql } from "drizzle-orm";
import { execSync } from "child_process";
import "dotenv/config";


beforeAll(async () => {
  execSync("npx drizzle-kit push", { stdio: "inherit" });
});

afterEach(async () => {
  await db.execute(sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE;`);
  await db.execute(sql`ALTER SEQUENCE users_id_seq RESTART WITH 1;`);
});

afterAll(async () => {
  await db.$client.end();
});

describe("User E2E Registration Tests", () => {
  it("should register a new user", async () => {
    const response = await request(app).post("/api/users/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "Password1!",
      passwordConfirmation: "Password1!",
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("✅ User registered successfully");
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data).not.toHaveProperty("password");
    expect(response.body.data).toHaveProperty("email");
    expect(response.body.data).toHaveProperty("name");
    expect(response.body.data).toHaveProperty("createdAt");
    expect(response.body.data).toHaveProperty("updatedAt");
  });

  it("should not register a new user with invalid password", async () => {
    const response = await request(app).post("/api/users/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password1!",
      passwordConfirmation: "password1!",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("❌ Invalid input");
  });

  it("should not register a new user with invalid email", async () => {
    const response = await request(app).post("/api/users/register").send({
      name: "Test User",
      email: "test@example",
      password: "Password1!",
      passwordConfirmation: "Password1!",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("❌ Invalid input");
  });

  it("should not register a new user with invalid name", async () => {
    const response = await request(app).post("/api/users/register").send({
      name: "",
      email: "test@example.com",
      password: "Password1!",
      passwordConfirmation: "Password1!",
    });
  });

  it("should not register a new user with invalid password confirmation", async () => {
    const response = await request(app).post("/api/users/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "Password1!",
      passwordConfirmation: "Password2!",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("❌ Invalid input");
  });

  it("should not register a new user with an already registered email", async () => {
    await request(app).post("/api/users/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "Password1!",
      passwordConfirmation: "Password1!",
    });

    const response = await request(app).post("/api/users/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "Password1!",
      passwordConfirmation: "Password1!",
    });

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("❌ Email already registered");
  });  
});

describe("User E2E Login Tests", () => {
  beforeEach(async () => {
    await request(app).post("/api/users/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "Password1!",
      passwordConfirmation: "Password1!",
    });
  });

  it("should login a new user", async () => {
    const response = await request(app).post("/api/users/login").send({
      email: "test@example.com",
      password: "Password1!",
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("✅ User logged in successfully");
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data).not.toHaveProperty("password");
    expect(response.body.data).toHaveProperty("email");
    expect(response.body.data).toHaveProperty("name");
    expect(response.body.data).toHaveProperty("createdAt");
    expect(response.body.data).toHaveProperty("updatedAt");
  });

  it("should not login a new user with invalid email", async () => {
    const response = await request(app).post("/api/users/login").send({
      email: "test@example",
      password: "Password1!",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("❌ Invalid input");
  });

  it("should not login a new user with invalid password", async () => {
    const response = await request(app).post("/api/users/login").send({
      email: "test@example.com",
      password: "Password2!",
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("❌ Invalid Credentials");
  });

  it("should not login a new user with invalid email and password", async () => {
    const response = await request(app).post("/api/users/login").send({
      email: "test@example",
      password: "Password2!",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("❌ Invalid input");
  });
});
