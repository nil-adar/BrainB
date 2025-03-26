
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

interface FAQSectionProps {
  title: string;
  items: Array<{
    question: string;
    answer: string;
  }>;
}

export function FAQSection({ title, items }: FAQSectionProps) {
  return (
    <section className="py-16 px-6 md:px-10 lg:px-20 max-w-7xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        {title}
      </h2>
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {items.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-3">
                  <HelpCircle size={20} className="text-primary" />
                  <span>{faq.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-10">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
