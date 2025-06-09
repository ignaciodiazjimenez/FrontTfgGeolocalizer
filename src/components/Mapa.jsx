// src/components/Mapa.jsx
"use client"; // este componente SOLO se monta en cliente

import React from "react";
import { MapContainer, TileLayer, ZoomControl, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Iconos predeterminados de Leaflet
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl       from "leaflet/dist/images/marker-icon.png";
import shadowUrl     from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

// Icono personalizado
const customIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize:   [36, 36],
  iconAnchor: [18, 36],
  popupAnchor:[0, -36],
  shadowUrl,
  shadowSize:   [41, 41],
  shadowAnchor: [12, 41],
});

export default function Mapa() {
  // Coordenadas de CES Lope de Vega
  const lopeDeVega = [37.886052, -4.754490];

  return (
    <div className="w-full max-w-5xl bg-white/20 backdrop-blur-md rounded-xl border border-white/40 shadow-xl p-6 space-y-4">
      <h2 className="text-3xl font-bold text-[#2F3E2E] text-center">Geolocalizaciones</h2>

      {/* Contenedor del mapa ajustado para no requerir scroll */}
      <div className="group relative w-full h-[400px] md:h-[500px] rounded-lg">
        {/* Glow + blur on hover */}
        <span
          className="pointer-events-none absolute inset-0 rounded-lg bg-accent-primary opacity-0 transition-opacity duration-500 group-hover:opacity-20 group-hover:blur-md"
        />
        {/* Ping lento on hover */}
        <span
          className="pointer-events-none absolute inset-0 rounded-lg border-2 border-accent-primary opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:animate-[ping_5s_linear_infinite]"
        />

        <div className="h-full w-full overflow-hidden rounded-lg border border-white/30">
          <MapContainer
            center={lopeDeVega}
            zoom={16}
            scrollWheelZoom={true}
            zoomControl={false}
            style={{ height: "100%", width: "100%" }}
          >
            <ZoomControl position="bottomleft" />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={lopeDeVega} icon={customIcon}>
              <Popup>
                <strong>CES Lope de Vega</strong><br />
                Calle Peñas Cordobesas s/n, 14010 Córdoba, España
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
