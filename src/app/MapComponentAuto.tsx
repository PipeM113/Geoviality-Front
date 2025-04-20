import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import Sidebar from './Sidebar';
import '../components/styles/MapComponent.css';
import { parseType } from './funciones';
import useAPIServer from '../hooks/useAPIServer';
import useAPIAuth from '../hooks/useAPIAuth';
import { GJSONFeature, GJSONFeatureCollection, SelectedPoint } from '../hooks/mapa/useGeoJSON';
import '../components/styles/filter.css';
import '../components/styles/MapComponentAuto.css';
import ModalImagenMapa from '../components/usables/ModalImagenMapa';


const mapboxToken = process.env.REACT_APP_MAPBOX_TOKEN || "";
mapboxgl.accessToken = mapboxToken;
const pinConito = require('../imgs/pin_conito.png');

const MapComponentAuto: React.FC = () => {

  // Parametros modal
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentImageUri, setCurrentImageUri] = useState<string>("");

  const mapContainer = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null); // Nueva referencia para el mapa
  const [pointData, setPointData] = useState<GJSONFeature[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<SelectedPoint | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [map_coord_lat, setMap_coord_lat] = useState<number>(-33.491781328186654);
  const [map_coord_lon, setMap_coord_lon] = useState<number>(-70.62230916682716);

  const [eventMessage, setEventMessage] = useState<string | null>(null);

  const apiAuth = useAPIAuth();
  const apiClient = apiAuth.apiAuthClient;
  const apiServer = useAPIServer(apiClient);

  const showEventMessage = (message: string) => {
    setEventMessage(message);
    setTimeout(() => {
      setEventMessage(null);
    }, 3000); // El recuadro desaparecerá después de 3 segundos
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiServer.getProcessedInfo();
        setPointData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  //* UseEffect para la fuente de eventos
  useEffect(() => {
    const direccion_api_eventos = "https://shark-quick-loon.ngrok-free.app/data/events/last_point/web";
    const fuente_evento = new EventSource(direccion_api_eventos);
    console.log("Escuchando por eventos en:", direccion_api_eventos);

    fuente_evento.onmessage = (evento) => {
      console.log("NUEVO EVENTO\nDatos en bruto:\n", evento.data);
      const json_data = JSON.parse(evento.data);
      console.log("Datos en JSON:\n", json_data);
      const newFeature = json_data;

      //? Se asume que el JSON recibido es un Feature de GeoJSON válido
      (async () => {
        setPointData((prevData) => {
          return [...prevData, newFeature];
        });

        const imageIDArray = parseType(newFeature.properties?.images) ?? [];
        const nombreCalle = await apiServer.getStreetNameByCoord(newFeature.geometry.coordinates[0], newFeature.geometry.coordinates[1]);

        setSelectedPoint({
          id: newFeature.properties?.id ?? 'No disponible',
          date: newFeature.properties?.date ?? 'Desconocida',
          estado: newFeature.properties?.estado ?? 'Desconocida',
          type: newFeature.properties?.type,
          imageIDArray: imageIDArray || undefined,
          modo: newFeature.properties?.modo ?? 'Desconocido',
          user: newFeature.properties?.user ?? 'Desconocido',
          repair_at: newFeature.properties?.repair_at ?? 'Desconocido',
          observaciones: newFeature.properties?.observaciones ?? '',
          last_update: newFeature.properties?.last_update ?? 'Desconocido',
          nombreCalle: nombreCalle,
        });

        setSidebarVisible(true);

        setMap_coord_lon(newFeature.geometry.coordinates[0]);
        setMap_coord_lat(newFeature.geometry.coordinates[1]);

        showEventMessage(`Nuevo punto recibido.`);
      })();
    };

    fuente_evento.onerror = (error) => {
      console.error(`Error en la fuente de eventos:\n${error}`);
      console.error("Cerrando la fuente de eventos...");
      fuente_evento.close();
    };

    return () => {
      console.error("Cerrando la fuente de eventos...");
      fuente_evento.close();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!mapContainer.current) return;

    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [map_coord_lon+0.0005, map_coord_lat],
      zoom: 16,
    });

    mapInstance.on('load', () => {
      setMap(mapInstance); // Guarda la referencia del mapa

      const geojsonData: GJSONFeatureCollection = {
        type: 'FeatureCollection',
        features: pointData
      };

      mapInstance.loadImage(pinConito, (error, image) => {
        if (error) throw error;

        if (image) {
          mapInstance.addImage('pinconito', image);
        }

        if (geojsonData.features.length > 0) {
          mapInstance.addSource('points', {
            type: 'geojson',
            data: geojsonData,
          });

          mapInstance.addLayer({
            id: 'points-layer',
            type: 'symbol',
            source: 'points',
            layout: {
              'icon-image': 'pinconito',
              'icon-size': 0.08,
              'text-field': ['number-format', ['length', ['get', 'images']], {}],
              'text-size': 25,
              'text-offset': [0, -2.5],
              'text-anchor': 'top',
            },
            paint: {
              'text-color': '#000000',
            },
          });
        }
      });

      mapInstance.on('click', 'points-layer', async (e: mapboxgl.MapMouseEvent) => {
        setLoading(true);
        const features = e.features;
        console.log('Features al hacer click:', features);

        if (!features || features.length === 0) return;

        const feature = features[0];
        const properties = feature.properties || {};

        const id = properties.id ?? 'No disponible';
        const date = properties.date ?? 'Desconocida';
        const estado = properties.estado ?? 'Desconocida';

        const modo = properties.modo ?? 'Desconocido';
        const user = properties.user ?? 'Desconocido';
        const repair_at = properties.repair_at ?? 'Desconocido';
        const last_update = properties.last_update ?? 'Desconocido';

        const observaciones = properties.observaciones ?? '';

        //TODO: Mejorar esto. TypeArray es suficiente para mostrar en el sidebar
        const typeArray = parseType(properties.type);
        const type = typeArray.length > 0 ? typeArray.join(', ') : 'Desconocido';

        const imageIDArray = parseType(properties.images) ?? [];

          setSelectedPoint({
            id: id,
            date: date,
            estado: estado,
            type: type.split(', '),
            imageIDArray: imageIDArray || undefined,
            modo: modo,
            user: user,
            repair_at: repair_at,
            observaciones: observaciones,
            last_update: last_update,
          });

        setSidebarVisible(true);
        setLoading(false);
      });

      mapInstance.on('mouseenter', 'points-layer', () => {
        mapInstance.getCanvas().style.cursor = 'pointer';
      });

      mapInstance.on('mouseleave', 'points-layer', () => {
        mapInstance.getCanvas().style.cursor = '';
      });

      setLoading(false);
    });

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [pointData, map_coord_lat, map_coord_lon]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCloseSidebar = () => {
    setSidebarVisible(false);
  };

  const openModal = (imageUri: string) => {
    setCurrentImageUri(imageUri);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const renderLoadingPrompt = () => {
    if (!loading) return null;

    return (
      <div className="loading-prompt" style={{ zIndex: 10, position: 'fixed', bottom: '20px', left: '300px', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '10px', borderRadius: '5px' }}>
        <p style={{ color: "white", fontSize: 50, display: 'flex', alignItems: 'center' }}>
          <img src={require("../imgs/loading.gif")} alt="loading" style={{ width: 50, height: 50, marginRight: '10px' }} />
          <span style={{ marginRight: '10px' }}>Cargando...</span>
        </p>
      </div>
    );
  };

  //* Probar menasje de evento: Mostrar mensaje despues de pasar 5 segundos
  // useEffect(() => {
  //   setTimeout(() => {
  //     showEventMessage('¡Nuevo evento recibido!');
  //   }, 5000);
  // }
  //   , []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="map-container">
      {renderLoadingPrompt()}
      <div ref={mapContainer} className={`map ${sidebarVisible ? 'map-with-sidebar' : ''}`} />

      <div className='status-container'>
        {eventMessage && (
          <div className="status-box event-message" style={{ top: '20px', bottom: 'auto' }}>
            {eventMessage}
          </div>
        )}

        <div className="status-box">
          Esperando nuevos datos...
        </div>
      </div>

      <Sidebar
        selectedPoint={selectedPoint}
        isVisible={sidebarVisible}
        onClose={handleCloseSidebar}
        openModal={openModal} // Asegúrate de pasar la función openModal aquí
      />
      <ModalImagenMapa isModalOpen={isModalOpen} closeModal={closeModal} imageUrl={currentImageUri} />
    </div>
  );
};

export default MapComponentAuto;
