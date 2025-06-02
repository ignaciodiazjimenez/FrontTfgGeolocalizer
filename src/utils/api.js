// src/utils/api.js
// ==============================
// URL base real del backend
// (todas las peticiones empiezan por /api/v2.2)
const BASE_URL = "http://127.0.0.1:8000/api/v2.2";

/*==================================================*
 *  Helpers de autenticación
 *==================================================*/
export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token") || null;
}

export function getAuthHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(res) {
  const text = await res.text().catch(() => "");
  if (!res.ok) {
    try {
      const err = JSON.parse(text);
      throw new Error(err.detail || JSON.stringify(err));
    } catch {
      throw new Error(text || `HTTP ${res.status}`);
    }
  }
  return text ? JSON.parse(text) : {};
}

/*==================================================*
 *  Login  (POST /token_username)
 *==================================================*/
export async function login(username, password) {
  const res = await fetch(`${BASE_URL}/token_username`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await handleResponse(res);
  if (data.access_token) {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", data.access_token);
    }
    return data.access_token;
  }
  throw new Error("Token no recibido");
}

/*==================================================*
 *  Logout & helpers
 *==================================================*/
export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
}

export function getUserRole() {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role || null;
  } catch {
    return null;
  }
}

/*==================================================*
 *  (El resto de llamadas a tu API siguen igual…)
 *  register(), getUsers(), etc. —> usa BASE_URL
 *  y getAuthHeader() para añadir Authorization
 *==================================================*/
