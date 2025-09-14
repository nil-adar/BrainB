const isLocalhost = window.location.hostname === "localhost";

export const API_BASE_URL = isLocalhost
  ? "https://brainb-production.up.railway.app/api" // פיתוח מול Railway
  : `${window.location.origin}/api`;               // פרודקשן תמיד אותו דומיין

console.log("🌍 Using API BASE URL:", API_BASE_URL);
