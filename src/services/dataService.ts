
import api from './api';

export interface DataResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export const dataService = {
  // פונקציה גנרית לשליפת נתונים
  async getData<T>(endpoint: string): Promise<DataResponse<T>> {
    try {
      const response = await api.get<DataResponse<T>>(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return {
        success: false,
        data: {} as T,
        error: 'Failed to fetch data',
      };
    }
  },

  // פונקציה גנרית לשמירת נתונים
  async saveData<T>(endpoint: string, data: T): Promise<DataResponse<T>> {
    try {
      const response = await api.post<DataResponse<T>>(endpoint, data);
      return response.data;
    } catch (error) {
      console.error('Error saving data:', error);
      return {
        success: false,
        data: data,
        error: 'Failed to save data',
      };
    }
  },

  // פונקציה גנרית לעדכון נתונים
  async updateData<T>(endpoint: string, data: T): Promise<DataResponse<T>> {
    try {
      const response = await api.put<DataResponse<T>>(endpoint, data);
      return response.data;
    } catch (error) {
      console.error('Error updating data:', error);
      return {
        success: false,
        data: data,
        error: 'Failed to update data',
      };
    }
  },

  // פונקציה גנרית למחיקת נתונים
  async deleteData(endpoint: string): Promise<DataResponse<void>> {
    try {
      const response = await api.delete<DataResponse<void>>(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error deleting data:', error);
      return {
        success: false,
        data: undefined,
        error: 'Failed to delete data',
      };
    }
  },
};
