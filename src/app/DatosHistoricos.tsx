import React, { useEffect, useState } from 'react';
import AcordeonHistorico from '../components/usables/AcordeonHistorico';
import datosHistoricos from '../scripts/DatosPrueba';
import Navbar from '../components/usables/navbar';
import BusquedaAcumulada from '../components/usables/BusquedaAcumulada';
import useAPIAuth from '../hooks/useAPIAuth';
import useAPIServer from '../hooks/useAPIServer';

/* Datos JSON

Para filtrar
Año
Mes

Para mostrar:
Irregularidades totales
Irregularidades totales por cada tipo

Para sacar porcentajes:
Numero irregularidades reparadas
Numero irregularidades reparadas por cada tipo

Para mostrar en el mapa:
Recopilar puntos por mes, con toda su info (por definir)

Revisar /historicos en la app para ver visualización de los registros
*/

export interface IrregularidadesPorTipo {
  hoyo: number;
  grieta: number;
  cocodrilo: number;
  "hoyo con agua": number;
  longitudinal: number;
  transversal: number;
  "lomo de toro": number;
}

export interface DatosHistoricos {
  anio: number;
  mes: string;
  irregularidadesTotales: number;
  irregularidadesReparadas: number;
  irregularidadesPorTipo: IrregularidadesPorTipo;
  coordenadas?: { lat: number; lng: number }[]; // Mantiene las coordenadas, si se utilizan
}

const DatosHistoricos: React.FC = () => {
  const apiAuth = useAPIAuth();
  const apiClient = apiAuth.apiAuthClient;
  const apiServer = useAPIServer(apiClient);

  const [historicalData, setHistoricalData] = useState<DatosHistoricos[] | undefined>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiServer.getHistoricalData();
        setHistoricalData(response as DatosHistoricos[]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  //* La variable 'historicalData' contiene la información de los registros históricos
  //* Vease la terminal al cargar la página /historicos.
  //TODO: Reemplazar 'datosHistoricos' por 'historicalData' en los componentes que lo requieran


  // FALTA:

  // Esconder resultados cuando se modifique la seleccion
  // Centrar valores por tipo

  return (

    <div>
      <Navbar/>
      <h1 className="m-3 display-4 d-flex align-items-center " style={{ fontWeight: 350 }}>
        <i className="bi bi-clock-history me-3" style={{ color: '#5a5a5a'}}></i>
        Registros históricos de irregularidades
      </h1>
      <hr style={{ border: '1px solid #ccc', margin: '20px 0' }} />

      {historicalData ? (
        <>
          <BusquedaAcumulada datos={historicalData} />
          <hr style={{ border: '1px solid #ccc', margin: '20px 0' }} />
          <AcordeonHistorico datos={historicalData} />
          <hr style={{ border: '1px solid #ccc', margin: '20px 0' }} />
        </>
      ) : (
        <p className='m-5'>Cargando datos...</p>
      )
      }

    </div>



  );
};

export default DatosHistoricos;
