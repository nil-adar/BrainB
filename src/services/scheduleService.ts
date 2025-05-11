import axios from "axios";

export interface ScheduleItem {
  time: string;
  subject?: string;
  topic?: string;  // הוסף את השדה topic (מקצוע)
  room: string;
  isPersonal?: boolean;
  notes?: string;
}
const scheduleService = {
  getTeacherScheduleForDay: async (teacherId: string, date: Date) => {
    const formattedDate = date.toISOString().split("T")[0];
    const response = await axios.get(`/api/schedule/${teacherId}?date=${formattedDate}`);
    return response.data;
  },
};

export default scheduleService;
