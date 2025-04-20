import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/usables/navbar";
import { Button, Card } from "react-bootstrap";
import CustomMapboxGL from "../components/mapa/CustomMapboxGL";
import { GJSONFeature, MapLayerList } from "../hooks/mapa/useGeoJSON";
import useAPIAuth from "../hooks/useAPIAuth";
import useAPIServer from "../hooks/useAPIServer";
import useFecha from "../hooks/utilidades/useFecha";
import '../components/styles/ModificarDatos.css';
import SidebarImageCarrusel from "../components/usables/SidebarImageCarrusel";

type Props = {
  vereda?: boolean;
};

function ModificarDatos({vereda = false}: Props) {
  const { point_id } = useParams();
  const navigate = useNavigate();
  const fecha_hook = useFecha();

  const apiAuth = useAPIAuth();
  const apiClient = apiAuth.apiAuthClient;
  const apiServer = useAPIServer(apiClient);

  const [pointData, setPointData] = useState<GJSONFeature>({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [0, 0],
    },
    properties: {
      id: "",
      date: "",
      type: [],
      modo: "",
      user: "",
      repair_at: "",
      estado: 0,
      observaciones: "",
      last_update: "",
    },
  });
  const [imageIDs, setImageIDs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (point_id) {
        try {
          let response;
          if (vereda) {
            response = await apiServer.getPointDataSidewalk(point_id);
          } else {
            response = await apiServer.getPointData(point_id);
          }

          console.log("Datos del punto:", response);

          const imageIDArray = response.properties.images;
          if (response) {
            setPointData(response);
            setImageIDs(imageIDArray);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          // Manejo de errores adicional si es necesario
        }
      }
    };

    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  //esto esta hecho como el pico

  //* Variables del punto
  const actual_longitud = pointData.geometry.coordinates[0];
  const actual_latitud = pointData.geometry.coordinates[1];
  const actual_date = pointData.properties.date;
  const actual_estado = pointData.properties.estado;
  const actual_type = pointData.properties.type;
  const actual_imageIDArray = imageIDs;
  const actual_modo = pointData.properties.modo;
  const actual_user = pointData.properties.user;
  const actual_repair_at = pointData.properties.repair_at;
  const actual_observaciones = pointData.properties.observaciones;
  const actual_id = pointData.properties.id;
  const actual_last_update = pointData.properties.last_update;
  //* Fin variable punto

  //* Variables del punto modificado
  const [modificado_estado, setModificadoEstado] = useState(actual_estado);
  const [modificado_type, setModificadoType] = useState(actual_type);
  const [modificado_repair_at, setModificadoRepairAt] = useState(actual_repair_at);
  const [modificado_observaciones, setModificadoObservaciones] = useState(actual_observaciones);
  //* Fin variable punto modificado

  //* Variables para los tipos de eventos
  let tiposDisponibles;
  if (vereda) {
    tiposDisponibles = [
      "acera",
      "ciclovia",
      "poste",
      "cableado",
      "basura",
      "otro",
    ];
  } else {
    tiposDisponibles = [
      "hoyo",
      "hoyo con agua",
      "cocodrilo",
      "grieta",
      "longitudinal",
      "transversal",
      "lomo de toro",
    ];
  }

  const handleTypeChange = (tipo: string) => {
    setModificadoType((prevTypes) =>
      prevTypes.includes(tipo)
        ? prevTypes.filter((t) => t !== tipo)
        : [...prevTypes, tipo]
    );
  };

  useEffect(() => {
    console.log("tipos seleccionados:", modificado_type);
  }, [modificado_type]);
  //* Fin variables tipos de eventos


  //* Funciones para realziar acciones
  const dataToSend = {
    type: modificado_type,
    repair_at: modificado_repair_at,
    estado: modificado_estado,
    observaciones: modificado_observaciones,
  };

  // Actualizar los datos modificados cuando pointData cambie
  useEffect(() => {
    setModificadoEstado(actual_estado);
    setModificadoType(actual_type);
    setModificadoRepairAt(actual_repair_at);
    setModificadoObservaciones(actual_observaciones);
  }, [pointData]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSaveChanges = async () => {
    const confirmacion = window.confirm("¿Estás seguro de que deseas enviar los datos?");
    if (confirmacion && point_id) {
      try {
        console.log("Datos a enviar:", dataToSend);
        let resp;
        if (vereda) {
          resp = await apiServer.putModifyPointSidewalk(point_id, dataToSend);
        } else {
          resp = await apiServer.putModifyPoint(point_id, dataToSend);
        }

        if (resp === 200) {
          navigate("/"); // Redirigir a la página principal
        }
      } catch (error) {
        console.error("Error al enviar los datos:", error);
        // Manejo de errores adicional si es necesario
      }
    } else {
      console.log("Envío de datos cancelado.");
    }
  }

  const handleDeletePoint = async () => {
    const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar este punto?");
    if (confirmacion && point_id) {
      try {
        console.log("Eliminando punto con id:", point_id);
        let resp;
        if (vereda) {
          resp = await apiServer.deletePointSidewalk(point_id);
        } else {
          resp = await apiServer.deletePoint(point_id);
        }

        if (resp === 200) {
          navigate("/"); // Redirigir a la página principal
        }
      } catch (error) {
        console.error("Error al eliminar el punto:", error);
        // Manejo de errores adicional si es necesario
      }
    } else {
      console.log("Eliminación de punto cancelada.");
    }
  };
  //* Fin funciones


  //* Variables del mapa
  const zoom_inicial = 15;
  const mapdata: MapLayerList = [
    {
      layerName: "Puntos",
      layerColor: "#FF0000",
      layerData: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {
              id: actual_id,
              date: actual_date,
              estado: actual_estado,
              type: actual_type,
              modo: actual_modo,
              user: actual_user,
              repair_at: actual_repair_at,
              observaciones: actual_observaciones,
              last_update: actual_last_update,
            },
            geometry: {
              type: "Point",
              coordinates: [actual_longitud, actual_latitud],
            },
          },
        ],
      },
    },
  ];
  //* Fin variables mapa

  return (
    <>
      <div className="modificar-datos-page">
      <Navbar noSelector />
        <div className="modificar-datos-container">
          <Card className="modificar-datos-card">
            <Button style={{ width: "50%" }} variant="primary" onClick={() => window.history.back()}>Volver</Button>
            <div className="header">
              <div className="titulos">
                <h1>Modificar datos</h1>
                <h2>Id: {point_id}</h2>
              </div>
              <div className="imagen-container">
                <SidebarImageCarrusel urisArray={actual_imageIDArray || []} openModal={()=>{}}/>
                {/* <img src={actual_imageIDArray} alt="imagen" className="imagen" /> */}
              </div>
            </div>
            <div className="scrollable">
              <div className="datos">
                <label>Fecha de toma: <span className="texto">{fecha_hook.convertir_date_a_string(actual_date)}</span></label>
                <label>Modo de captura: <span className="texto">{actual_modo}</span></label>
                <label>Autor: <span className="texto">{actual_user}</span></label>
                <label>Última actualización: <span className="texto">{fecha_hook.convertir_date_a_string(actual_last_update)}</span></label>
                <div className="tipos">
                  <label>Tipo:</label>
                  <div className="tipos-grid">
                    {tiposDisponibles.map((tipo) => (
                      <div className="elemento" key={tipo}>
                        <input
                          type="checkbox"
                          checked={modificado_type.includes(tipo)}
                          onChange={() => handleTypeChange(tipo)}
                        />
                        <label>{tipo.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="tipos">
                  <label>Estado:</label>
                  <div className="elemento">
                    <input
                      type="radio"
                      name="estado"
                      value={0}
                      checked={modificado_estado === 0}
                      onChange={() => setModificadoEstado(0)}
                    />
                    <label htmlFor="no-reparado">No reparado</label>
                  </div>
                  <div className="elemento">
                    <input
                      type="radio"
                      name="estado"
                      value={1}
                      checked={modificado_estado === 1}
                      onChange={() => setModificadoEstado(1)}
                    />
                    <label htmlFor="reparado">Reparado</label>
                  </div>
                </div>
                <label>Fecha y hora de reparación:</label>
                <input
                  type="datetime-local"
                  value={modificado_repair_at}
                  onChange={(e) => setModificadoRepairAt(e.target.value)}
                />
                <label>Observaciones:</label>
                <textarea
                  value={modificado_observaciones}
                  onChange={(e) => setModificadoObservaciones(e.target.value)}
                ></textarea>
                <div className="botones-container">
                  <Button variant="primary" className="botones" onClick={handleSaveChanges}>Guardar cambios</Button>
                  <Button variant="danger" className="botones" onClick={handleDeletePoint}>Eliminar punto</Button>
                </div>
              </div>
            </div>
          </Card>
          <div className="map-container">
            <CustomMapboxGL
              mapLayerData={mapdata}
              initLat={actual_latitud}
              initLon={actual_longitud}
              initZoom={zoom_inicial}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default ModificarDatos;
