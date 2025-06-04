
// src/utils/api.js
// ============================================================
// URL base real (puedes sobreescribirla con PUBLIC_API_URL)
const BASE_URL =
  import.meta.env.PUBLIC_API_URL?.trim().replace(/\/$/, "") ||
  "http://127.0.0.1:8000/api/v2.2";

/*──────────────────────── Helpers de auth ─────────────────────*/
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

/*────────────────────────── LOGIN ─────────────────────────────*/
export async function login(username, password) {
  const res = await fetch(`${BASE_URL}/token_username`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await handleResponse(res);

  /** Ejemplo de payload backend:
   * { access_token, token_type:"bearer", role:"user", usuario_id: 3 }
   */
  if (data.access_token) {
    localStorage.setItem("token", data.access_token);
    if (data.role)       localStorage.setItem("rol", data.role);
    if (data.usuario_id) localStorage.setItem("user_id", data.usuario_id);
    return data.access_token;
  }
  throw new Error("Token no recibido");
}

/*────────────────────────── REGISTER ──────────────────────────*/
export async function register({ username, email, password, rol_id = 3 }) {
  const res = await fetch(`${BASE_URL}/usuarios/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, rol_id }),
  });

  return handleResponse(res); // lanza error si falla
}

/*────────────────────────── LOGOUT ────────────────────────────*/
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("rol");
  localStorage.removeItem("user_id");
}

/*─────────────────────── INFO DEL USUARIO ─────────────────────*/
export function getUserRole() {
  // preferimos el rol decodificado del token (fuente única de verdad)
  const token = getToken();
  if (!token) return null;
  try {
    const { role } = JSON.parse(atob(token.split(".")[1]));
    return role || null;
  } catch {
    return null;
  }
}

/*─────────────────────── DISPOSITIVOS CRUD ───────────────────*/
export async function getDispositivos() {
  const res = await fetch(`${BASE_URL}/dispositivos/`, {
    headers: {
      ...getAuthHeader(),
    },
  });
  return handleResponse(res);
}

export async function deleteDispositivo(id) {
  await fetch(`${BASE_URL}/dispositivos/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeader(),
    },
  }).then(handleResponse);
}

export async function createDispositivo({ mac, nombre, active = true }) {
  const usuario_id = localStorage.getItem("user_id");
  if (!usuario_id) throw new Error("user_id no disponible en localStorage");

  const payload = { mac, nombre, active, usuario_id: Number(usuario_id) };

  const res = await fetch(`${BASE_URL}/dispositivos/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
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
    body: JSON.stringify(payload), // { mac?, nombre?, active? }
  });
  return handleResponse(res);
}