import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Navbar from '../components/usables/navbar';
import GaleriaHistorica from '../components/usables/GaleriaHistorica'; // Importamos el componente
import useAPIAuth from '../hooks/useAPIAuth';
import useAPIServer from '../hooks/useAPIServer';
import FiltroGaleria from '../components/usables/FiltroGaleria';

/* Falta:

- Modal con foto + info + ver en mapa

 */

// DATOS JSON
export interface ImagenGaleria {
  id: string;
  uri: string; // URI de la imagen que se obtiene mediante getImageById
  tipo: string[];
  anio: number;
  mes: number;
  dia_registro: number;
  coordenadas: {
    lat: number;
    lng: number;
  };
  observaciones: string;
  estado: number;
  modo: string;
  user: string;
  last_update: string;
}

// MAPEO PARA CONSULTA
const mesesMap: { [key: string]: number } = {
  "Enero": 1,
  "Febrero": 2,
  "Marzo": 3,
  "Abril": 4,
  "Mayo": 5,
  "Junio": 6,
  "Julio": 7,
  "Agosto": 8,
  "Septiembre": 9,
  "Octubre": 10,
  "Noviembre": 11,
  "Diciembre": 12
};

const Galeria: React.FC = () => {
  const { anio, mes } = useParams<{ anio: string; mes: string }>();
  const apiAuth = useAPIAuth();
  const apiClient = apiAuth.apiAuthClient;
  const apiServer = useAPIServer(apiClient);

  const [historicalImages, setHistoricalImages] = useState<ImagenGaleria[]>([]);
  const [filteredImages, setFilteredImages] = useState<ImagenGaleria[]>([]);
  const [selectedTipos, setSelectedTipos] = useState<string[]>([]);

  const anioNumber = anio ? parseInt(anio) : undefined;
  const mesNumero: number | undefined = mes && mesesMap[mes] !== undefined ? mesesMap[mes] : undefined;

  useEffect(() => {
    const fetchHistoricalImages = async () => {
      if (anioNumber && mesNumero !== undefined) {
        // Si tenemos un año y un mes específico, consultamos por ese mes
        console.log("Consultando con los parámetros:", { anio: anioNumber, mes: mesNumero });

        const data = await apiServer.getProcessedInfoByDate(anioNumber, mesNumero);

        const processedImages = await Promise.all(data.map(async (item: any) => {
          const uri = await apiServer.getImageById(item.properties.images[0]);

          return {
            id: item.properties.id,
            uri,
            tipo: item.properties.type,
            anio: anioNumber,
            mes: mesNumero,
            dia_registro: item.properties.date,
            coordenadas: {
              lat: item.geometry.coordinates[1],
              lng: item.geometry.coordinates[0],
            },
            observaciones: item.properties.observaciones,
            estado: item.properties.estado,
            modo: item.properties.modo,
            user: item.properties.user,
            last_update: item.properties.last_update,
          };
        }));

        setHistoricalImages(processedImages);
        setFilteredImages(processedImages); // Inicialmente mostrar todas las imágenes
      } else if (anioNumber && mesNumero === undefined) {
        // Si solo tenemos un año, consultamos todos los meses (1 al 12)
        console.log("Consultando por todos los meses del año:", anioNumber);

        const allImages: ImagenGaleria[] = [];
        for (let i = 1; i <= 12; i++) {
          const data = await apiServer.getProcessedInfoByDate(anioNumber, i);

          const processedImages = await Promise.all(data.map(async (item: any) => {
            const uri = await apiServer.getImageById(item.properties.images[0]);

            return {
              id: item.properties.id,
              uri,
              tipo: item.properties.type,
              anio: anioNumber,
              mes: i,
              dia_registro: item.properties.date,
              coordenadas: {
                lat: item.geometry.coordinates[1],
                lng: item.geometry.coordinates[0],
              },
              observaciones: item.properties.observaciones,
              estado: item.properties.estado,
              modo: item.properties.modo,
              user: item.properties.user,
              last_update: item.properties.last_update,
            };
          }));

          allImages.push(...processedImages);
        }

        setHistoricalImages(allImages);
        setFilteredImages(allImages); // Inicialmente mostrar todas las imágenes
      }
    };

    fetchHistoricalImages();
  }, [anioNumber, mesNumero]);

  useEffect(() => {
    // Filtrar las imágenes en base a los tipos seleccionados
    if (selectedTipos.length === 0) {
      setFilteredImages(historicalImages); // Si no hay filtros, mostrar todas las imágenes
    } else {
      const filtered = historicalImages.filter((image) =>
        selectedTipos.some((tipo) => image.tipo.includes(tipo))
      );
      setFilteredImages(filtered);
    }
  }, [selectedTipos, historicalImages]);

  return (
    <div>
      <Navbar />
      <h1 className="m-3 display-4 d-flex align-items-center" style={{ fontWeight: 350 }}>
        <i className="bi bi-images me-3" style={{ color: '#5a5a5a' }}></i>
        {`Galería de fotos de ${mes ? `${mes} ${anioNumber}` : ` ${anioNumber}`}`}
      </h1>
      <hr style={{ border: '1px solid #ccc', margin: '20px 0' }} />

      <Container fluid>
        <Row>
          <Col xs={12} md={3}>
            <FiltroGaleria
              // TIPOS QUE RECIBE EL FILTRO
              tipos={Array.from(new Set(historicalImages.flatMap((img) => img.tipo)))}
              tiposSeleccionados={selectedTipos}
              onTiposSeleccionados={setSelectedTipos}
            />
          </Col>
          <Col xs={12} md={9}>
            {filteredImages.length > 0 ? (
              <GaleriaHistorica images={filteredImages} />
            ) : (
              <p className="m-5">Cargando datos...</p>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Galeria;
