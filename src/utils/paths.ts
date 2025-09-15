// src/utils/paths.ts
// בלי default export – רק export בשם
export function getDashboardUrl(opts: {
  viewerRole: string | null;
  loggedUserId?: string | null;
  studentId?: string | null;
}) {
  const { viewerRole, loggedUserId, studentId } = opts;

  const base =
    viewerRole === "student"
      ? "/student-dashboard"
      : viewerRole === "parent"
      ? "/parent-dashboard"
      : "/teacher-dashboard";

  if (
    viewerRole === "student" &&
    loggedUserId &&
    studentId &&
    String(loggedUserId) === String(studentId)
  ) {
    return base;
  }

  if (studentId) return `${base}?studentId=${studentId}`;
  return base;
}

export function getViewerDashboardUrl(viewerRole?: string | null) {
  switch (viewerRole) {
    case "student":
      return "/student-dashboard";
    case "parent":
      return "/parent-dashboard";
    case "teacher":
      return "/teacher-dashboard";
    default:
      // פולבק סביר – אפשר לשנות אם יש לכם דף בית מותאם
      return "/teacher-dashboard";
  }
}
