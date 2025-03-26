
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { statisticsService, StatisticsData } from '../services/statisticsService';

export const useStatistics = () => {
  const queryClient = useQueryClient();

  // שליפת כל הסטטיסטיקות
  const { data: statistics, isLoading, error } = useQuery({
    queryKey: ['statistics'],
    queryFn: async () => {
      const response = await statisticsService.getAllStatistics();
      if (!response.success) {
        throw new Error(response.error);
      }
      return response.data;
    },
  });

  // יצירת סטטיסטיקה חדשה
  const createMutation = useMutation({
    mutationFn: (newData: Omit<StatisticsData, 'id'>) => 
      statisticsService.createStatistics(newData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['statistics'] });
    },
  });

  // עדכון סטטיסטיקה
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<StatisticsData> }) =>
      statisticsService.updateStatistics(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['statistics'] });
    },
  });

  // מחיקת סטטיסטיקה
  const deleteMutation = useMutation({
    mutationFn: (id: string) => statisticsService.deleteStatistics(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['statistics'] });
    },
  });

  return {
    statistics,
    isLoading,
    error,
    createStatistics: createMutation.mutate,
    updateStatistics: updateMutation.mutate,
    deleteStatistics: deleteMutation.mutate,
  };
};
