const isLocalhost = window.location.hostname === "localhost";

// כתובת API ראשית (שרת Node/Express)
export const API_BASE_URL = isLocalhost
  ? "https://brainb-production.up.railway.app/api" // בזמן פיתוח אפשר גם לשים "http://localhost:5000/api"
  : `${window.location.origin}/api`;               // בפרודקשן תמיד אותו דומיין

// כתובת בסיס ל-Nodus
export const NODUS_BASE_URL = isLocalhost
  ? "http://127.0.0.1:8000"                        // ריצה לוקאלית של Django
  : "https://acceptable-joy-production-a391.up.railway.app";     // כתובת בפרודקשן

console.log("🌍 Using API BASE URL:", API_BASE_URL);
console.log("🔗 Using NODUS BASE URL:", NODUS_BASE_URL);
