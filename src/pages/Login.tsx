import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { LanguageToggle } from "@/components/LanguageToggle";
import { LoginForm } from "@/components/auth/LoginForm";
import { authTranslations } from "@/translations/auth";
import { useSettings } from "../components/SettingsContext";

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
        <LanguageToggle variant="minimal" className="absolute top-4 right-4" />

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
