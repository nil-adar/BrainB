
import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authService } from "@/services/authService";

interface LoginFormProps {
  translations: {
    idNumber: string;
    password: string;
    login: string;
    register: string;
    forgot: string;
    reset: string;
    errors: {
      invalidCredentials: string;
      missingFields: string;
    };
  };
  isRTL: boolean;
}

export const LoginForm = ({ translations: t, isRTL }: LoginFormProps) => {
  const [uniqueId, setUniqueId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: (credentials: { uniqueId: string; password: string }) =>
      authService.login(credentials),
    onSuccess: (data) => {
      if (data.user) {
        // Store user data in localStorage for persistence
        localStorage.setItem('user', JSON.stringify(data.user));
        
        toast.success(isRTL ? `ברוך הבא, ${data.user.name}!` : `Welcome, ${data.user.name}!`, {
          className: isRTL ? "rtl" : "ltr"
        });
        
        // Navigate based on user role
        switch (data.user.role) {
          case 'admin':
            navigate('/dashboard');
            break;
          case 'teacher':
            navigate('/dashboard');
            break;
          case 'parent':
            navigate('/parent-dashboard');
            break;
          case 'student':
            navigate('/student-dashboard');
            break;
          default:
            navigate('/dashboard');
        }
      } else if (data.error) {
        toast.error(data.error, {
          className: isRTL ? "rtl" : "ltr"
        });
      } else {
        toast.error(t.errors.invalidCredentials, {
          className: isRTL ? "rtl" : "ltr"
        });
      }
    },
    onError: () => {
      toast.error(t.errors.invalidCredentials, {
        className: isRTL ? "rtl" : "ltr"
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uniqueId || !password) {
      toast.error(t.errors.missingFields, {
        className: isRTL ? "rtl" : "ltr"
      });
      return;
    }

    loginMutation.mutate({ uniqueId, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <Input
          type="text"
          placeholder={t.idNumber}
          value={uniqueId}
          onChange={(e) => setUniqueId(e.target.value)}
          className="w-full px-4 py-2 bg-gray-50/70 border rounded-lg"
          dir={isRTL ? "rtl" : "ltr"}
          required
        />
      </div>

      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder={t.password}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 bg-gray-50/70 border rounded-lg"
          dir={isRTL ? "rtl" : "ltr"}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center`}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5 text-gray-400" />
          ) : (
            <Eye className="h-5 w-5 text-gray-400" />
          )}
        </button>
      </div>

      <Button
        type="submit"
        className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-full flex items-center justify-center gap-2 ${
          isRTL ? 'flex-row-reverse' : ''
        }`}
        disabled={loginMutation.isPending}
      >
        <span>
          {loginMutation.isPending 
            ? (isRTL ? "מתחבר..." : "Logging in...") 
            : t.login}
        </span>
        <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
      </Button>

      <div className="text-center space-y-2">
        <button 
          onClick={() => navigate("/register")} 
          className="text-blue-600 hover:underline"
        >
          {t.register}
        </button>
        <div className="text-gray-600 text-sm">
          {t.forgot}{" "}
          <button className="text-blue-600 hover:underline">
            {t.reset}
          </button>
        </div>
      </div>
    </form>
  );
};
