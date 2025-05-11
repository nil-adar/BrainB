
import { toast } from "sonner";


/**
 * בדיקת תקינות של תעודת זהות ישראלית
 * מבצעת בדיקה לפי אלגוריתם לוהן (Luhn)
 * @param id מספר תעודת זהות לבדיקה
 * @returns boolean האם תעודת הזהות תקינה
 */
export const validateIsraeliID = (id: string): boolean => {

  id = id.trim();
  if (id.length === 0) return false;
  
  // בודקים האם יש בדיוק 9 ספרות
  if (!/^\d{9}$/.test(id)) return false;

  // אלגוריתם לוהן לבדיקת תקינות ת.ז
  const digits = Array.from(id).map(digit => parseInt(digit, 10));
  let counter = 0;
  
  for (let i = 0; i < 9; i++) {
    // כפול 2 עבור מיקומים אי-זוגיים (0-based)
    let currentDigit = digits[i];
    if (i % 2 === 0) {
      currentDigit *= 1;
    } else {
      currentDigit *= 2;
      if (currentDigit > 9) {
        currentDigit -= 9;
      }
    }
    counter += currentDigit;
  }

  return counter % 10 === 0;
};

export const validateRegistrationForm = (
  formData: {
    name: string;
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
    invalidName: string;
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
  if (!validateIsraeliID(formData.uniqueId)) {
    toast.error("תעודת זהות אינה תקינה");
    return false;
  }


    // בדיקת שם מלא (לפחות שם פרטי ושם משפחה)
  const nameParts = formData.name.trim().split(" ");
  if (nameParts.length < 2 || nameParts.some(part => part.length < 2)) {
    toast.error(errorMessages.invalidName);
    return false;
  }

  return true;

  
  
};
