import { createUser, getUserByEmail } from "../repositories/users-repository";
import { NewUser, UserWithoutPassword } from "../schema/schema";
import { AppError, ConflictError, UnauthorizedError } from "../utils/errors";
import bcrypt from "bcrypt";

export async function registerUserService(
  user: NewUser
): Promise<UserWithoutPassword> {
  const existingUser = await getUserByEmail(user.email);

  if (existingUser) {
    throw new ConflictError("❌ Email already registered");
  }

  const newUser = await createUser(user);

  if (!newUser) {
    throw new AppError("❌ Failed to create user", 400);
  }

  const userWithoutPassword: UserWithoutPassword = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    createdAt: newUser.createdAt,
    updatedAt: newUser.updatedAt,
  };
  return userWithoutPassword;
}

export async function loginUserService({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<UserWithoutPassword> {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new UnauthorizedError("❌ Invalid Credentials");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new UnauthorizedError("❌ Invalid Credentials");
  }

  const userWithoutPassword: UserWithoutPassword = {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return userWithoutPassword;
}

