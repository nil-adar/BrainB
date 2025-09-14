// config/api.ts
const isLocalhost = window.location.hostname === "localhost";

export const API_BASE_URL = isLocalhost
  ? "http://localhost:5000/api" // מקומית
  : `${window.location.origin}/api`; // בפרודקשן תמיד באותו דומיין שממנו נטען ה-Frontend

console.log("🌍 Using API BASE URL:", API_BASE_URL);
