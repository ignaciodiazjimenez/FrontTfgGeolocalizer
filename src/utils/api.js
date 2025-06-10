// src/utils/api.js
// ────────────────────────────────────────────────────────────────────────────
// Asegúrate de que en tu archivo `.env` tengas algo como:
//   PUBLIC_API_URL=http://127.0.0.1:8000/api/v2.3
//
// De este modo, todos los endpoints apuntarán a /api/v2.3/usuarios, /api/v2.3/dispositivos, /api/v2.3/registros, etc.
// Si faltase .env, se usará por defecto "http://127.0.0.1:8000/api/v2.3".
// ────────────────────────────────────────────────────────────────────────────

const BASE_URL =
  import.meta.env.PUBLIC_API_URL?.trim().replace(/\/$/, "") ||
  "http://127.0.0.1:8000/api/v2.3";

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

/*──────────────────────────────────────────────────────────────────────────────
  LOGIN / REGISTER / LOGOUT
───────────────────────────────────────────────────────────────────────────────*/

// 1) Login por username (token_username)
export async function login(username, password) {
  const res = await fetch(`${BASE_URL}/token_username`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await handleResponse(res);
  // Ejemplo de payload: { access_token, token_type:"bearer", role:"user", usuario_id: 3 }
  if (data.access_token) {
    localStorage.setItem("token", data.access_token);
    if (data.role) localStorage.setItem("rol", data.role);
    if (data.usuario_id) localStorage.setItem("user_id", data.usuario_id);
    return data.access_token;
  }
  throw new Error("Token no recibido");
}

// 2) Login por email (token_email)
export async function loginConEmail(email, password) {
  const res = await fetch(`${BASE_URL}/token_email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
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

// 3) Registro de usuario (por defecto rol_id = 3 = “user”)
export async function register({ username, email, password, rol_id = 3 }) {
  const res = await fetch(`${BASE_URL}/usuarios/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, rol_id }),
  });
  return handleResponse(res);
}

// 4) Logout: borramos token, rol y user_id del localStorage
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("rol");
  localStorage.removeItem("user_id");
}

// 5) Extraer rol del token JWT (decodificándolo)
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

// 6) Extraer user_id del localStorage
export function getUserId() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("user_id");
}

/*──────────────────────────────────────────────────────────────────────────────
  USUARIOS CRUD
───────────────────────────────────────────────────────────────────────────────*/

// 1) Obtener todos los usuarios
export async function getUsers() {
  const res = await fetch(`${BASE_URL}/usuarios/`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });
  return handleResponse(res);
}

// 2) Obtener un usuario por ID
export async function getUserById(id) {
  const res = await fetch(`${BASE_URL}/usuarios/${id}`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });
  return handleResponse(res);
}

// 3) Crear un usuario nuevo
//    Body: { username, email, password, rol_id }
export async function createUser({ username, email, password, rol_id }) {
  const res = await fetch(`${BASE_URL}/usuarios/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ username, email, password, rol_id }),
  });
  return handleResponse(res);
}

// 4) Actualizar un usuario existente
//    Body: { username?, email?, password?, rol_id? }
export async function updateUser(id, payload) {
  const res = await fetch(`${BASE_URL}/usuarios/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

// 5) Eliminar un usuario por ID
export async function deleteUser(id) {
  const res = await fetch(`${BASE_URL}/usuarios/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeader(),
    },
  });
  return handleResponse(res);
}

// 6) Pedir cambio de contraseña (request password reset)
//    Endpoint: POST /usuarios/cambiar_contrasena/{usuario_id}
export async function pedirCambioContrasena(usuario_id) {
  const res = await fetch(`${BASE_URL}/usuarios/cambiar_contrasena/${usuario_id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
  });
  return handleResponse(res);
}

// 7) Cambiar contraseña con token recibido
//    Endpoint: POST /usuarios/cambiar_contrasena/{usuario_id}/{token}
export async function cambiarContrasena(usuario_id, token, nuevaPassword) {
  const res = await fetch(
    `${BASE_URL}/usuarios/cambiar_contrasena/${usuario_id}/${token}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: nuevaPassword }),
    }
  );
  return handleResponse(res);
}

/*──────────────────────────────────────────────────────────────────────────────
  ROLES
───────────────────────────────────────────────────────────────────────────────*/

// 1) Obtener lista de roles
export async function getRoles() {
  const res = await fetch(`${BASE_URL}/roles/`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });
  return handleResponse(res);
}

/*──────────────────────────────────────────────────────────────────────────────
  DISPOSITIVOS CRUD
───────────────────────────────────────────────────────────────────────────────*/

// 1) Obtener todos los dispositivos (general)
//    Endpoint: GET /dispositivos
export async function getAllDispositivos() {
  const res = await fetch(`${BASE_URL}/dispositivos/`, {
    headers: {
      ...getAuthHeader(),
    },
  });
  return handleResponse(res);
}

// 2) Obtener dispositivos de un usuario específico
//    Endpoint: GET /dispositivos/usuario/{usuario_id}
export async function getDispositivosUsuario(usuario_id) {
  const res = await fetch(`${BASE_URL}/dispositivos/usuario/${usuario_id}`, {
    headers: {
      ...getAuthHeader(),
    },
  });
  return handleResponse(res);
}

// 2.b) Obtener solo los IDs de los dispositivos de un usuario
export async function getIdDispositivosUsuario(usuario_id) {
  const res = await fetch(`${BASE_URL}/dispositivos/usuario/${usuario_id}`, {
    headers: {
      ...getAuthHeader(),
    },
  });
  const dispositivos = await handleResponse(res);
  // Devolver solo un array de ids
  return dispositivos.map(d => d.id);
}

// 3) Obtener un dispositivo por su ID
//    Endpoint: GET /dispositivos/{dispositivo_id}
export async function getDispositivoById(id) {
  const res = await fetch(`${BASE_URL}/dispositivos/${id}`, {
    headers: { ...getAuthHeader() },
  });
  return handleResponse(res);
}

// 4) Crear un dispositivo nuevo para un usuario determinado
//    Endpoint: POST /dispositivos/{usuario_id}
export async function createDispositivo(data) {
  const usuarioId = data.usuario_id || getUserId();
  if (!usuarioId) {
    throw new Error("No se pudo determinar el usuario para crear el dispositivo");
  }

  const res = await fetch(`${BASE_URL}/dispositivos/${usuarioId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({
      mac: data.mac,
      nombre: data.nombre,
      active: data.active,
    }),
  });

  return handleResponse(res);
}

// 5) Actualizar un dispositivo existente
//    Endpoint: PATCH /dispositivos/{dispositivo_id}
export async function updateDispositivo(id, payload) {
  const res = await fetch(`${BASE_URL}/dispositivos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

// 6) Eliminar un dispositivo por su ID
//    Endpoint: DELETE /dispositivos/{dispositivo_id}
export async function deleteDispositivo(id) {
  const res = await fetch(`${BASE_URL}/dispositivos/${id}`, {
    method: "DELETE",
    headers: { ...getAuthHeader() },
  });
  return handleResponse(res);
}

// 7) Obtener dispositivos junto con sus registros
//    Endpoint: GET /dispositivos/registros/{id_dispositivo}
export async function getDispositivoConRegistros(dispositivo_id) {
  const res = await fetch(`${BASE_URL}/dispositivos/registros/${dispositivo_id}`, {
    headers: { ...getAuthHeader() },
  });
  return handleResponse(res);
}

/*──────────────────────────────────────────────────────────────────────────────
  REGISTROS (GEOLOCALIZACIÓN)
───────────────────────────────────────────────────────────────────────────────*/

// 1) Obtener todos los registros de geolocalización
//    Endpoint: GET /registros/
export async function getRegistros() {
  const res = await fetch(`${BASE_URL}/registros/`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });
  return handleResponse(res);
}

// 2) Crear un nuevo registro de geolocalización
//    Endpoint: POST /registros/
//    Body de ejemplo: { fecha, coordenadas: "lat,lng", mac }
export async function createRegistro({ fecha, coordenadas, mac }) {
  const res = await fetch(`${BASE_URL}/registros/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ fecha, coordenadas, mac }),
  });
  return handleResponse(res);
}
