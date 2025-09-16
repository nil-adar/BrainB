import React, { ReactNode } from "react";

interface DashboardBackgroundProps {
  children: ReactNode;
}

const DashboardBackground = ({ children }: DashboardBackgroundProps) => {
  return (
    <>
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNjZmQ4ZTQiPjwvcmVjdD4KPC9zdmc+')] opacity-20 dark:opacity-10"></div>
      </div>
      {children}
    </>
  );
};

export default DashboardBackground;
