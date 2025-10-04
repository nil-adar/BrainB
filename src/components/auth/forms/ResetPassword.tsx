/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSettings } from "@/components/SettingsContext";
import { Logo } from "@/components/ui/logo";
import { authService } from "@/services/authService";
import HelpButton from "@/components/HelpButton";

type Lang = "he" | "en";

const translations: Record<Lang, any> = {
  en: {
    welcome: "Welcome to BrainBridge!",
    resetTitle: "Reset Password",
    step1Subtitle: "Enter your ID and phone number to continue",
    step2Subtitle: "Set a new password",
    idNumber: "ID Number",
    phone: "Phone",
    continue: "Continue",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    savePassword: "Save Password",
    successMessage: "Password updated. You can log in now.",
    errorMessage: "Something went wrong. Please try again.",
    invalidId: "Please enter a valid ID number",
    invalidPhone: "Please enter a valid phone number",
    mismatch: "Passwords do not match",
    rememberPassword: "Remember your password?",
    loginHere: "Log in here",
    checking: "Checking...",
    updating: "Updating...",
    sending: "Sending...",
  },
  he: {
    welcome: "ברוכים הבאים ל-BrainBridge!",
    resetTitle: "איפוס סיסמה",
    step1Subtitle: "הזינו תעודת זהות ומספר טלפון להמשך",
    step2Subtitle: "הגדירו סיסמה חדשה",
    idNumber: "תעודת זהות",
    phone: "טלפון",
    continue: "המשך",
    newPassword: "סיסמה חדשה",
    confirmPassword: "אימות סיסמה",
    savePassword: "שמור סיסמה",
    successMessage: "הסיסמה עודכנה. אפשר להתחבר עכשיו.",
    errorMessage: "אירעה שגיאה. נסו שוב.",
    invalidId: "נא להזין מספר תעודת זהות תקין",
    invalidPhone: "נא להזין מספר טלפון תקין",
    mismatch: "הסיסמאות אינן תואמות",
    rememberPassword: "נזכרתם בסיסמה?",
    loginHere: "התחברו כאן",
    checking: "בודק...",
    updating: "מעדכן...",
    sending: "שולח...",
  },
};

export default function ResetPassword() {
  const { language } = useSettings();
  const lang = (language === "he" ? "he" : "en") as Lang;
  const t = translations[lang];
  const isRTL = lang === "he";
  const navigate = useNavigate();

  // שלבים ומצבים
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);

  // שלב 1
  const [uniqueId, setUniqueId] = useState("");
  const [phone, setPhone] = useState("");

  // שלב 2
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // ולידציות זריזות
  const validId = (s: string) => s && s.trim().length >= 5;
  const validPhone = (s: string) => s && s.trim().length >= 7;

  async function handleInit(e: React.FormEvent) {
    e.preventDefault();
    if (!validId(uniqueId)) {
      toast.error(t.invalidId, { className: isRTL ? "rtl" : "ltr" });
      return;
    }
    if (!validPhone(phone)) {
      toast.error(t.invalidPhone, { className: isRTL ? "rtl" : "ltr" });
      return;
    }
    setLoading(true);
    try {
      const res = await authService.resetInit({ uniqueId, phone });
      if (res?.resetToken) {
        setResetToken(res.resetToken);
        setStep(2);
        // אופציונלי: חיווי קטן
        toast.success(
          isRTL ? "אפשר להמשיך לשלב האיפוס" : "You can proceed to reset",
          {
            className: isRTL ? "rtl" : "ltr",
          }
        );
      } else {
        toast.error(res?.message || t.errorMessage, {
          className: isRTL ? "rtl" : "ltr",
        });
      }
    } catch {
      toast.error(t.errorMessage, { className: isRTL ? "rtl" : "ltr" });
    } finally {
      setLoading(false);
    }
  }

  async function handleComplete(e: React.FormEvent) {
    e.preventDefault();
    if (!newPassword || newPassword !== confirm) {
      toast.error(t.mismatch, { className: isRTL ? "rtl" : "ltr" });
      return;
    }
    setLoading(true);
    try {
      await authService.resetComplete({ resetToken, newPassword });
      toast.success(t.successMessage, { className: isRTL ? "rtl" : "ltr" });
      navigate("/login");
    } catch (err: any) {
      const msg = err?.response?.data?.message || t.errorMessage;
      toast.error(msg, { className: isRTL ? "rtl" : "ltr" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-white p-4 ${
        isRTL ? "rtl" : "ltr"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          {/* Add Help Button */}
          <div className="flex justify-end mb-4">
            <HelpButton page="resetPassword" language={lang} variant="button" />
          </div>
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Logo />
          </div>

          {/* Headers */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {t.welcome}
            </h2>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t.resetTitle}
            </h3>
            <p className="text-gray-600 text-sm">
              {step === 1 ? t.step1Subtitle : t.step2Subtitle}
            </p>
          </div>

          {/* Forms */}
          {step === 1 ? (
            <form onSubmit={handleInit} className="space-y-4" noValidate>
              <Input
                type="text"
                inputMode="numeric"
                autoComplete="username"
                placeholder={t.idNumber}
                value={uniqueId}
                onChange={(e) => setUniqueId(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50/70 border rounded-lg"
                dir={isRTL ? "rtl" : "ltr"}
                required
                disabled={loading}
              />
              <Input
                type="tel"
                placeholder={isRTL ? "טלפון" : "Phone"}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50/70 border rounded-lg"
                dir={isRTL ? "rtl" : "ltr"}
                required
                disabled={loading}
              />
              <Button
                type="submit"
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-full flex items-center justify-center gap-2 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
                disabled={loading}
              >
                <span>
                  {loading ? (isRTL ? t.checking : t.checking) : t.continue}
                </span>
                <ArrowRight
                  className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`}
                />
              </Button>
            </form>
          ) : (
            <form onSubmit={handleComplete} className="space-y-4" noValidate>
              <Input
                type="password"
                autoComplete="new-password"
                placeholder={t.newPassword}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50/70 border rounded-lg"
                dir={isRTL ? "rtl" : "ltr"}
                required
                disabled={loading}
              />
              <Input
                type="password"
                autoComplete="new-password"
                placeholder={t.confirmPassword}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50/70 border rounded-lg"
                dir={isRTL ? "rtl" : "ltr"}
                required
                disabled={loading}
              />
              <Button
                type="submit"
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-full flex items-center justify-center gap-2 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
                disabled={loading}
              >
                <span>
                  {loading ? (isRTL ? t.updating : t.updating) : t.savePassword}
                </span>
                <ArrowRight
                  className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`}
                />
              </Button>
            </form>
          )}

          {/* Back to login */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              {t.rememberPassword}{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:underline"
              >
                {t.loginHere}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
