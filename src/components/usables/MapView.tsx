import React from 'react';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface IrregularidadesPorTipo {
  hoyo: number;
  grieta: number;
  cocodrilo: number;
  "hoyo con agua": number;
  longitudinal: number;
  "lomo de toro": number;
}

interface DatosHistoricos {
  anio: number;
  mes: string;
  irregularidadesTotales: number;
  irregularidadesPorTipo: IrregularidadesPorTipo;
  coordenadas?: { lat: number; lng: number }[];
}

interface MapViewProps {
  data: DatosHistoricos[];
}

const MapView: React.FC<MapViewProps> = ({ data }) => {
  // const mapboxToken = process.env.REACT_APP_MAPBOX_TOKEN || "";
  const mapboxToken = "pk.eyJ1Ijoic3RhdGUxMDEwIiwiYSI6ImNsenQ0ZnlyaTB6NTEycHB4bW9rNWd1dGcifQ.1zLbjL1P2Gshp1wdiM3W5A";

  const initialCoordinates = data.length > 0 && data[0].coordenadas && data[0].coordenadas.length > 0
    ? data[0].coordenadas[0]
    : { lat: -33.50240568622629, lng: -70.64635149652852 };

  return (
    <Map
      initialViewState={{
        latitude: initialCoordinates.lat,
        longitude: initialCoordinates.lng,
        zoom: 11,
      }}
      style={{ width: '60vw', height: '70vh' }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={mapboxToken}
    >
      {data.map((dato, index) =>
        dato.coordenadas?.map((coordenada, i) => (
          <Marker key={`${index}-${i}`} latitude={coordenada.lat} longitude={coordenada.lng}>
            <img src='/pin_conito.png' alt="Marker" style={{ width: '100px', height: '100px' }} />
          </Marker>
        ))
      )}
    </Map>
  );
};

export default MapView;

