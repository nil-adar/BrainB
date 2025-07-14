import { Search, Bell, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { Translations } from "@/types/activity";
import { Logo } from "@/components/ui/logo";

interface HeaderProps {
  t: Translations;
  currentDate: string;
  language: string;
  toggleLanguage: () => void;
  breadcrumbItems: Array<{ label: string; href?: string }>;
}

export function Header({
  t,
  currentDate,
  language,
  toggleLanguage,
  breadcrumbItems,
}: HeaderProps) {
  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo size="md" />
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder={t.search}
                className="pl-10 w-[300px]"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={toggleLanguage}
              className="text-gray-600"
            >
              {language === "en" ? "עברית" : "English"}
            </Button>
            <span className="text-gray-600">{currentDate}</span>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <UserCircle className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="mt-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>
    </header>
  );
}
