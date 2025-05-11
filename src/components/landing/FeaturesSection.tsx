
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="border-none shadow-md bg-card hover:shadow-lg transition-shadow">
      <CardContent className="p-6 space-y-4">
        <div className="bg-primary/10 rounded-full p-3 inline-block">
          <div className="text-primary">
            {icon}
          </div>
        </div>
        <h3 className="font-bold text-xl">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

interface FeaturesSectionProps {
  title: string;
  features: {
    monitoring: {
      title: string;
      description: string;
    };
    personalized: {
      title: string;
      description: string;
    };
    communication: {
      title: string;
      description: string;
    };
    scheduling: {
      title: string;
      description: string;
    };
  };
  icons: {
    monitoring: React.ReactNode;
    personalized: React.ReactNode;
    communication: React.ReactNode;
    scheduling: React.ReactNode;
  };
}

export function FeaturesSection({ title, features, icons }: FeaturesSectionProps) {
  return (
    <section className="py-16 px-6 md:px-10 lg:px-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard 
            icon={icons.monitoring}
            title={features.monitoring.title}
            description={features.monitoring.description}
          />
          <FeatureCard 
            icon={icons.personalized}
            title={features.personalized.title}
            description={features.personalized.description}
          />
          <FeatureCard 
            icon={icons.communication}
            title={features.communication.title}
            description={features.communication.description}
          />
          <FeatureCard 
            icon={icons.scheduling}
            title={features.scheduling.title}
            description={features.scheduling.description}
          />
        </div>
      </div>
    </section>
  );
}
