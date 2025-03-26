
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

export const mongoService = {
  /**
   * בודק אם השרת מחובר למסד הנתונים
   */
  checkConnection: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/status`);
      return {
        isConnected: response.data.dbConnection === 'connected',
        status: response.data
      };
    } catch (error) {
      console.error('Error checking MongoDB connection:', error);
      return {
        isConnected: false,
        error
      };
    }
  },

  /**
   * מעדכן את מחרוזת החיבור של MongoDB בזמן ריצה
   */
  setConnectionString: async (uri: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/mongo/config`, { uri });
      return {
        success: response.data.success,
        message: response.data.message,
        status: response.data
      };
    } catch (error) {
      console.error('Error setting MongoDB URI:', error);
      return {
        success: false,
        message: 'Failed to update MongoDB connection',
        error
      };
    }
  }
};
