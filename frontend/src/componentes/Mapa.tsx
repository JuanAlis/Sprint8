import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// ✅ Tu token de Mapbox
mapboxgl.accessToken =
  "pk.eyJ1IjoianVhbjAwNzEwIiwiYSI6ImNtOG9jdjlxcjAxNGkyeXNiNmRoMXN6MmsifQ.7dpBtJ0O7PdTg12Ge0jPfA";

// 📍 Lista de lugares en Barcelona con categorías
const places = [
  {
    nombre: "Sagrada Familia",
    categoria: "Monumentos",
    coordenadas: [2.1744, 41.4036],
  },
  {
    nombre: "Castell de Montjuïc",
    categoria: "Monumentos",
    coordenadas: [2.167, 41.3633],
  },
  {
    nombre: "Museu Picasso",
    categoria: "Museos",
    coordenadas: [2.1801, 41.3852],
  },
  {
    nombre: "MACBA",
    categoria: "Museos",
    coordenadas: [2.1686, 41.3839],
  },
  {
    nombre: "Parc Güell",
    categoria: "Parques",
    coordenadas: [2.1519, 41.4145],
  },
  {
    nombre: "Parc de la Ciutadella",
    categoria: "Parques",
    coordenadas: [2.1851, 41.3889],
  },
];

const getColorByCategory = (category: string) => {
  switch (category) {
    case "Monumentos":
      return "red";
    case "Museos":
      return "blue";
    case "Parques":
      return "green";
    default:
      return "gray";
  }
};

const Mapa: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  useEffect(() => {
    if (mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [2.1701, 41.3851], // Barcelona
      zoom: 12,
    });
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // 🧹 Eliminar todos los marcadores anteriores
    const existingMarkers = document.querySelectorAll(".mapboxgl-marker");
    existingMarkers.forEach((m) => m.remove());

    const filteredPlaces =
      selectedCategory === "Todos"
        ? places
        : places.filter((p) => p.categoria === selectedCategory);

    // 🔁 Añadir los nuevos marcadores filtrados
    filteredPlaces.forEach((place) => {
      const el = document.createElement("div");
      el.style.backgroundColor = getColorByCategory(place.categoria);
      el.style.width = "15px";
      el.style.height = "15px";
      el.style.borderRadius = "50%";

      new mapboxgl.Marker(el)
        .setLngLat(place.coordenadas)
        .setPopup(new mapboxgl.Popup().setText(place.nombre))
        .addTo(mapRef.current!);
    });
  }, [selectedCategory]);

  return (
    <div style={{ position: "relative" }}>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 10,
          padding: "5px",
          backgroundColor: "white",
          borderRadius: "5px",
        }}
      >
        <option value="Todos">Todos</option>
        <option value="Monumentos">Monumentos</option>
        <option value="Museos">Museos</option>
        <option value="Parques">Parques</option>
      </select>

      <div
        ref={mapContainer}
        style={{ width: "100%", height: "500px", borderRadius: "10px", overflow: "hidden" }}
      />
    </div>
  );
};

export default Mapa;
