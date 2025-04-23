// src/utils/authUtils.ts
import { jwtDecode } from "jwt-decode";


export function isTokenExpired(): boolean {
  const token = localStorage.getItem("token");
  if (!token) return true;

  try {
    const decoded: any = jwtDecode(token);
    const now = Date.now() / 1000;

    return decoded.exp < now;
  } catch (error) {
    return true;
  }
}
