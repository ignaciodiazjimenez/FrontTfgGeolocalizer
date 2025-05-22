// src/utils/api.js

// Debe coincidir con el que usas en Postman:
// POST http://127.0.0.1:8000/api/v2.0/token
const BASE_URL = "http://127.0.0.1:8000/api/v2.0";

/**
 * Devuelve el token JWT almacenado en localStorage
 */
export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token") || null;
}

/**
 * Devuelve el header Authorization: Bearer <token>
 */
export function getAuthHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Maneja respuestas HTTP: lanza error si !ok, o devuelve JSON
 */
async function handleResponse(res) {
  const text = await res.text().catch(() => "");
  if (!res.ok) {
    // intenta parsear un JSON de error { detail: ... }
    try {
      const err = JSON.parse(text);
      throw new Error(err.detail || JSON.stringify(err));
    } catch {
      throw new Error(text || `HTTP ${res.status}`);
    }
  }
  return text ? JSON.parse(text) : {};
}

/**
 * POST /token
 * Envía username+password como JSON y devuelve access_token
 */
export async function login(username, password) {
  const res = await fetch(`${BASE_URL}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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

/**
 * Elimina el token local
 */
export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
}

/**
 * Extrae el rol del payload del JWT
 */
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

// …y el resto de llamadas a tu API (register, getUsers, etc.) permanece igual, usando BASE_URL y getAuthHeader() …
