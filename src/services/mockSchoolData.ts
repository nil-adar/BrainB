
import { AuthResponse, LoginCredentials } from "@/types/school";
import { studentService } from "./studentService";
import { parentService } from "./parentService";
import { taskService } from "./taskService";
import { authService } from "./authService";
import { externalAssessmentService } from "./externalAssessmentService";
import { teacherService } from "./teacherService";

export const schoolDataService = {
  ...studentService,
  ...parentService,
  ...taskService,
  ...authService,
  ...externalAssessmentService,
  ...teacherService
};
