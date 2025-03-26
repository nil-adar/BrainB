
import { toast } from "sonner";

export const validateRegistrationForm = (
  formData: {
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    uniqueId: string;
    role: string;
  },
  errorMessages: {
    requiredFields: string;
    passwordLength: string;
    passwordMismatch: string;
    invalidEmail: string;
    invalidPhone: string;
  }
) => {
  // Check required fields
  if (!formData.email || !formData.password || 
      !formData.confirmPassword || !formData.phone || 
      !formData.uniqueId || !formData.role) {
    toast.error(errorMessages.requiredFields);
    return false;
  }

  // Check password length
  if (formData.password.length < 6) {
    toast.error(errorMessages.passwordLength);
    return false;
  }

  // Check password match
  if (formData.password !== formData.confirmPassword) {
    toast.error(errorMessages.passwordMismatch);
    return false;
  }

  // Check email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    toast.error(errorMessages.invalidEmail);
    return false;
  }

  // Check phone format
  const phoneRegex = /^[0-9]{8,}$/;
  if (!phoneRegex.test(formData.phone.replace(/[- ]/g, ''))) {
    toast.error(errorMessages.invalidPhone);
    return false;
  }

  return true;
};
