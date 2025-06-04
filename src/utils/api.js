// src/utils/api.js
// ==============================
// URL base real del backend
// (todas las peticiones empiezan por /api/v2.2)
const BASE_URL = import.meta.env.PUBLIC_API_URL; // para Vite
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
      localStorage.setItem("rol", data.role || data.rol || "");
      localStorage.setItem("user_id", data.usuario_id); 
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
export async function getDispositivos() {
  console.log(BASE_URL)
  console.log("Haciendo llamada a la API de dispositivos...");
  const token = localStorage.getItem("token");
  const idUsuario = localStorage.getItem("user_id");
  const resp = await fetch(`${BASE_URL}/dispositivos/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json", // opcional, si tu backend lo espera
    },
  });

  console.log("Llamando a la API de dispositivos...");
  if (!resp.ok) throw new Error("Error al listar dispositivos");

  const data = await resp.json();
  return data.map((d) => ({
    id: d.id,
    mac: d.mac,
    nombre: d.nombre,
    active: d.active,
  }));
}


export async function deleteDispositivo(id) {
  const token_delete = localStorage.getItem("token");
  const resp = await fetch(`${BASE_URL}/dispositivos/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token_delete}`,
      "Content-Type": "application/json", // opcional, si tu backend lo espera
    },
  });
  if (!resp.ok) throw new Error("Error al borrar dispositivo");
}

export async function createDispositivo(payload) {
  console.log("Creando dispositivo con payload:", payload);
  const token_create = localStorage.getItem("token");
  // payload = { mac: string, nombre: string, active: boolean }
  const resp = await fetch(`${BASE_URL}/dispositivos/${idUsuario}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token_create}`,
      "Content-Type": "application/json", // opcional, si tu backend lo espera
    },
    body: JSON.stringify(payload),
  });
  if (!resp.ok) throw new Error("Error al crear dispositivo");
  return await resp.json();
}

export async function updateDispositivo(id, payload) {
  console.log(payload);
  const token_update = localStorage.getItem("token");
  // payload = { mac, nombre, active }
  const resp = await fetch(`${BASE_URL}/dispositivos/${id}/`, {
    method: "PATCH",
     headers: {
      Authorization: `Bearer ${token_update}`,
      "Content-Type": "application/json", // opcional, si tu backend lo espera
    },
    body: JSON.stringify(payload),
  });
  if (!resp.ok) throw new Error("Error al actualizar dispositivo");
  return await resp.json();
}
