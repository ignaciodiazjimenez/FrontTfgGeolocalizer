"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  ZoomControl,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Rutas a los iconos (están en /public/assets/vectors)
const blackPinUrl = "/assets/vectors/icononegro.svg";
const redPinUrl = "/assets/vectors/iconorojo.svg";

// Icono negro (por defecto)
const blackIcon = L.icon({
  iconUrl: blackPinUrl,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

// Icono rojo (cuando se selecciona)
const redIcon = L.icon({
  iconUrl: redPinUrl,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

import {
  getUserId,
  getDispositivosUsuario,
  getDispositivoConRegistros,
} from "../utils/api";

export default function Mapa() {
  // Centro por defecto (IES Lope de Vega) si no hay posiciones
  const lopeDeVega = [37.885851, -4.7546533];

  /** Estado **/
  const [devices, setDevices] = useState([]);          // [{ id, nombre, coords }]
  const [selectedId, setSelectedId] = useState(null);  // dispositivo "activo"

  /** Refs **/
  const mapRef = useRef(null); // instancia Leaflet Map

  /*****************************
   *   Carga periódica datos   *
   *****************************/
  const cargar = async () => {
    const usuarioId = getUserId();
    if (!usuarioId) return;

    try {
      // 1) Dispositivos del usuario
      const lista = await getDispositivosUsuario(usuarioId);

      // 2) Para cada dispositivo recuperamos sus registros
      const detalles = await Promise.all(
        lista.map((d) => getDispositivoConRegistros(d.id))
      );

      // 3) Tomamos la última coordenada disponible de cada uno
      const withCoords = detalles
        .map((d) => {
          const ultimo = d.registros?.at(-1);
          if (!ultimo) return null;

          const [lat, lng] = ultimo.coordenadas
            .split(",")
            .map((str) => parseFloat(str.trim()));

          return { id: d.id, nombre: d.nombre, coords: [lat, lng] };
        })
        .filter(Boolean);

      setDevices(withCoords);
    } catch (err) {
      console.error("Error cargando posiciones:", err);
    }
  };

  useEffect(() => {
    cargar();
    const interval = setInterval(cargar, 10_000); // refresco cada 10 s
    return () => clearInterval(interval);
  }, []);

  /*****************************************
   *   Centrar mapa al seleccionar equipo  *
   *****************************************/
  const handleSelect = (dev) => {
    setSelectedId(dev.id);
  };

  // Cada vez que cambia selectedId o devices, centramos el mapa
  useEffect(() => {
    if (!selectedId || !mapRef.current) return;
    const dev = devices.find((d) => d.id === selectedId);
    if (dev) {
      mapRef.current.flyTo(dev.coords, 16, { animate: true, duration: 1 });
    }
  }, [selectedId, devices]);

  /************* Render *************/
  const center = devices[0]?.coords ?? lopeDeVega; // centro inicial

  return (
    <div className="w-full max-w-5xl bg-white/20 backdrop-blur-md rounded-xl border border-white/40 shadow-xl p-6">
      <h2 className="text-3xl font-bold text-[#2F3E2E] text-center mb-4">
        Geolocalizaciones
      </h2>

      <div className="flex h-[500px] gap-4">
        {/* Lista lateral */}
        <ul className="max-w-xs w-full bg-white/30 backdrop-blur-md rounded-xl border border-white/40 p-4 overflow-auto">
          {devices.length ? (
            devices.map((dev) => (
              <li key={dev.id} className="mb-2">
                <button
                  className={`block w-full text-left p-2 rounded border transition ${
                    selectedId === dev.id
                      ? "bg-white/60 border-blue-500"
                      : "hover:bg-white/50 border-transparent"
                  }`}
                  onClick={() => handleSelect(dev)}
                >
                  <strong>{dev.nombre}</strong>
                  <br />
                  {dev.coords[0].toFixed(6)}, {dev.coords[1].toFixed(6)}
                </button>
              </li>
            ))
          ) : (
            <li className="text-center text-sm text-gray-600">
              No hay posiciones registradas.
            </li>
          )}
        </ul>

        {/* Contenedor del mapa */}
        <div className="flex-1 rounded-lg overflow-hidden border border-white/30">
          <MapContainer
            center={center}
            zoom={16}
            scrollWheelZoom
            zoomControl={false}
            whenCreated={(m) => (mapRef.current = m)}
            style={{ height: "100%", width: "100%" }}
          >
            <ZoomControl position="bottomleft" />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {devices.map((dev) => (
              <Marker
                key={dev.id}
                position={dev.coords}
                icon={dev.id === selectedId ? redIcon : blackIcon}
                eventHandlers={{ click: () => handleSelect(dev) }}
              >
                <Popup>
                  <strong>{dev.nombre}</strong>
                  <br />
                  {dev.coords[0].toFixed(6)}, {dev.coords[1].toFixed(6)}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}