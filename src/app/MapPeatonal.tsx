import React, { useEffect, useRef, useState } from 'react';
import mapboxgl, { GeoJSONFeature } from 'mapbox-gl';
import Sidebar from './Sidebar';
import '../components/styles/MapComponent.css';
import { parseType } from './funciones';
import useAPIServer from '../hooks/useAPIServer';
import useAPIAuth from '../hooks/useAPIAuth';
import { SelectedPoint } from '../hooks/mapa/useGeoJSON';
import GeojsonFilter from '../components/mapa/GeojsonFilter';
import '../components/styles/filter.css';
import Navbar from '../components/usables/navbar';
import ModalImagenMapa from '../components/usables/ModalImagenMapa';


const mapboxToken = process.env.REACT_APP_MAPBOX_TOKEN || "";
mapboxgl.accessToken = mapboxToken;
const pinConito = require('../imgs/pin_conito.png');

interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

interface GeojsonCollection {
  name: string;
  geojsonData: GeoJSON.FeatureCollection;
}


const MapaPeatonal: React.FC = () => {

  // Parametros modal
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentImageUri, setCurrentImageUri] = useState<string>("");

  const mapContainer = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null); // Nueva referencia para el mapa
  const [AceraData, setAceraData] = useState<GeoJSONFeature[]>([]);
  const [CicloviaData, setCicloviaData] = useState<GeoJSONFeature[]>([]);
  const [PosteData, setPosteData] = useState<GeoJSONFeature[]>([]);
  const [CableadoData, setCableadoData] = useState<GeoJSONFeature[]>([]);
  const [BasuraData, setBasuraData] = useState<GeoJSONFeature[]>([]);
  const [OtroData, setOtroData] = useState<GeoJSONFeature[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<SelectedPoint | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedCollections, setSelectedCollections] = useState<string[]>(['Acera', 'Ciclovia', 'Poste', 'Cableado', 'Basura', 'Otro']);
  const [isAllSelected, setIsAllSelected] = useState<boolean>(true);

  const apiAuth = useAPIAuth();
  const apiClient = apiAuth.apiAuthClient;
  const apiServer = useAPIServer(apiClient);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ dataA, dataC, dataP,dataCable,dataBasura,dataO] = await Promise.all([
          apiServer.getProcessedInfoByTypeWalk("acera"),
          apiServer.getProcessedInfoByTypeWalk("ciclovia"),
          apiServer.getProcessedInfoByTypeWalk("poste"),
          apiServer.getProcessedInfoByTypeWalk("cableado"),
          apiServer.getProcessedInfoByTypeWalk("basura"),
          apiServer.getProcessedInfoByTypeWalk("otro"),
        ]);
        setAceraData(dataA);
        setCicloviaData(dataC);
        setPosteData(dataP);
        setCableadoData(dataCable);
        setBasuraData(dataBasura);
        setOtroData(dataO);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterChange = (name: string) => {
    if (name === 'All') {
      setSelectedCollections(['Acera', 'Ciclovia', 'Poste', 'Cableado', 'Basura', 'Otro']);
      setIsAllSelected(true);
    } else {
      if (isAllSelected) {
        setSelectedCollections([name]);
      } else {
        setSelectedCollections(prev =>
          prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
        );
      }
      setIsAllSelected(false);
    }
  };

  const handleShowAll = () => {
    setSelectedCollections(['Acera', 'Ciclovia', 'Poste', 'Cableado', 'Basura', 'Otro']);
    setIsAllSelected(true);
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-70.62230916682716,-33.491781328186654],
      zoom: 16,
    });

    mapInstance.on('load', () => {
      setMap(mapInstance); // Guarda la referencia del mapa

      const geojsonData: GeoJSONFeatureCollection = {
        type: 'FeatureCollection',
        features: [
          ...selectedCollections.includes('Acera') ? AceraData : [],
          ...selectedCollections.includes('Ciclovia') ? CicloviaData : [],
          ...selectedCollections.includes('Poste') ? PosteData : [],
          ...selectedCollections.includes('Cableado') ? CableadoData : [],
          ...selectedCollections.includes('Basura') ? BasuraData : [],
          ...selectedCollections.includes('Otro') ? OtroData : [],
        ],
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

        const typeArray = parseType(properties.type);
        const type = typeArray.length > 0 ? typeArray.join(', ') : 'Desconocido';

        const imageIDArray = parseType(properties.images) ?? [];

        const coordinates = feature.geometry.type === 'Point' ? feature.geometry.coordinates : [];
        const nombreCalle = await apiServer.getStreetNameByCoord(coordinates[0] as number, coordinates[1] as number);

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
            nombreCalle: nombreCalle,
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
  }, [selectedCollections, AceraData, CicloviaData, PosteData, CableadoData, BasuraData, OtroData]);

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
      <div className="loading-prompt" style={{ zIndex: 10, position: 'fixed', bottom: '20px', left: '20px', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '10px', borderRadius: '5px' }}>
        <p style={{ color: "white", fontSize: 50, display: 'flex', alignItems: 'center' }}>
          <img src={require("../imgs/loading.gif")} alt="loading" style={{ width: 50, height: 50, marginRight: '10px' }} />
          <span style={{ marginRight: '10px' }}>Cargando...</span>
        </p>
      </div>
    );
  };

  const geojsonCollections: GeojsonCollection[] = [
    { name: 'Acera', geojsonData: { type: 'FeatureCollection', features: AceraData } },
    { name: 'Ciclovia', geojsonData: { type: 'FeatureCollection', features: CicloviaData } },
    { name: 'Poste', geojsonData: { type: 'FeatureCollection', features: PosteData } },
    { name: 'Cableado', geojsonData: { type: 'FeatureCollection', features: CableadoData } },
    { name: 'Basura', geojsonData: { type: 'FeatureCollection', features: BasuraData } },
    { name: 'Otro', geojsonData: { type: 'FeatureCollection', features: OtroData } },
  ];

  return (
    <div style={{flex:1, display: 'flex', flexDirection: 'column', height: "100vh"}}>
      <Navbar /> {/* Navbar sin className */}
      <div className="map-container">
        {renderLoadingPrompt()}
        <GeojsonFilter
          geojsonCollections={geojsonCollections}
          selectedCollections={selectedCollections}
          isAllSelected={isAllSelected}
          onFilterChange={handleFilterChange}
          onShowAll={handleShowAll}
        />
        <div ref={mapContainer} className={`map ${sidebarVisible ? 'map-with-sidebar' : ''}`} />
        <Sidebar
          selectedPoint={selectedPoint}
          isVisible={sidebarVisible}
          onClose={handleCloseSidebar}
          openModal={openModal} // Asegúrate de pasar la función openModal aquí
          vereda
        />
        <ModalImagenMapa isModalOpen={isModalOpen} closeModal={closeModal} imageUrl={currentImageUri} />
      </div>
    </div>
  );
};

export default MapaPeatonal;
