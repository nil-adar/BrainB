
import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  description: string;
  getStarted: string;
  isRTL: boolean;
}

export function HeroSection({ title, subtitle, description, getStarted, isRTL }: HeroSectionProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  return (
    <section className="py-8 md:py-16 lg:py-20 px-4 md:px-10 lg:px-20 max-w-7xl mx-auto">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="space-y-4 md:space-y-6 max-w-3xl">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold animate-fadeIn">
            {title}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground">
            {subtitle}
          </p>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed mx-4 md:mx-0">
            {description}
          </p>
          <Button
            size={isMobile ? "default" : "lg"}
            className={`mt-6 md:mt-8 ${isRTL ? 'flex-row-reverse' : ''}`}
            onClick={() => navigate("/register")}
          >
            {getStarted}
            <ArrowRight className={`ml-2 ${isRTL ? 'rotate-180' : ''} ${isMobile ? 'w-4 h-4' : ''}`} />
          </Button>
        </div>
      </div>
    </section>
  );
}
