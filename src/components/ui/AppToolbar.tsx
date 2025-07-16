import { ReactNode } from "react";
import { LanguageToggle } from "../LanguageToggle";
import { useSettings } from "../SettingsContext";

interface AppToolbarProps {
  title?: string;
  children?: ReactNode;
  showLanguageToggle?: boolean;
  className?: string;
}

export const AppToolbar = ({
  title,
  children,
  showLanguageToggle = true,
  className = "",
}: AppToolbarProps) => {
  const { language } = useSettings();

  return (
    <div className={`bg-white border-b border-gray-200 px-4 py-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {title && (
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          )}
          {children}
        </div>

        <div className="flex items-center gap-2">
          {showLanguageToggle && <LanguageToggle variant="toolbar" />}
        </div>
      </div>
    </div>
  );
};
