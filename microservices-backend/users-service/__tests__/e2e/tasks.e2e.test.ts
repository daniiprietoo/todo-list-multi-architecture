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
  await db.execute(sql`TRUNCATE TABLE todos RESTART IDENTITY CASCADE;`);
  await db.execute(sql`ALTER SEQUENCE users_id_seq RESTART WITH 1;`);
  await db.execute(sql`ALTER SEQUENCE todos_id_seq RESTART WITH 1;`);
});

afterAll(async () => {
  await db.$client.end();
});

describe("Task E2E Tests", () => {
  beforeEach(async () => {
    await request(app).post("/api/users/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "Password1!",
      passwordConfirmation: "Password1!",
    }); 
  });

  it("should create a new task", async () => {
    const response = await request(app).post("/api/tasks").send({
      title: "Test Task",
      description: "Test Description",
      userId: 1,
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("✅ Task created successfully");
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data).toHaveProperty("title");
    expect(response.body.data).toHaveProperty("description");
    expect(response.body.data).toHaveProperty("userId");
    expect(response.body.data).toHaveProperty("completed");
    expect(response.body.data).toHaveProperty("createdAt");
    expect(response.body.data).toHaveProperty("updatedAt");
  });

  it("should not create a new task with invalid title", async () => {
    const response = await request(app).post("/api/tasks").send({
      title: "",
      description: "Test Description",
      userId: 1,
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("❌ Invalid input");
  });


  it("should not create a new task with invalid userId", async () => {
    const response = await request(app).post("/api/tasks").send({
      title: "Test Task",
      description: "Test Description",
      userId: 0,
    });

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("❌ User not found");
  });
});
