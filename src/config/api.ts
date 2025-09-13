
const isProduction = import.meta.env.PROD;
// update pro
// אם זה פרודקשן  משתמשים בשרת בויריילו
// אם זה פיתוח → נשארים עם localhost כדי שיהיה נוח לבדוק
export const API_BASE_URL = isProduction
  ? "https://brainb-production.up.railway.app/api"
  : "http://localhost:5000/api";
