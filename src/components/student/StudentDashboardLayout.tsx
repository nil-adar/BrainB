
import { ReactNode } from "react";

interface StudentDashboardLayoutProps {
  leftSidebar: ReactNode;
  mainContent: ReactNode;
  rightSidebar: ReactNode;
}

export const StudentDashboardLayout = ({ 
  leftSidebar, 
  mainContent, 
  rightSidebar 
}: StudentDashboardLayoutProps) => {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-[300px,1fr,300px] gap-6 md:gap-8">
        <aside className="space-y-6 order-2 md:order-1">
          {leftSidebar}
        </aside>

        <section className="order-1 md:order-2">
          {mainContent}
        </section>

        <aside className="space-y-6 order-3">
          {rightSidebar}
        </aside>
      </div>
    </div>
  );
};
