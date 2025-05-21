// src/utils/api.js

const BASE_URL = "http://localhost:8000/api/v1.5";

// ————— Auxiliares de autenticación —————

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
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Error en la petición");
  }
  return res.json();
}

// ————— Autenticación —————

/**
 * POST /token
 * Envía username+password como form-urlencoded y devuelve access_token
 */
export async function login(username, password) {
  const form = new URLSearchParams();
  form.append("username", username);
  form.append("password", password);

  const res = await fetch(`${BASE_URL}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
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

// ————— Usuarios (Admin) —————

/**
 * POST /usuarios/
 * Crea un usuario { username, password, email, rol_id }
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
 * GET /usuarios/
 * Obtiene todos los usuarios (requiere token)
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
 * DELETE /usuarios/{usuario_id}
 * Elimina un usuario por ID (requiere token)
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

// ————— Dispositivos —————

/**
 * GET /dispositivos/usuario/{usuario_id}
 * Obtiene dispositivos para el usuario extraído del token
 */
export async function getDispositivosUsuario() {
  const res = await fetch(`${BASE_URL}/dispositivos/usuario/${getUserId()}`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });
  return handleResponse(res);
}

/**
 * DELETE /dispositivos/{dispositivo_id}
 * Elimina un dispositivo por ID (requiere token)
 */
export async function deleteDispositivo(id) {
  const res = await fetch(`${BASE_URL}/dispositivos/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });
  return handleResponse(res);
}

/**
 * Extrae el user_id del payload del JWT
 */
function getUserId() {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub || payload.user_id || payload.id;
  } catch {
    return null;
  }
}

// ————— Recuperación de contraseña —————

/**
 * POST /usuarios/solicitar_recuperacion
 * Pide email para enviar enlace de recuperación
 */
export async function solicitarRecuperacion(email) {
  const res = await fetch(`${BASE_URL}/usuarios/solicitar_recuperacion`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return handleResponse(res);
}

/**
 * POST /usuarios/cambiar_contrasena/{usuario_id}
 * Cambia la contraseña con nuevo password
 */
export async function recoverPassword({ username, email, nueva_password }) {
  const res = await fetch(
    `${BASE_URL}/usuarios/cambiar_contrasena/${username}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, nueva_password }),
    }
  );
  return handleResponse(res);
}
// POST /dispositivos/ — Crear nuevo dispositivo
export async function createDispositivo(device) {
  const res = await fetch(`${BASE_URL}/dispositivos/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(device),
  });
  return handleResponse(res);
}

// PATCH /dispositivos/{dispositivo_id} — Actualizar dispositivo
export async function updateDispositivo(id, payload) {
  const res = await fetch(`${BASE_URL}/dispositivos/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}
