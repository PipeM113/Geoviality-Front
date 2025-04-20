import React, { useEffect, useState } from 'react';
import { Map, GeoJSONSource } from 'mapbox-gl';
import SidebarV from './SidebarV'; // Asegúrate de ajustar la ruta a tu archivo de Sidebar
import '../components/styles/SidebarV.css';

interface GeoJsonProperties {
    Baches: number;
    LomoToro: number;
    Cocodrilo: number;
    Longitudinal: number;
    Transversal: number;
    highway: string;
    name: string;
    images: any; // Array de IDs de imágenes de la calle
    [key: string]: any;
}

interface StreetVisualizerProps {
    map: mapboxgl.Map | null;
    geojson: GeoJSON.FeatureCollection | null;
}

const StreetVisualizer: React.FC<StreetVisualizerProps> = ({ map, geojson }) => {
    const [selectedStreet, setSelectedStreet] = useState<string | null>(null);
    const [streetProperties, setStreetProperties] = useState<GeoJsonProperties | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (map && geojson) {
            if (!map.getSource('streets')) {
                map.addSource('streets', {
                    type: 'geojson',
                    data: geojson,
                });

                map.addLayer({
                    id: 'streets-layer',
                    type: 'line',
                    source: 'streets',
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round',
                    },
                    paint: {
                        'line-color': [
                            'case',
                            [
                                '>=',
                                [
                                    '+',
                                    ['get', 'Baches'],
                                    ['get', 'Cocodrilo'],
                                    ['get', 'Longitudinal'],
                                    ['get', 'Transversal'],
                                    ['get', 'LomoToro'],
                                ],
                                3,
                            ],
                            '#ff0000', // Rojo si la suma de irregularidades > 20
                            [
                                '>=',
                                [
                                    '+',
                                    ['get', 'Baches'],
                                    ['get', 'Cocodrilo'],
                                    ['get', 'Longitudinal'],
                                    ['get', 'Transversal'],
                                    ['get', 'LomoToro'],
                                ],
                                1,
                            ],
                            '#ffff00', // Amarillo si la suma de irregularidades entre 10 y 20
                            '#00ff00', // Verde si la suma de irregularidades < 10
                        ],
                        'line-width': 8,
                    },
                });

                const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
                    if (e.features && e.features.length > 0) {
                        const feature = e.features[0];
                        const properties = feature.properties as GeoJsonProperties;

                        properties.images = JSON.parse(properties.images); // Convertir a array de imágenes

                        if (properties) {
                            setSelectedStreet(properties.name || 'Desconocida');
                            setStreetProperties(properties);
                            setSidebarOpen(true); // Abrir la barra lateral al hacer clic
                            console.log(`Propiedades de la calle:`, properties);
                        }
                    }
                };

                const handleMouseEnter = () => {
                    map.getCanvas().style.cursor = 'pointer';
                };

                const handleMouseLeave = () => {
                    map.getCanvas().style.cursor = '';
                };

                map.on('mouseenter', 'streets-layer', handleMouseEnter);
                map.on('mouseleave', 'streets-layer', handleMouseLeave);
                map.on('click', 'streets-layer', handleMapClick);
            } else {
                const source = map.getSource('streets') as GeoJSONSource;
                if (source) {
                    source.setData(geojson);
                }
            }
        }

        return () => {
            if (map) {
              try {
                if (map.getLayer('streets-layer')) {
                    map.removeLayer('streets-layer');
                }
                if (map.getSource('streets')) {
                    map.removeSource('streets');
                }
              } catch (error) {
                console.log('Error al limpiar el mapa:', error);
              }
            }
        };
    }, [map, geojson]);

    return (
        <div style={{ display: 'flex' }}>
            <SidebarV
                streetName={selectedStreet}
                properties={streetProperties}
                images={streetProperties?.images || []} // Pasar el array de imágenes de la calle
                isVisible={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div style={{ flexGrow: 1 }}>
                {/* El mapa se mostrará aquí */}
            </div>
        </div>
    );
};

export default StreetVisualizer;












