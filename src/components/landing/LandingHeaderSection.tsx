import { Logo } from "@/components/ui/logo";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useIsMobile } from "@/hooks/use-mobile";

export function LandingHeaderSection() {
  const isMobile = useIsMobile();

  return (
    <header className="flex justify-between items-center p-6 md:p-8">
      <div className="flex items-center">
        <Logo
          size={isMobile ? "md" : "lg"}
          showText={true}
          className="hover:opacity-100 transition-opacity h-32 w-32 md:h-32 w-32"
        />
      </div>
      <div className="flex items-center gap-4">
        <LanguageToggle variant="button" className="px-5 py-3" />
      </div>
    </header>
  );
}
