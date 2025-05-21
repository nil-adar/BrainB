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
  // הקטנו את ה-padding והגדלים כדי שיתאימו יותר לתמונה שהועלתה
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-[250px,1fr,300px] gap-4 md:gap-6">
        <aside className="space-y-4 order-2 md:order-1">
          {leftSidebar}
        </aside>

        <section className="order-1 md:order-2">
          {mainContent}
        </section>

        <aside className="space-y-4 order-3">
          {rightSidebar}
        </aside>
      </div>
    </div>
  );
};
