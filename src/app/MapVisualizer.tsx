
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl, { GeoJSONFeature } from 'mapbox-gl';
import '../components/styles/MapComponent.css';
import useAPIServer from '../hooks/useAPIServer';
import useAPIAuth from '../hooks/useAPIAuth';
import StreetVisualizer from './StreetVisualizer'; // Asegúrate de ajustar la ruta a tu archivo de StreetVisualizer

const mapboxToken = process.env.REACT_APP_MAPBOX_TOKEN || "";
mapboxgl.accessToken = mapboxToken;

interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface BoundingBox {
  sw: Coordinate;
  ne: Coordinate;
}

const MapVisualizer: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const [lineData, setLineData] = useState<GeoJSONFeature[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [map, setMap] = useState<mapboxgl.Map | null>(null); // Estado para guardar el mapa

  const apiAuth = useAPIAuth();
  const apiClient = apiAuth.apiAuthClient;
  const apiServer = useAPIServer(apiClient);

  useEffect(() => {
    const fetchData = async (boundingBox: BoundingBox) => {
      try {
        const data = await apiServer.sendStreets(boundingBox); // Envía la bounding box
        setLineData(data); // Cambiado a lineData para reflejar LineString
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Inicializar el mapa
    if (!mapContainer.current) return;

    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-70.62230916682716,-33.491781328186654],
      zoom: 16,
    });

    // Guardar el mapa en el estado
    setMap(mapInstance);

    // Configurar el evento de movimiento del mapa
    mapInstance.on('load', async () => {
      // Obtener la bounding box inicial
      const initialBoundingBox: BoundingBox = {
        sw: { latitude: -33.4990, longitude: -70.6301 }, // Esquina suroeste
        ne: { latitude: -33.4790, longitude: -70.6101 }, // Esquina noreste
      };

      await fetchData(initialBoundingBox);

      setLoading(false);
    });

    // Evento para enviar la bounding box cada vez que el mapa se mueve
    mapInstance.on('moveend', async () => {
      const bounds = mapInstance.getBounds(); // Obtiene los límites del mapa
      setLoading(true);
      // Verificar que los límites no sean nulos
      if (bounds) {
        const boundingBox: BoundingBox = {
          sw: {
            latitude: bounds.getSouthWest().lat, // Esquina suroeste
            longitude: bounds.getSouthWest().lng,
          },
          ne: {
            latitude: bounds.getNorthEast().lat, // Esquina noreste
            longitude: bounds.getNorthEast().lng,
          },
        };
        await fetchData(boundingBox); // Envía la nueva bounding box
        setLoading(false);
      } else {
        console.error('No se pudo obtener los límites del mapa.');
      }
    });

    return () => {
      mapInstance.remove(); // Limpia el mapa al desmontar el componente
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const renderLoadingPrompt = () => {
    if (!loading) return null;

    return (
      <div className="loading-prompt" style={{ zIndex: 10, position: 'fixed', bottom: '20px', left: '20px', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '10px', borderRadius: '5px' }}>
        <p style={{ color: "white", fontSize: 50, display: 'flex', alignItems: 'center' }}>
          <img src={require("../imgs/loading.gif")} alt="loading" style={{ width: 50, height: 50, marginRight: '10px' }} />
          <span style={{ marginRight: '10px' }}>Cargando...</span>
        </p>
      </div>
    );
  };

  return (
    <div className="map-container">
      {renderLoadingPrompt()}

      <div ref={mapContainer} className="map" />

      {/* Aquí pasamos el mapa y los datos geojson al StreetVisualizer */}
      {!loading && map && lineData.length > 0 && (
        <StreetVisualizer
          map={map}
          geojson={{
            type: 'FeatureCollection',
            features: lineData,
          }}
        />
      )}
    </div>
  );
};

export default MapVisualizer;













