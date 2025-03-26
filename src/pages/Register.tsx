
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { registerTranslations } from "@/translations/register";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Logo } from "@/components/ui/logo";

export const Register = () => {
  const [language, setLanguage] = useState<"en" | "he">("he");
  const isRTL = language === "he";
  const t = registerTranslations[language];
  
  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "he" : "en";
    setLanguage(newLanguage);
    document.documentElement.dir = newLanguage === "he" ? "rtl" : "ltr";
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4" dir={isRTL ? "rtl" : "ltr"}>
      <Card className="w-full max-w-3xl p-8 space-y-10 relative bg-secondary-DEFAULT">
        <LanguageToggle language={language} toggleLanguage={toggleLanguage} className="absolute top-4 right-4" />
        
        <div className="flex flex-col items-center justify-center space-y-4 mb-8">
          <Logo size="md" showText={true} />
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">{t.register}</h1>
          <p className="text-xl text-gray-600">{t.subtitle}</p>
        </div>

        <RegisterForm translations={t} isRTL={isRTL} language={language} />
      </Card>
    </div>
  );
};

export default Register;
