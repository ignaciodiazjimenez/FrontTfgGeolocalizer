// src/utils/api.js

// 1️⃣ Cambiamos la versión de la API a v2.0
const BASE_URL = "http://localhost:8000/api/v2.0";

/** Auxiliares de auth **/

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function getAuthHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(res) {
  if (!res.ok) {
    // Leer texto para mostrar detalle
    const text = await res.text().catch(() => "");
    throw new Error(text || "Error en la petición");
  }
  return res.json();
}

/** Autenticación **/

/**
 * POST /token
 * Ahora enviamos JSON { username, password }
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
    // Guardamos el token
    localStorage.setItem("token", data.access_token);
    return data.access_token;
  }

  throw new Error("Token no recibido");
}

export function logout() {
  localStorage.removeItem("token");
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

/** Usuarios (admin) **/

export async function register(user) {
  const res = await fetch(`${BASE_URL}/usuarios/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(user),
  });
  return handleResponse(res);
}

export async function getUsers() {
  const res = await fetch(`${BASE_URL}/usuarios/`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });
  return handleResponse(res);
}

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

/** Dispositivos **/

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

export async function getDispositivosUsuario() {
  const userId = getUserId();
  const res = await fetch(
    `${BASE_URL}/dispositivos/usuario/${userId}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    }
  );
  return handleResponse(res);
}

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

/** Recuperación de contraseña **/

export async function solicitarRecuperacion(email) {
  const res = await fetch(`${BASE_URL}/usuarios/solicitar_recuperacion`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return handleResponse(res);
}

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
