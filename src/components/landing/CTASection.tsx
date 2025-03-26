
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CTASectionProps {
  title: string;
  buttonText: string;
}

export function CTASection({ title, buttonText }: CTASectionProps) {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 px-6 md:px-10 lg:px-20 bg-primary/10 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">{title}</h2>
        <Button 
          size="lg" 
          onClick={() => navigate("/register")}
          className="animate-pulse"
        >
          {buttonText}
        </Button>
      </div>
    </section>
  );
}
