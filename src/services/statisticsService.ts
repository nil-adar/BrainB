
import { dataService, DataResponse } from './dataService';

export interface StatisticsData {
  id: string;
  value: number;
  label: string;
  date: string;
}

export const statisticsService = {
  // שליפת כל הסטטיסטיקות
  async getAllStatistics(): Promise<DataResponse<StatisticsData[]>> {
    return await dataService.getData<StatisticsData[]>('/statistics');
  },

  // שליפת סטטיסטיקה ספציפית
  async getStatisticsById(id: string): Promise<DataResponse<StatisticsData>> {
    return await dataService.getData<StatisticsData>(`/statistics/${id}`);
  },

  // שמירת סטטיסטיקה חדשה
  async createStatistics(data: Omit<StatisticsData, 'id'>): Promise<DataResponse<StatisticsData>> {
    return await dataService.saveData<StatisticsData>('/statistics', data as StatisticsData);
  },

  // עדכון סטטיסטיקה קיימת
  async updateStatistics(id: string, data: Partial<StatisticsData>): Promise<DataResponse<StatisticsData>> {
    return await dataService.updateData<StatisticsData>(`/statistics/${id}`, data as StatisticsData);
  },

  // מחיקת סטטיסטיקה
  async deleteStatistics(id: string): Promise<DataResponse<void>> {
    return await dataService.deleteData(`/statistics/${id}`);
  },
};
