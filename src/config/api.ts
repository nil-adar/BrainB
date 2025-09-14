// config/api.ts

// קודם כל ננסה לטעון מ-ENV של Vite (בפיתוח ובפרודקשן)
const baseURLFromEnv = import.meta.env.VITE_API_BASE_URL;

export const API_BASE_URL = baseURLFromEnv || (
  import.meta.env.PROD
    ? "https://brainb-production.up.railway.app/api" // fallback לפרודקשן אם env לא מוגדר
    : "http://localhost:5000/api"                   // fallback לפיתוח אם env לא מוגדר
);

console.log("🌍 Using API BASE URL:", API_BASE_URL);
