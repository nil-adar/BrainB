
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PasswordInputProps {
  placeholder: string;
  name: "password" | "confirmPassword";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isRTL: boolean;
  required?: boolean;
}

export const PasswordInput = ({ 
  placeholder, 
  name, 
  value, 
  onChange, 
  isRTL, 
  required = true 
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 bg-gray-50 border rounded-lg text-right"
        dir={isRTL ? "rtl" : "ltr"}
        required={required}
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
  );
};
