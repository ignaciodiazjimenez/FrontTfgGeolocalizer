// src/utils/api.js
// ────────────────────────────────────────────────────────────────────────────
// Asegúrate de que en tu .env esté definido sin slash al final, por ejemplo:
//   PUBLIC_API_URL=http://127.0.0.1:8000/api/v2.2

const BASE_URL =
  import.meta.env.PUBLIC_API_URL?.trim().replace(/\/$/, "") ||
  "http://127.0.0.1:8000/api/v2.2";

/*──────────────────────── Helpers de autenticación ──────────────────────────*/
export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token") || null;
}

export function getAuthHeader() {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
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

/*────────────────────────── LOGIN ──────────────────────────────*/
export async function login(username, password) {
  const res = await fetch(`${BASE_URL}/token_username`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await handleResponse(res);
  if (data.access_token) {
    localStorage.setItem("token", data.access_token);
    if (data.role) localStorage.setItem("rol", data.role);
    if (data.usuario_id) localStorage.setItem("user_id", data.usuario_id);
    return data.access_token;
  }
  throw new Error("Token no recibido");
}

/*────────────────────────── REGISTER ───────────────────────────*/
export async function register({ username, email, password, rol_id = 3 }) {
  const res = await fetch(`${BASE_URL}/usuarios/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, rol_id }),
  });
  return handleResponse(res);
}

/*────────────────────────── LOGOUT ──────────────────────────────*/
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("rol");
  localStorage.removeItem("user_id");
}

/*─────────────────────── INFO DE USUARIO ───────────────────────*/
export function getUserRole() {
  const token = getToken();
  if (!token) return null;
  try {
    const { role } = JSON.parse(atob(token.split(".")[1]));
    return role || null;
  } catch {
    return null;
  }
}

/*─────────────────────── DISPOSITIVOS CRUD ─────────────────────*/

// 1) Obtener todos los dispositivos de un usuario concreto
//    GET /api/v2.2/dispositivos/usuario/{usuario_id}
export async function getDispositivos() {
  const usuario_id = localStorage.getItem("user_id");
  if (!usuario_id) throw new Error("user_id no disponible en localStorage");

  const url = `${BASE_URL}/dispositivos/usuario/${usuario_id}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });
  return handleResponse(res);
}

// 2) Eliminar un dispositivo por su ID
//    DELETE /api/v2.2/dispositivos/{dispositivo_id}
export async function deleteDispositivo(id) {
  const url = `${BASE_URL}/dispositivos/${id}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      ...getAuthHeader(),
    },
  });
  return handleResponse(res);
}

// 3) Crear un dispositivo nuevo
//    POST /api/v2.2/dispositivos/{id_usuario}
//    Body (JSON): { mac, nombre, active }
export async function createDispositivo({ mac, nombre, active = true }) {
  const usuario_id = localStorage.getItem("user_id");
  if (!usuario_id) throw new Error("user_id no disponible en localStorage");

  const payload = {
    mac,
    nombre,
    active,
  };

  // Según Swagger: POST /dispositivos/{id_usuario}
  const url = `${BASE_URL}/dispositivos/${usuario_id}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}

// 4) Actualizar un dispositivo existente
//    PATCH /api/v2.2/dispositivos/{dispositivo_id}
//    Body (JSON): { mac?, nombre?, active? }
export async function updateDispositivo(id, payload) {
  const url = `${BASE_URL}/dispositivos/${id}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}
