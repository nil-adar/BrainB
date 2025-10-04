import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { LanguageToggle } from "@/components/LanguageToggle";
import { LoginForm } from "@/components/auth/LoginForm";
import { authTranslations } from "@/translations/auth";
import { useSettings } from "../components/SettingsContext";
import HelpButton from "../components/HelpButton";

export const Login = () => {
  const { language } = useSettings();

  const isRTL = language === "he";
  const t = authTranslations[language];

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-white"
    >
      <Card className="w-full max-w-2xl p-10 space-y-10 shadow-lg relative animate-fadeIn">
        {/* Language Toggle and Help Button in top corners */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <HelpButton page="login" language={language} variant="icon" />
          <LanguageToggle variant="minimal" />
        </div>

        <div className="text-center space-y-8">
          <div className="flex justify-center px-8 py-6">
            <Logo size="lg" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 text-center mt-4">
            {t.welcome}
          </h1>
          <p className="text-xl text-gray-600 text-center">{t.subtitle}</p>
        </div>

        <LoginForm translations={t} isRTL={isRTL} />
      </Card>
    </div>
  );
};

export default Login;
