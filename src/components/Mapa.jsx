// src/components/Mapa.jsx
"use client"; // obliga a que este componente SOLO se monte en el cliente

import React from "react";
import { MapContainer, TileLayer, ZoomControl, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Importamos de manera estática las imágenes para el icono de Leaflet (shadow)
/* (estos siguen siendo necesarios para que se vea bien la sombra del marcador) */
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl       from "leaflet/dist/images/marker-icon.png";
import shadowUrl     from "leaflet/dist/images/marker-shadow.png";

import "leaflet/dist/leaflet.css";

// ─── ARREGLAR ICONOS POR DEFECTO DE LEAFLET ──────────────────────────────
// Sin esto, los marcadores predeterminados pueden no mostrarse correctamente en React/Vite/Astro:
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});
// ─────────────────────────────────────────────────────────────────────────


// ─── ICONO PERSONALIZADO ──────────────────────────────────────────────────
// En este ejemplo utilizamos una imagen PNG “bonita” desde un CDN.
// Tú puedes sustituir esta URL por la ruta a un SVG/PNG local que prefieras:
//   - Por ejemplo: "/assets/marker-red.png" (si lo pones dentro de /public/assets/marker-red.png)
//   - O bien otra URL externa.
const customIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png", // ejemplo de pin bonito
  iconSize:     [36, 36],  // tamaño en píxeles del icono
  iconAnchor:   [18, 36],  // punto (x,y) dentro de la imagen que “apunta” a la coordenada (ej. la punta del pin)
  popupAnchor:  [0, -36],  // punto (x,y) donde se abre el popup, relativo al iconAnchor
  shadowUrl,               // mantenemos la misma sombra que el predeterminado de Leaflet
  shadowSize:   [41, 41],  // tamaño de la sombra (puedes ajustarlo)
  shadowAnchor: [12, 41],  // punto ancla de la sombra
});
// ─────────────────────────────────────────────────────────────────────────


export default function Mapa() {
  // Centro de prueba: coordenadas aproximadas del CES Lope de Vega en Córdoba
  const lopeDeVega = [37.8889, -4.7813];

  return (
    <div className="w-full max-w-5xl bg-white/20 backdrop-blur-md rounded-xl border border-white/40 shadow-xl p-6 space-y-4">
      {/* ─── TÍTULO ───────────────────────────────────────────────────────────── */}
      <h2 className="text-3xl font-bold text-[#2F3E2E] text-center">Geolocalizaciones</h2>

      {/* ─── CONTENEDOR DEL MAPA ───────────────────────────────────────────────── */}
      <div className="h-[600px] w-full rounded-lg overflow-hidden border border-white/30">
        <MapContainer
          center={lopeDeVega}
          zoom={15}
          scrollWheelZoom={true}
          zoomControl={false}  /* Quitamos el zoom nativo para usar ZoomControl personalizado */
          style={{ height: "100%", width: "100%" }}
        >
          {/* Control de zoom en la esquina inferior izquierda */}
          <ZoomControl position="bottomleft" />

          {/* Capa base de OpenStreetMap */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Un único marker de ejemplo, usando nuestro customIcon */}
          <Marker position={lopeDeVega} icon={customIcon}>
            <Popup>
              <strong>Ubicación</strong> CES Lope de Vega.
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
