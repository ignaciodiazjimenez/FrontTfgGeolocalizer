"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  ZoomControl,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/****************************
 *    Iconos personalizados *
 ****************************/
const blackPinUrl = "/assets/vectors/icononegro.svg";
const redPinUrl = "/assets/vectors/iconorojo.svg";

const blackIcon = L.icon({
  iconUrl: blackPinUrl,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

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

/*********************************************
 *  Componente auxiliar para centrar el mapa *
 *********************************************/
function MapCenterer({ coords }) {
  const map = useMap();
  React.useEffect(() => {
    if (coords) {
      map.flyTo(coords, 16, { animate: true, duration: 1 });
    }
  }, [coords, map]);
  return null;
}

export default function Mapa() {
  // -------- Config base --------
  const lopeDeVega = [37.885851, -4.7546533]; // centro por defecto
  const defaultId = "_default_center_";       // id ficticio para el marcador inicial

  /** Estado **/
  const [devices, setDevices] = useState([]);                // [{ id, nombre, coords }]
  const [selectedId, setSelectedId] = useState(defaultId);   // marcador activo (empieza en centro por defecto)

  /** Refs **/
  const mapRef = useRef(null); // instancia Leaflet Map (por si se necesita en otro sitio)

  /*****************************
   *   Carga periódica datos   *
   *****************************/
  const cargar = async () => {
    const usuarioId = getUserId();
    if (!usuarioId) return;

    try {
      const lista = await getDispositivosUsuario(usuarioId); // 1) Dispositivos

      const detalles = await Promise.all(
        lista.map((d) => getDispositivoConRegistros(d.id))    // 2) Últimos registros
      );

      const withCoords = detalles
        .map((d) => {
          const ultimo = d.registros?.at(-1);
          if (!ultimo) return null;

          const [lat, lng] = ultimo.coordenadas.split(",").map((s) => parseFloat(s.trim()));
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

  /******************
   *   Seleccionar  *
   ******************/
  const handleSelect = (idOrDev) => {
    const id = typeof idOrDev === "string" ? idOrDev : idOrDev.id;
    setSelectedId(id);
  };

  // Coordenadas del elemento seleccionado (dispositivo o centro por defecto)
  const selectedCoords =
    selectedId === defaultId
      ? lopeDeVega
      : devices.find((d) => d.id === selectedId)?.coords;

  const initialCenter = lopeDeVega; // siempre empezamos centrados aquí

  /************* Render *************/
  return (
    <div className="w-full max-w-5xl bg-white/20 backdrop-blur-md rounded-xl border border-white/40 shadow-xl p-6">
      <h2 className="text-3xl font-bold text-[#2F3E2E] text-center mb-4">
        Geolocalizaciones
      </h2>

      <div className="flex h-[500px] gap-4">
        {/* Lista lateral */}
        <ul className="max-w-xs w-full bg-white/30 backdrop-blur-md rounded-xl border border-white/40 p-4 overflow-auto">
          {/* Entrada ficticia para el punto central */}
          <li className="mb-2">
            <button
              className={`block w-full text-left p-2 rounded border transition ${
                selectedId === defaultId ? "bg-white/60 border-blue-500" : "hover:bg-white/50 border-transparent"
              }`}
              onClick={() => handleSelect(defaultId)}
            >
              <strong>Lope de Vega</strong>
              <br />
              {lopeDeVega[0].toFixed(6)}, {lopeDeVega[1].toFixed(6)}
            </button>
          </li>

          {devices.length ? (
            devices.map((dev) => (
              <li key={dev.id} className="mb-2">
                <button
                  className={`block w-full text-left p-2 rounded border transition ${
                    selectedId === dev.id ? "bg-white/60 border-blue-500" : "hover:bg-white/50 border-transparent"
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
            <li className="text-center text-sm text-gray-600">No hay posiciones registradas.</li>
          )}
        </ul>

        {/* Contenedor del mapa */}
        <div className="flex-1 rounded-lg overflow-hidden border border-white/30">
          <MapContainer
            center={initialCenter}
            zoom={16}
            scrollWheelZoom
            zoomControl={false}
            whenCreated={(m) => (mapRef.current = m)}
            style={{ height: "100%", width: "100%" }}
          >
            {/* Centrar cuando cambia la selección */}
            <MapCenterer coords={selectedCoords} />

            <ZoomControl position="bottomleft" />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Marcador inicial */}
            <Marker
              position={lopeDeVega}
              icon={selectedId === defaultId ? redIcon : blackIcon}
              eventHandlers={{ click: () => handleSelect(defaultId) }}
            >
              <Popup>
                <strong>Lope de Vega</strong>
                <br />
                {lopeDeVega[0].toFixed(6)}, {lopeDeVega[1].toFixed(6)}
              </Popup>
            </Marker>

            {/* Marcadores de dispositivos */}
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