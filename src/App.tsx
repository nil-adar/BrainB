import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { Login } from "@/pages/Login";
import Register from "./pages/Register";
import LandingPage from "./pages/LandingPage";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { ThemeToggle } from "./components/ThemeToggle";

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
