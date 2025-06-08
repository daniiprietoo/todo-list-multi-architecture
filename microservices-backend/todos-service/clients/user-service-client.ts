import axios from "axios";

const USERS_SERVICE_URL =
  process.env.USERS_SERVICE_URL || "http://localhost:4001";

export async function getUserById(userId: number) {
  try {
    const response = await axios.get(`${USERS_SERVICE_URL}/users/${userId}`);
    return response.data?.data || null;
  } catch (error) {
    // If 404, return null; otherwise, rethrow
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}
