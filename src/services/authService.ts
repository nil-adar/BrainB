
import { AuthResponse, User } from "@/types/school";
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

export const authService = {
  login: async (credentials: { uniqueId: string; password: string }): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/login`, credentials);
      return { user: response.data };
    } catch (error: any) {
      return { 
        user: null, 
        error: error.response?.data?.message || "אירעה שגיאה בהתחברות. נסה שנית." 
      };
    }
  },

  getUserRole: async (userId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
      return response.data.role;
    } catch (error) {
      console.error('Error getting user role:', error);
      return null;
    }
  },

  registerUser: async (userData: Partial<User>): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/register`, userData);
      return { user: response.data };
    } catch (error: any) {
      return { 
        user: null, 
        error: error.response?.data?.message || "אירעה שגיאה בהרשמה. נסה שנית." 
      };
    }
  }
};
