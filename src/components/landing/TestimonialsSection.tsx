
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  role: string;
  text: string;
}

function TestimonialCard({ name, role, text }: TestimonialCardProps) {
  return (
    <Card className="border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="h-5 w-5 text-accent" />
          <CardTitle className="text-lg">{name}</CardTitle>
        </div>
        <CardDescription>{role}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground relative">
          <span className="absolute -left-2 -top-2 text-4xl text-primary/20">"</span>
          {text}
          <span className="absolute -right-2 bottom-0 text-4xl text-primary/20">"</span>
        </p>
      </CardContent>
    </Card>
  );
}

interface TestimonialsSectionProps {
  title: string;
  items: Array<{
    name: string;
    role: string;
    text: string;
  }>;
}

export function TestimonialsSection({ title, items }: TestimonialsSectionProps) {
  return (
    <section className="py-16 px-6 md:px-10 lg:px-20 bg-primary/5">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              name={testimonial.name}
              role={testimonial.role}
              text={testimonial.text}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
