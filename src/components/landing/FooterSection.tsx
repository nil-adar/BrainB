import React from "react";
import { Logo } from "@/components/ui/logo";
import { Mail } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSettings } from "@/components/SettingsContext";

interface FooterSectionProps {
  contact: {
    title: string;
    phone: string;
    phoneNumber: string;
    email?: string;
    emailAddress: string;
    support: string;
    privacy: string;
    terms: string;
  };
  forTeachers: string;
  login: string;
  getStarted: string;
  features: {
    title: string;
    personalized: { title: string };
    communication: { title: string };
    scheduling: { title: string };
  };
}

export function FooterSection({ contact, features }: FooterSectionProps) {
  const currentYear = new Date().getFullYear();
  const isMobile = useIsMobile();
  const { language } = useSettings();
  const isRTL = language === "he";

  const getInTouch = isRTL ? "צור קשר" : "Get in Touch";
  const featuresTitle =
    features.title || (isRTL ? "תכונות מרכזיות" : "Key Features");

  return (
    <footer
      className="bg-secondary/30 py-10 md:py-12"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 justify-items-center text-center">
          <div>
            <h3 className="font-bold mb-3 md:mb-4">{getInTouch}</h3>
            <ul className="space-y-2">
              <li
                className={`flex items-center justify-center gap-2 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <Mail size={isMobile ? 14 : 16} className="shrink-0" />
                <a
                  href="mailto:nil.adar@e.braude.ac.il"
                  className="text-sm md:text-base hover:underline"
                >
                  nil.adar@e.braude.ac.il
                </a>
              </li>
              <li
                className={`flex items-center justify-center gap-2 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <Mail size={isMobile ? 14 : 16} className="shrink-0" />
                <a
                  href="mailto:Sandra.knizhnik@e.braude.ac.il"
                  className="text-sm md:text-base hover:underline"
                >
                  Sandra.knizhnik@e.braude.ac.il
                </a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center justify-center">
            <Logo
              size={isMobile ? "md" : "lg"}
              showText
              className="h-24 w-24 md:h-28 md:w-28 mb-2"
            />
          </div>

          <div>
            <h3 className="font-bold mb-3 md:mb-4">{featuresTitle}</h3>
            <ul className="space-y-2">
              <li className="text-sm md:text-base">
                {features.personalized.title}
              </li>
              <li className="text-sm md:text-base">
                {features.communication.title}
              </li>
              <li className="text-sm md:text-base">
                {features.scheduling.title}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex items-center justify-center">
          <p className="text-xs md:text-sm text-muted-foreground">
            © {currentYear} BrainBridge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
