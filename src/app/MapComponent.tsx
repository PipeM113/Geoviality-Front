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
import { useLocation } from 'react-router-dom';
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

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface BoundingBox {
  sw: Coordinate;
  ne: Coordinate;
}

const Mapa: React.FC = () => {

  // Parametros modal
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentImageUri, setCurrentImageUri] = useState<string>("");

  // Parametros de la URL
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initial_lon = params.get('lon') || -70.62230916682716;
  const initial_lat = params.get('lat') || -33.491781328186654;
  const initial_point = params.get('point');
  console.log("Parametros recibidos:", {initial_lon, initial_lat, initial_point});

  const mapContainer = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null); // Nueva referencia para el mapa
  const [pointData, setPointData] = useState<GeoJSONFeature[]>([]);
  const [BachesData, setBachesData] = useState<GeoJSONFeature[]>([]);
  const [LomoData, setLomoData] = useState<GeoJSONFeature[]>([]);
  const [GrietaData, setGrietaData] = useState<GeoJSONFeature[]>([]);
  const [HaguaData, setHaguaData] = useState<GeoJSONFeature[]>([]);
  const [LongitudinalData, setLongitudinalData] = useState<GeoJSONFeature[]>([]);
  const [TransversalData, setTransversalData] = useState<GeoJSONFeature[]>([]);
  const [CocoData, setCocoData] = useState<GeoJSONFeature[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<SelectedPoint | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedCollections, setSelectedCollections] = useState<string[]>(['Hoyo con agua', 'Baches', 'Lomo', 'Grieta', 'Longitudinal', 'Transversal', 'Cocodrilo']);
  const [isAllSelected, setIsAllSelected] = useState<boolean>(true);

  const apiAuth = useAPIAuth();
  const apiClient = apiAuth.apiAuthClient;
  const apiServer = useAPIServer(apiClient);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [data, dataB, dataL, dataG, dataHA, dataLon, dataTran, dataCoco] = await Promise.all([
          apiServer.getProcessedInfo(),
          apiServer.getProcessedInfoByType("hoyo"),
          apiServer.getProcessedInfoByType("lomo-de-toro"),
          apiServer.getProcessedInfoByType("grieta"),
          apiServer.getProcessedInfoByType("hoyo-con-agua"),
          apiServer.getProcessedInfoByType("longitudinal"),
          apiServer.getProcessedInfoByType("transversal"),
          apiServer.getProcessedInfoByType("cocodrilo"),
        ]);
        setPointData(data);
        setBachesData(dataB);
        setLomoData(dataL);
        setGrietaData(dataG);
        setHaguaData(dataHA);
        setLongitudinalData(dataLon);
        setTransversalData(dataTran);
        setCocoData(dataCoco);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterChange = (name: string) => {
    if (name === 'All') {
      setSelectedCollections(['Hoyo con agua', 'Baches', 'Lomo', 'Grieta', 'Longitudinal', 'Transversal', 'Cocodrilo']);
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
    setSelectedCollections(['Hoyo con agua', 'Baches', 'Lomo', 'Grieta', 'Longitudinal', 'Transversal', 'Cocodrilo']);
    setIsAllSelected(true);
  };

  const handleMapPointClick = async (e: mapboxgl.MapMouseEvent) => {
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
  }

  useEffect(() => {
    if (!mapContainer.current) return;

    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [Number(initial_lon), Number(initial_lat)],
      zoom: 16,
    });

    mapInstance.on('load', () => {
      setMap(mapInstance); // Guarda la referencia del mapa

      const geojsonData: GeoJSONFeatureCollection = {
        type: 'FeatureCollection',
        features: [
          ...selectedCollections.includes('Processed Info') ? pointData : [],
          ...selectedCollections.includes('Baches') ? BachesData : [],
          ...selectedCollections.includes('Lomo') ? LomoData : [],
          ...selectedCollections.includes('Grieta') ? GrietaData : [],
          ...selectedCollections.includes('Hoyo con agua') ? HaguaData : [],
          ...selectedCollections.includes('Longitudinal') ? LongitudinalData : [],
          ...selectedCollections.includes('Transversal') ? TransversalData : [],
          ...selectedCollections.includes('Cocodrilo') ? CocoData : [],
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

      mapInstance.on('click', 'points-layer', handleMapPointClick);

      mapInstance.on('mouseenter', 'points-layer', () => {
        mapInstance.getCanvas().style.cursor = 'pointer';
      });

      mapInstance.on('mouseleave', 'points-layer', () => {
        mapInstance.getCanvas().style.cursor = '';
      });

      // Si hay punto inicial en la URL, buscarlo y mostrar la sidebar automaticamente
      if (initial_point) {
        console.log('Hay punto inicial. Buscando feature con id:', initial_point);
        const feature = geojsonData.features.find(f => f.properties?.id === initial_point);
        if (feature) {
          console.log('Feature encontrado:', feature);
          handleMapPointClick({ features: [feature] } as any);
        } else {
          console.log('No se encontró el feature con id:', initial_point);
        }
      }

      setLoading(false);
    });

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [selectedCollections, pointData, BachesData, LomoData, GrietaData, HaguaData, LongitudinalData, TransversalData, CocoData]);

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
    { name: 'Hoyo con agua', geojsonData: { type: 'FeatureCollection', features: HaguaData } },
    { name: 'Baches', geojsonData: { type: 'FeatureCollection', features: BachesData } },
    { name: 'Lomo', geojsonData: { type: 'FeatureCollection', features: LomoData } },
    { name: 'Grieta', geojsonData: { type: 'FeatureCollection', features: GrietaData } },
    { name: 'Longitudinal', geojsonData: { type: 'FeatureCollection', features: LongitudinalData } },
    { name: 'Transversal', geojsonData: { type: 'FeatureCollection', features: TransversalData } },
    { name: 'Cocodrilo', geojsonData: { type: 'FeatureCollection', features: CocoData } },
  ];

  return (
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
      />
      <ModalImagenMapa isModalOpen={isModalOpen} closeModal={closeModal} imageUrl={currentImageUri} />
    </div>
  );
};

export default Mapa;
