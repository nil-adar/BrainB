import { useState } from "react";
import { 
  BarChart2, 
  Brain, 
  Users, 
  Calendar,
  School,
  GraduationCap,
  UserRound
} from "lucide-react";
import { HeaderSection } from "@/components/landing/HeaderSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { UserTypesSection } from "@/components/landing/UserTypesSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { CTASection } from "@/components/landing/CTASection";
import { FooterSection } from "@/components/landing/FooterSection";

const translations = {
  en: {
    title: "Welcome to BrainBridge",
    subtitle: "The intelligent platform for educational development and monitoring",
    description: "BrainBridge connects teachers, students, and parents through an intuitive interface to track progress, manage tasks, and provide personalized recommendations.",
    getStarted: "Get Started",
    features: {
      title: "Key Features",
      monitoring: {
        title: "Comprehensive Monitoring",
        description: "Track student progress with detailed analytics and visual reports."
      },
      personalized: {
        title: "Personalized Learning",
        description: "Tailored recommendations based on individual student needs and performance."
      },
      communication: {
        title: "Seamless Communication",
        description: "Connect teachers, students and parents in one unified platform."
      },
      scheduling: {
        title: "Smart Scheduling",
        description: "Organize tasks and activities with intelligent scheduling tools."
      }
    },
    forTeachers: "For Teachers",
    forStudents: "For Students",
    forParents: "For Parents",
    login: "Login",
    testimonials: {
      title: "Success Stories",
      items: [
        {
          name: "Sarah T.",
          role: "High School Teacher",
          text: "BrainBridge has transformed how I interact with my students. The analytics help me identify learning gaps immediately."
        },
        {
          name: "Michael R.",
          role: "Parent",
          text: "I finally feel connected to my child's education. The app makes it easy to track progress and communicate with teachers."
        },
        {
          name: "Jamie K.",
          role: "Middle School Student",
          text: "The personalized recommendations helped me improve my math scores by 25% in just three months!"
        }
      ]
    },
    faq: {
      title: "Frequently Asked Questions",
      items: [
        {
          question: "How does BrainBridge help teachers save time?",
          answer: "BrainBridge automates routine tasks like grading assessments, tracking attendance, and organizing materials. Our analytics offer immediate insights so teachers can focus on what matters most: teaching."
        },
        {
          question: "Is BrainBridge suitable for all age groups?",
          answer: "Yes, BrainBridge is designed for students of all ages, from elementary through high school. The interface adapts to different age groups and learning needs."
        },
        {
          question: "How secure is student data on the platform?",
          answer: "Student privacy is our top priority. BrainBridge uses enterprise-grade encryption and complies with all educational data privacy regulations. Parents can control data sharing permissions."
        },
        {
          question: "Can BrainBridge integrate with other educational tools?",
          answer: "Yes, BrainBridge connects seamlessly with popular learning management systems, assessment tools, and educational resources through our API."
        }
      ]
    },
    contact: {
      title: "Get in Touch",
      phone: "Call us:",
      phoneNumber: "+1 (555) 123-4567",
      email: "Email:",
      emailAddress: "info@brainbridge.edu",
      support: "Support Center",
      privacy: "Privacy Policy",
      terms: "Terms of Use"
    },
    finalCta: "Ready to revolutionize learning?"
  },
  he: {
    title: "ברוכים הבאים ל-BrainBridge",
    subtitle: "הפלטפורמה החכמה לפיתוח וניטור חינוכי",
    description: "BrainBridge מחבר מורים, תלמידים והורים דרך ממשק אינטואיטיבי למעקב אחר התקדמות, ניהול משימות, והמלצות מותאמות אישית.",
    getStarted: "בואו נתחיל",
    features: {
      title: "תכונות מרכזיות",
      monitoring: {
        title: "ניטור מקיף",
        description: "מעקב אחר התקדמות התלמידים עם ניתוחים מפורטים ודוחות חזותיים."
      },
      personalized: {
        title: "למידה מותאמת אישית",
        description: "המלצות מותאמות בהתבסס על צרכים וביצועים אישיים של התלמיד."
      },
      communication: {
        title: "תקשורת חלקה",
        description: "חיבור בין מורים, תלמידים והורים בפלטפורמה אחידה."
      },
      scheduling: {
        title: "תזמון חכם",
        description: "ארגון משימות ופעילויות עם כלי תזמון חכמים."
      }
    },
    forTeachers: "למורים",
    forStudents: "לתלמידים",
    forParents: "להורים",
    login: "כניסה",
    testimonials: {
      title: "סיפורי הצלחה",
      items: [
        {
          name: "שרה ט.",
          role: "מורה בתיכון",
          text: "BrainBridge שינתה את האופן שבו אני מתקשרת עם התלמידים שלי. הניתוחים עוזרים לי לזהות פערי למידה באופן מיידי."
        },
        {
          name: "מיכאל ר.",
          role: "הורה",
          text: "סוף סוף אני מרגיש מחובר לחינוך של הילד שלי. האפליקציה מקלה עלי לעקוב אחר ההתקדמות ולתקשר עם המורים."
        },
        {
          name: "ג'יימי ק.",
          role: "תלמיד חטיבת ביניים",
          text: "ההמלצות המותאמות אישית עזרו לי לשפר את ציוני המתמטיקה שלי ב-25% בשלושה חודשים בלבד!"
        }
      ]
    },
    faq: {
      title: "שאלות נפוצות",
      items: [
        {
          question: "כיצד BrainBridge עוזרת למורים לחסוך זמן?",
          answer: "BrainBridge מאפשרת אוטומציה של משימות שגרתיות כמו בדיקת הערכות, מעקב נוכחות, וארגון חומרים. הניתוחים שלנו מציעים תובנות מיידיות כדי שמורים יוכלו להתמקד במה שחשוב ביותר: הוראה."
        },
        {
          question: "האם BrainBridge מתאימה לכל קבוצות הגיל?",
          answer: "כן, BrainBridge מיועדת לתלמידים מכל הגילאים, מבית ספר יסודי ועד תיכון. הממשק מותאם לקבוצות גיל שונות וצרכי למידה שונים."
        },
        {
          question: "עד כמה מאובטחים נתוני התלמידים בפלטפורמה?",
          answer: "פרטיות התלמידים היא בעדיפות עליונה עבורנו. BrainBridge משתמשת בהצפנה ברמה ארגונית ועומדת בכל תקנות פרטיות נתוני החינוך. הורים יכולים לשלוט בהרשאות שיתוף הנתונים."
        },
        {
          question: "האם BrainBridge יכולה להשתלב עם כלים חינוכיים אחרים?",
          answer: "כן, BrainBridge מתחברת בצורה חלקה עם מערכות ניהול למידה פופולריות, כלי הערכה ומשאבים חינוכיים באמצעות ה-API שלנו."
        }
      ]
    },
    contact: {
      title: "צור קשר",
      phone: "התקשרו אלינו:",
      phoneNumber: "+1 (555) 123-4567",
      email: "אימייל:",
      emailAddress: "info@brainbridge.edu",
      support: "מרכז תמיכה",
      privacy: "מדיניות פרטיות",
      terms: "תנאי שימוש"
    },
    finalCta: "מוכנים לחולל מהפכה בלמידה?"
  }
};

export default function LandingPage() {
  const [language, setLanguage] = useState<"en" | "he">("he");
  const t = translations[language];
  const isRTL = language === "he";

  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "he" : "en");
  };

  // Icons for different sections
  const featureIcons = {
    monitoring: <BarChart2 size={24} />,
    personalized: <Brain size={24} />,
    communication: <Users size={24} />,
    scheduling: <Calendar size={24} />
  };

  const userTypeIcons = {
    teacher: <School size={48} className="text-primary" />,
    student: <GraduationCap size={48} className="text-primary" />,
    parent: <UserRound size={48} className="text-primary" />
  };

  return (
    <div className={`min-h-screen bg-background text-foreground ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <HeaderSection
        loginText={t.login}
        language={language}
        toggleLanguage={toggleLanguage}
      />

      {/* Hero Section */}
      <HeroSection
        title={t.title}
        subtitle={t.subtitle}
        description={t.description}
        getStarted={t.getStarted}
        isRTL={isRTL}
      />

      {/* Features Section */}
      <FeaturesSection
        title={t.features.title}
        features={t.features}
        icons={featureIcons}
      />

      {/* User Types Section */}
      <UserTypesSection
        forTeachers={t.forTeachers}
        forStudents={t.forStudents}
        forParents={t.forParents}
        icons={userTypeIcons}
      />

      {/* Testimonials Section */}
      <TestimonialsSection
        title={t.testimonials.title}
        items={t.testimonials.items}
      />

      {/* FAQ Section */}
      <FAQSection
        title={t.faq.title}
        items={t.faq.items}
      />

      {/* Final CTA Section */}
      <CTASection
        title={t.finalCta}
        buttonText={t.getStarted}
      />

      {/* Footer */}
      <FooterSection
        description={t.description}
        contact={t.contact}
        forTeachers={t.forTeachers}
        login={t.login}
        getStarted={t.getStarted}
        features={t.features}
      />
    </div>
  );
}
