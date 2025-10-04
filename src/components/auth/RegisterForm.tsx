import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
import { validateRegistrationForm } from "@/utils/formValidation";
import { FormField } from "./forms/FormField";
import { PasswordInput } from "./PasswordInput";
import { RoleSelector } from "./forms/RoleSelector";
import { SubmitButton } from "./forms/SubmitButton";
import { LoginLink } from "./forms/LoginLink";

interface RegisterFormProps {
  translations: {
    uniqueId: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    roleTypes: {
      student: string;
      parent: string;
      teacher: string;
      admin: string;
    };
    password: string;
    confirmPassword: string;
    submit: string;
    loginLink: string;
    errors: {
      idNotFound: string;
      idExists: string;
      passwordMismatch: string;
      requiredFields: string;
      passwordLength: string;
      invalidEmail: string;
      invalidPhone: string;
    };
    success: {
      register: string;
      redirect: string;
    };
  };
  isRTL: boolean;
  language: "en" | "he";
}
export const RegisterForm = ({
  translations: t,
  isRTL,
  language,
}: RegisterFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    uniqueId: "",
    role: "student" as "student" | "parent" | "teacher" | "admin",
  });
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (
    value: "student" | "parent" | "teacher" | "admin"
  ) => {
    setFormData((prev) => ({
      ...prev,
      role: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setEmailError("");
    setPhoneError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^05\d-?\d{7}$/;

    let isValid = true;

    if (!emailRegex.test(formData.email)) {
      setEmailError("האימייל לא תקין. לדוגמה: user@school.com");
      isValid = false;
    }

    if (!phoneRegex.test(formData.phone)) {
      setPhoneError("מספר טלפון לא תקין. לדוגמה: 05X-XXXXXXX");
      isValid = false;
    }

    if (!isValid) return;

    setIsLoading(true);
    try {
      const { confirmPassword, ...userData } = formData;

      const response = await authService.registerUser(userData);

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success(t.success.register);
        setTimeout(() => {
          toast(t.success.redirect);
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      toast.error(
        language === "he"
          ? "אירעה שגיאה בתהליך ההרשמה. נסה שוב מאוחר יותר"
          : "An error occurred during registration. Please try again later"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        type="text"
        name="uniqueId"
        placeholder={t.uniqueId}
        value={formData.uniqueId}
        onChange={handleInputChange}
        dir={isRTL ? "rtl" : "ltr"}
        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-right"
      />

      <FormField
        type="text"
        name="name"
        placeholder={t.name}
        value={formData.name}
        onChange={handleInputChange}
        dir={isRTL ? "rtl" : "ltr"}
        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-right"
      />

      <FormField
        type="email"
        name="email"
        placeholder="user@school.com"
        value={formData.email}
        onChange={handleInputChange}
        dir={isRTL ? "rtl" : "ltr"}
        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-right"
      />
      {emailError && (
        <p className="text-red-500 text-sm mt-1 text-right">{emailError}</p>
      )}

      <FormField
        type="tel"
        name="phone"
        placeholder="05X-XXXXXXX"
        value={formData.phone}
        onChange={handleInputChange}
        dir={isRTL ? "rtl" : "ltr"}
        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-right"
      />
      {phoneError && (
        <p className="text-red-500 text-sm mt-1 text-right">{phoneError}</p>
      )}

      <RoleSelector
        value={formData.role}
        onChange={handleSelectChange}
        placeholder={t.role}
        options={t.roleTypes}
        isRTL={isRTL}
      />

      <PasswordInput
        placeholder={t.password}
        name="password"
        value={formData.password}
        onChange={handleInputChange}
        isRTL={isRTL}
      />

      <PasswordInput
        placeholder={t.confirmPassword}
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleInputChange}
        isRTL={isRTL}
      />

      <SubmitButton
        isLoading={isLoading}
        text={t.submit}
        loadingText={language === "he" ? "...מתבצעת הרשמה" : "Registering..."}
        isRTL={isRTL}
      />

      <LoginLink text={t.loginLink} />
    </form>
  );
};
