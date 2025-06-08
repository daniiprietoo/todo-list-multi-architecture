import db from "../drizzle";
import bcrypt from "bcrypt";
import { users, type User, type NewUser } from "../schema/schema";
import { eq } from "drizzle-orm";

export async function createUser(user: NewUser): Promise<User | null> {
  const { name, email, password } = user;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await db
    .insert(users)
    .values({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
  if (newUser.length === 0) {
    return null;
  }
  return newUser[0];
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const user = await db.select().from(users).where(eq(users.email, email));
  if (user.length === 0) {
    return null;
  }
  return user[0];
}

export async function getUserById(userId: number): Promise<User | null> {
  const user = await db.select().from(users).where(eq(users.id, userId));
  if (user.length === 0) {
    return null;
  }
  return user[0];
}
