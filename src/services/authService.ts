/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthResponse, User } from "@/types/school";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";

export const authService = {
  login: async (credentials: {
    uniqueId: string;
    password: string;
  }): Promise<AuthResponse> => {
    try {
      const currentLang = localStorage.getItem("language") || "en";

      const response = await axios.post(
        `${API_BASE_URL}/auth/login`,
        credentials,
        {
          headers: {
            "Accept-Language": currentLang,
          },
        }
      );
      const { user, token } = response.data;

      localStorage.setItem("token", token);
      return { user };
    } catch (error: any) {
      return {
        user: null,
        error: error.response?.data?.message || "LOGIN_ERROR",
      };
    }
  },

  getUserRole: async (userId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
      return response.data.role;
    } catch (error) {
      console.error("Error getting user role:", error);
      return null;
    }
  },

  resetInit: (data: { uniqueId: string; phone: string }) =>
    axios
      .post(`${API_BASE_URL}/auth/reset-password/init`, data)
      .then((r) => r.data),

  resetComplete: (data: { resetToken: string; newPassword: string }) =>
    axios
      .post(`${API_BASE_URL}/auth/reset-password/complete`, data)
      .then((r) => r.data),

  registerUser: async (userData: Partial<User>): Promise<AuthResponse> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/register`,
        userData
      );
      const { user, token } = response.data;

      localStorage.setItem("token", token);
      return { user };
    } catch (error: any) {
      return {
        user: null,
        error: error.response?.data?.message || "REGISTER_ERROR",
      };
    }
  },
};
