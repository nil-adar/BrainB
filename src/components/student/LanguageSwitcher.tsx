
import React from 'react';
import { Button } from "@/components/ui/button";

interface LanguageSwitcherProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLanguage,
  onLanguageChange,
}) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onLanguageChange(currentLanguage === 'en' ? 'he' : 'en')}
      className="flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
    >
      <span className="font-medium text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300 rounded-full px-2 py-0.5">
        {currentLanguage === 'en' ? 'EN' : 'HE'}
      </span>
      <span>{currentLanguage === 'en' ? 'עברית' : 'English'}</span>
    </Button>
  );
};

export default LanguageSwitcher;