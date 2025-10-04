import React from "react";
import { ArrowUp } from "lucide-react";

interface CTASectionProps {
  title: string;
  isRTL?: boolean;
  buttonText?: string;
}

export function CTASection({ title, isRTL = false }: CTASectionProps) {
  const scrollToHero = () => {
    const hero = document.getElementById("hero");
    hero?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-16 px-6 md:px-10 lg:px-20 bg-primary/10 text-center">
      <div className="max-w-4xl mx-auto" dir={isRTL ? "rtl" : "ltr"}>
        <h2 className="text-3xl md:text-4xl font-bold mb-8">{title}</h2>

        <button
          onClick={scrollToHero}
          className="flex items-center justify-center mx-auto w-14 h-14 rounded-full 
                     bg-gradient-to-r from-emerald-300 to-cyan-400 text-white shadow-lg 
                     hover:opacity-80 transition"
          aria-label="Back to top"
        >
          <ArrowUp className="w-7 h-7" />
        </button>
      </div>
    </section>
  );
}
