// ===============================================
// utils/api.js — Funciones para conectar con el backend
// ===============================================

// Cambia esta URL cuando pongas el backend en producción o uses otro puerto
const BASE_URL = "http://localhost:3001";

// Rutas de los endpoints que usarás (ajústalas según tu backend real)
const ENDPOINTS = {
  login: "/auth/login",        // Endpoint POST para iniciar sesión
  register: "/auth/register",  // Endpoint POST para registrar usuario
};

// ============================
// Helpers para autenticación
// ============================

/**
 * Devuelve el token JWT almacenado en localStorage
 * o null si no hay ninguno.
 */
export function getToken() {
  return localStorage.getItem("token") || null;
}

/**
 * Devuelve una cabecera Authorization con Bearer token
 * o un objeto vacío si no hay token.
 * Útil para añadir a cualquier fetch protegido.
 */
export function getAuthHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Comprueba si una respuesta HTTP fue correcta.
 * - Si no lo fue, intenta extraer el mensaje de error del JSON.
 * - Si lo fue, devuelve los datos JSON.
 */
async function handleResponse(response) {
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Error en la petición");
  }
  return response.json();
}

// ============================
// Funciones públicas para usar desde el front
// ============================

/**
 * Llama al backend para iniciar sesión con usuario y contraseña.
 * Si devuelve un token, lo guarda en localStorage.
 * @param {string} username
 * @param {string} password
 */
export async function login(username, password) {
  const res = await fetch(BASE_URL + ENDPOINTS.login, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await handleResponse(res);

  // Si hay token en la respuesta, lo guardamos para futuras peticiones
  if (data.token) localStorage.setItem("token", data.token);

  return data;
}

/**
 * Llama al backend para registrar un nuevo usuario.
 * @param {Object} user - { username, email, password }
 */
export async function register(user) {
  const res = await fetch(BASE_URL + ENDPOINTS.register, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  return handleResponse(res);
}

/**
 * Cierra la sesión actual borrando el token localmente.
 * (no llama al backend si usas JWT stateless)
 */
export function logout() {
  localStorage.removeItem("token");
}

/**
 * Cambia la contraseña de un usuario.
 * El backend debe validar username + email antes de aceptar.
 */
export async function recoverPassword({ username, email, nuevaPassword }) {
  const res = await fetch(`${BASE_URL}/auth/recover`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, nuevaPassword }),
  });

  return handleResponse(res);
}
