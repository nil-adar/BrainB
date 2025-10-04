// src/components/landing/RolePreview.tsx
import { X } from "lucide-react";

type RoleKey = "parents" | "teachers" | "students";
type Lang = "he" | "en";

const COPY: Record<
  Lang,
  Record<RoleKey, { title: string; bullets: string[] }>
> = {
  he: {
    parents: {
      title: "להורים",
      bullets: [
        "מענה על שאלונים ומעקב אחר התקדמות הילד",
        "קבלת המלצות מותאמות אישית לתלמיד (תזונה, פעילות, סביבה)",
        "תקשורת ישירה עם המורה ועדכונים בזמן אמת",
      ],
    },
    teachers: {
      title: "למורים",
      bullets: [
        "הקמת משימות יומיות והפעלת תהליך דיאגנוסטי (NODUS)",
        "קבלת המלצות כיתתיות מותאמות תלמיד, מבוססות על 11 שלבי סינון",
        "תקשורת שוטפת עם הורים ומעקב אחר התנהגות התלמיד",
      ],
    },
    students: {
      title: "לתלמידים",
      bullets: [
        "צפייה במשימות יומיות עם טיימר מובנה",
        "השלמת שאלון עצמי ותהליך אבחון NODUS",
        "יצירת קשר עם המורה בקלות",
        "קבלת המלצות מותאמות אישית לבית (תזונה, פעילות, סביבה)",
      ],
    },
  },
  en: {
    parents: {
      title: "For Parents",
      bullets: [
        "Complete questionnaires and track child's progress",
        "Receive students personalized recommendations (nutrition, activity, environment)",
        "Direct communication with teacher and real-time updates",
      ],
    },
    teachers: {
      title: "For Teachers",
      bullets: [
        "Create daily tasks and trigger NODUS diagnostic process",
        "Get classroom recommendations for students, filtered through 11-stage pipeline",
        "Ongoing parent communication and student behavior tracking",
      ],
    },
    students: {
      title: "For Students",
      bullets: [
        "View daily tasks with built-in countdown timer",
        "Complete self-questionnaire and NODUS assessment",
        "Easily contact teacher",
        "Receive personalized recommendations (nutrition, activity, environment)",
      ],
    },
  },
};

export default function RolePreview({
  role,
  open,
  onClose,
  lang = "he",
}: {
  role: RoleKey;
  open: boolean;
  onClose: () => void;
  lang?: Lang;
}) {
  if (!open) return null;
  const { title, bullets } = COPY[lang][role];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      dir={lang === "he" ? "rtl" : "ltr"}
    >
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-neutral-900 shadow-xl p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            aria-label={lang === "he" ? "סגור" : "Close"}
            className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <ul className="space-y-2 mb-5">
          {bullets.map((b, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-teal-500 shrink-0" />
              <span className="text-sm text-neutral-700 dark:text-neutral-200">
                {b}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="inline-flex justify-center rounded-xl px-4 py-2 text-sm font-medium border border-neutral-300 dark:border-neutral-700"
          >
            {lang === "he" ? "סגור" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
