import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { Login } from "@/pages/Login";
import TeacherDashboard from "./pages/TeacherDashboard";
import CreateAssessment from "./pages/CreateAssessment";
import DailyTasks from "./pages/DailyTasks";
import Statistics from "./pages/Statistics";
import StudentDetails from "./pages/StudentDetails";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import Recommendations from "./pages/Recommendations";
import NutritionalRecommendations from "./pages/NutritionalRecommendations";
import PhysicalRecommendations from "./pages/PhysicalRecommendations";
import EnvironmentalRecommendations from "./pages/EnvironmentalRecommendations";
import { ThemeToggle } from "./components/ThemeToggle";
import LandingPage from "./pages/LandingPage";
import { useEffect } from "react";

import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import React from "react";
import QuestionnaireFormPage from "@/pages/QuestionnaireFormPage";
import { SettingsProvider } from "@/components/SettingsContext";
import SettingsToggle from "@/components/SettingsToggle";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // כאן אפשר לקרוא לשרת כדי לבדוק מי המשתמש המחובר
      axios
        .get("http://localhost:5000/api/users/me")

        .then((res) => {
          console.log("🟢 מחובר כ:", res.data);
        })
        .catch((err) => {
          console.error("🔴 שגיאה באימות הטוקן:", err.response?.data?.message);
        });
    }
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" expand={true} richColors />
      <SettingsProvider>
        <Router>
          <div className="fixed bottom-3 right-4 flex space-x-2 z-1000">
            {/* כפתורי הגלובוס והירח/שמש */}
            <SettingsToggle />
            <ThemeToggle />
          </div>
          <div className="min-h-screen bg-background text-foreground">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
              <Route path="/student-dashboard" element={<StudentDashboard />} />
              <Route path="/parent-dashboard" element={<ParentDashboard />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route
                path="/nutritional-recommendations"
                element={<NutritionalRecommendations />}
              />
              <Route
                path="/physical-recommendations"
                element={<PhysicalRecommendations />}
              />
              <Route
                path="/Environmental-recommendations"
                element={<EnvironmentalRecommendations />}
              />
              <Route path="/create-assessment" element={<CreateAssessment />} />
              <Route
                path="/daily-tasks/:teacherId/:classId"
                element={<DailyTasks />}
              />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/settings" element={<Settings />} />
              <Route
                path="/questionnaire/:role/:studentId"
                element={<QuestionnaireFormPage />} /* דף השאלון הגנרי */
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </SettingsProvider>
    </QueryClientProvider>
  );
}

export default App;
