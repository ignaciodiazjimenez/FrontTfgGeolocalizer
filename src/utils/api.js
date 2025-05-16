// ===============================================
// utils/api.js — Funciones para conectar con el backend real
// ===============================================

const BASE_URL = "http://localhost:8000"; // Ajusta si cambias el puerto o host

// ============================
// Helpers para autenticación
// ============================

/**
 * Devuelve el token JWT almacenado en localStorage
 * (solo si se ejecuta en el navegador)
 */
export function getToken() {
  if (typeof window === "undefined") return null; // Evita error en SSR
  return localStorage.getItem("token") || null;
}

/**
 * Devuelve una cabecera Authorization con Bearer token
 */
export function getAuthHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Valida la respuesta del backend
 */
async function handleResponse(response) {
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Error en la petición");
  }
  return response.json();
}

// ============================
// Funciones de autenticación
// ============================

/**
 * Inicia sesión y guarda el token en localStorage
 */
export async function login(username, password) {
  const res = await fetch(`${BASE_URL}/token`, {
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

/**
 * Cierra sesión localmente
 */
export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
}

/**
 * Obtiene el rol del usuario desde el token JWT
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

// ============================
// Gestión de usuarios
// ============================

/**
 * Registra un nuevo usuario
 */
export async function register(user) {
  const res = await fetch(`${BASE_URL}/usuarios/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  return handleResponse(res);
}

/**
 * Obtiene todos los usuarios (admin)
 */
export async function getUsers() {
  const res = await fetch(`${BASE_URL}/usuarios/`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });

  return handleResponse(res);
}

/**
 * Elimina un usuario por ID
 */
export async function deleteUser(id) {
  const res = await fetch(`${BASE_URL}/usuarios/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });

  return handleResponse(res);
}

// ============================
// Recuperación de contraseña
// ============================

/**
 * Cambia la contraseña enviando usuario, email y nueva contraseña
 */
export async function recoverPassword({ username, email, nueva_password }) {
  const res = await fetch(`${BASE_URL}/usuarios/cambiar_contrasena/${username}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, nueva_password }),
  });

  return handleResponse(res);
}
