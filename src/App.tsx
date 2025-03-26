
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import { ThemeToggle } from "./components/ThemeToggle";
import LandingPage from "./pages/LandingPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" expand={true} richColors />
      <Router>
        <div className="min-h-screen bg-background text-foreground">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<TeacherDashboard />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/parent-dashboard" element={<ParentDashboard />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/nutritional-recommendations" element={<NutritionalRecommendations />} />
            <Route path="/physical-recommendations" element={<PhysicalRecommendations />} />
            <Route path="/create-assessment" element={<CreateAssessment />} />
            <Route path="/daily-tasks" element={<DailyTasks />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/student/:id" element={<StudentDetails />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ThemeToggle />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
