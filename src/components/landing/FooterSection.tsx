
import React from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface FooterSectionProps {
  description: string;
  contact: {
    title: string;
    phone: string;
    phoneNumber: string;
    email: string;
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
    monitoring: { title: string };
    personalized: { title: string };
    communication: { title: string };
    scheduling: { title: string };
  };
}

export function FooterSection({ description, contact, forTeachers, login, getStarted, features }: FooterSectionProps) {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const isMobile = useIsMobile();
  const isRTL = document.dir === 'rtl';
  
  return (
    <footer className="bg-secondary/30 py-8 md:py-12 px-4 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <div className="text-center sm:text-left">
            <div className="flex justify-center sm:justify-start">
              <Logo size={isMobile ? "xs" : "sm"} showText={true} />
            </div>
            <p className="mt-3 md:mt-4 text-xs md:text-sm text-muted-foreground">
              {description}
            </p>
          </div>
          
          <div className={`text-center ${isRTL ? 'sm:text-center' : 'sm:text-left'}`}>
            <h3 className="font-bold mb-3 md:mb-4">{contact.title}</h3>
            <div className="space-y-2">
              <div className="space-y-2">
                <div className={`flex items-center gap-2 ${isRTL ? 'justify-center' : 'text-left sm:text-left'}`}>
                  <Mail size={isMobile ? 14 : 16} className="shrink-0" />
                  <span className="text-sm md:text-base">{contact.email} nil.adar@e.braude.ac.il</span>
                </div>
                <div className={`flex items-center gap-2 ${isRTL ? 'justify-center' : 'text-left sm:text-left'}`}>
                  <Mail size={isMobile ? 14 : 16} className="shrink-0" />
                  <span className="text-sm md:text-base">sandra@ebraude.ac.il</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center sm:text-left">
            <h3 className="font-bold mb-3 md:mb-4">{forTeachers}</h3>
            <ul className="space-y-2">
              <li>
                <Button variant="link" className="p-0 h-auto text-sm md:text-base" onClick={() => navigate("/login", { state: { userType: "teacher" } })}>
                  {login}
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0 h-auto text-sm md:text-base" onClick={() => navigate("/register")}>
                  {getStarted}
                </Button>
              </li>
            </ul>
          </div>
          
          <div className="text-center sm:text-left">
            <h3 className="font-bold mb-3 md:mb-4">{features.title}</h3>
            <ul className="space-y-1 md:space-y-2">
              <li className="text-sm md:text-base">{features.monitoring.title}</li>
              <li className="text-sm md:text-base">{features.personalized.title}</li>
              <li className="text-sm md:text-base">{features.communication.title}</li>
              <li className="text-sm md:text-base">{features.scheduling.title}</li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-center md:justify-between items-center mt-8 md:mt-12 pt-6 md:pt-8 border-t border-border">
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-4 md:mb-0">
            <Button variant="link" className="p-0 h-auto text-xs md:text-sm">
              {contact.support}
            </Button>
            <Button variant="link" className="p-0 h-auto text-xs md:text-sm">
              {contact.privacy}
            </Button>
            <Button variant="link" className="p-0 h-auto text-xs md:text-sm">
              {contact.terms}
            </Button>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground">
            © {currentYear} BrainBridge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
