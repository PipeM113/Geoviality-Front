import { useCallback, useEffect, useRef, useState } from "react";
import Map, { Source, Layer, MapRef } from "react-map-gl";
import {
  CircleLayerSpecification,
  GeoJSONFeature,
  MapMouseEvent,
} from "mapbox-gl";
import { FeatureCollection } from "geojson";

import "mapbox-gl/dist/mapbox-gl.css";
import { MapLayerList } from "../../hooks/mapa/useGeoJSON";

const mapboxToken = process.env.REACT_APP_MAPBOX_TOKEN || "";
console.log("MapboxGL - Token:", mapboxToken);

type Props = {
  mapLayerData: MapLayerList;
  initLon?: number;
  initLat?: number;
  initZoom?: number;
  onFeatureClick?: (feature: GeoJSONFeature) => void;
};

function CustomMapboxGL({
  mapLayerData,
  initLon = -122.4,
  initLat = 37.8,
  initZoom = 14,
  onFeatureClick,
}: Props) {
  const [mapViewState, setMapViewState] = useState({
    longitude: initLon,
    latitude: initLat,
    zoom: initZoom,
  });

  useEffect(() => {
    setMapViewState({
      longitude: initLon,
      latitude: initLat,
      zoom: initZoom,
    });
  }, [initLon, initLat, initZoom]);

  const renderLayers = () => {
    return mapLayerData.map((layer) => {
      const layerStyle: CircleLayerSpecification = {
        id: layer.layerName,
        source: layer.layerName,
        type: "circle",
        paint: {
          "circle-radius": 10,
          "circle-color": layer.layerColor,
        },
      };

      return (
        <Source
          key={layer.layerName}
          id={layer.layerName}
          type="geojson"
          data={layer.layerData}
        >
          <Layer {...layerStyle} />
        </Source>
      );
    });
  };

  const layerNames = mapLayerData.map((layer) => layer.layerName);

  const handleClick = useCallback(
    (evt: MapMouseEvent) => {
      if (evt.features && evt.features.length > 0) {
        const feature = evt.features[0];
        if (onFeatureClick) {
          onFeatureClick(feature);
        }
      }
    },
    [onFeatureClick]
  );

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Map
        {...mapViewState}
        mapboxAccessToken={mapboxToken}
        onMove={(evt) => setMapViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        interactiveLayerIds={layerNames}
        onClick={handleClick}
      >
        {renderLayers()}
      </Map>
    </div>
  );
}

export default CustomMapboxGL;
