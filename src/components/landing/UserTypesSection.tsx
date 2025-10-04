// src/components/landing/UserTypesSection.tsx
import { useState, ReactNode } from "react";
import RolePreview from "./RolePreview";

type RoleKey = "parents" | "teachers" | "students";
type Lang = "he" | "en";

interface UserTypesSectionProps {
  forTeachers: string;
  forStudents: string;
  forParents: string;
  icons: {
    teacher: ReactNode;
    student: ReactNode;
    parent: ReactNode;
  };
  lang: Lang;
  whatYouGetText?: string;
}

export function UserTypesSection({
  forTeachers,
  forStudents,
  forParents,
  icons,
  lang,
  whatYouGetText,
}: UserTypesSectionProps) {
  const [openFor, setOpenFor] = useState<RoleKey | null>(null);

  const roleCards: Record<RoleKey, { title: string; icon: ReactNode }> = {
    teachers: { title: forTeachers, icon: icons.teacher },
    students: { title: forStudents, icon: icons.student },
    parents: { title: forParents, icon: icons.parent },
  };

  const helper =
    whatYouGetText ?? (lang === "he" ? "מה מקבלים?" : "What do you get?");

  return (
    <>
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {(["teachers", "students", "parents"] as RoleKey[]).map((key) => {
            const card = roleCards[key];
            return (
              <button
                key={key}
                onClick={() => setOpenFor(key)}
                className="group rounded-2xl border bg-white dark:bg-neutral-900 hover:shadow-lg transition p-6 text-center max-w-sm w-full mx-auto"
              >
                <div className="mx-auto mb-3 group-hover:scale-105 transition min-h-[48px] flex items-center justify-center">
                  {card.icon}
                </div>
                <div className="font-semibold">{card.title}</div>
                <div className="mt-1 text-xs text-neutral-500">{helper}</div>
              </button>
            );
          })}
        </div>
      </div>

      <RolePreview
        role={openFor ?? "parents"}
        open={openFor !== null}
        onClose={() => setOpenFor(null)}
        lang={lang}
      />
    </>
  );
}
