import React, { useState, useEffect } from 'react';
import { Accordion, Row, Col, Button, Card, Form, Alert, Modal } from 'react-bootstrap';
import ChartViewPie from '../usables/ChartViewPie';
import ChartViewBar from '../usables/ChartViewBar';
import ChartViewDate from '../usables/ChartViewDate';
import MapView from '../usables/MapView';
import '../styles/BusquedaAcumulada.css';
import { DatosHistoricos, IrregularidadesPorTipo } from '../../app/DatosHistoricos';

interface BusquedaAcumuladaProps {
  datos: DatosHistoricos[];
}

const mesesMapeo: Record<string, number> = {
  Enero: 1,
  Febrero: 2,
  Marzo: 3,
  Abril: 4,
  Mayo: 5,
  Junio: 6,
  Julio: 7,
  Agosto: 8,
  Septiembre: 9,
  Octubre: 10,
  Noviembre: 11,
  Diciembre: 12,
};

// Invertir el mapeo de meses para obtener el nombre del mes a partir del número
const obtenerNombreMes = (numeroMes: number): string => {
  return Object.keys(mesesMapeo).find(key => mesesMapeo[key] === numeroMes) || "";
};

const BusquedaAcumulada: React.FC<BusquedaAcumuladaProps> = ({ datos }) => {
  const [desdeAnio, setDesdeAnio] = useState<number | ''>('');
  const [desdeMes, setDesdeMes] = useState<string>('');
  const [hastaAnio, setHastaAnio] = useState<number | ''>('');
  const [hastaMes, setHastaMes] = useState<string>('');
  const [resultados, setResultados] = useState<DatosHistoricos[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [numeroMeses, setNumeroMeses] = useState<number>(1);
  const [tipoBusqueda, setTipoBusqueda] = useState<'personalizada' | 'ultimosMeses'>('personalizada');

  const handleBusqueda = () => {
    if (!desdeAnio || !desdeMes || !hastaAnio || !hastaMes) {
        console.error("Por favor, seleccione todas las fechas.");
        return;
    }

    const datosFiltrados = datos.filter((dato) => {
      const anio = dato.anio;
      const mes = dato.mes;

      // Obtener el mes numérico usando el mapeo
      const mesNumero = mesesMapeo[mes];

      // Validar que el mes es válido
      if (mesNumero === undefined) {
          console.error(`Mes no válido para el dato: ${mes}`);
          return false;
      }

      // Convertir desdeMes y hastaMes a números
      const desdeMesNumero = parseInt(desdeMes, 10);
      const hastaMesNumero = parseInt(hastaMes, 10);


      // Comprobar si el año de 'dato' está dentro del rango
      if (anio < desdeAnio || anio > hastaAnio) {
          return false;
      }

      // Comprobar si el mes de 'dato' está dentro del rango
      if (anio === desdeAnio && mesNumero < desdeMesNumero) {
          return false;
      }
      if (anio === hastaAnio && mesNumero > hastaMesNumero) {
          return false;
      }

      console.log("DESDE: ", desdeMesNumero);
      console.log("HASTA: ", hastaMesNumero);

      return true;
    });

    console.log("Datos filtrados:", datosFiltrados);
    setTipoBusqueda('personalizada');
    setResultados(datosFiltrados);
  };

  // Busqueda ultimos x meses

  const handleUltimosMeses = () => {
    console.log("Número de meses seleccionados:", numeroMeses);

    const fechaActual = new Date();
    fechaActual.setHours(23, 59, 59, 999); // Final del día actual
    console.log("Fecha actual ajustada:", fechaActual);

    const fechaInicio = new Date(fechaActual);
    fechaInicio.setMonth(fechaActual.getMonth() - (numeroMeses - 1));
    fechaInicio.setDate(1); // Primer día del mes de inicio
    fechaInicio.setHours(0, 0, 0, 0); // Asegurarse de que es el inicio del día
    console.log("Fecha de inicio ajustada:", fechaInicio);

    const datosFiltrados = datos.filter(({ anio, mes }) => {
      const mesNumero = mesesMapeo[mes];
      const fechaDato = new Date(anio, mesNumero - 1);
      const dentroDelRango = fechaDato >= fechaInicio && fechaDato <= fechaActual;
      return dentroDelRango;
    });

    console.log("Datos filtrados:", datosFiltrados);
    setTipoBusqueda('ultimosMeses');
    setResultados(datosFiltrados);
  };

  useEffect(() => {
    handleBusqueda();
  }, [desdeAnio, desdeMes, hastaAnio, hastaMes]);


  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleShowMapModal = () => setShowMapModal(true);
  const handleCloseMapModal = () => setShowMapModal(false);

  // Función para contar los meses únicos en los datos
  const contarMesesUnicos = (data: DatosHistoricos[]) => {
    const mesesUnicos = new Set(data.map(d => `${d.mes} ${d.anio}`));
    return mesesUnicos.size;
  };

  const totalIrregularidades = resultados.reduce((acc, { irregularidadesTotales }) => acc + irregularidadesTotales, 0);
  console.log("Total de irregularidades:", totalIrregularidades);

  const totalReparadas = resultados.reduce((acc, { irregularidadesReparadas }) => acc + irregularidadesReparadas, 0);

  // Calcular el porcentaje total de reparaciones
  const porcentajeTotalReparaciones = totalIrregularidades
  ? `${((totalReparadas / totalIrregularidades) * 100).toFixed(2)}`
  : '0.00%';

  const totalPorTipo = resultados.reduce((acc, { irregularidadesPorTipo }) => {
    for (const [tipo, cantidad] of Object.entries(irregularidadesPorTipo)) {
      acc[tipo as keyof IrregularidadesPorTipo] = (acc[tipo as keyof IrregularidadesPorTipo] || 0) + cantidad;
    }
    return acc;
  }, {} as IrregularidadesPorTipo);



  console.log("Total por tipo:", totalPorTipo);

  const nombresIrregularidades: Record<keyof IrregularidadesPorTipo, string> = {
    hoyo: 'Bache',
    grieta: 'Grieta (registro manual)',
    cocodrilo: 'Cocodrilo',
    "hoyo con agua": 'Bache con agua',
    longitudinal: 'Grieta longitudinal',
    transversal: 'Grieta transversal',
    "lomo de toro": 'Lomo de toro',
  };

  const desdeMesTexto = parseInt(desdeMes, 10);
  const hastaMesTexto = parseInt(hastaMes, 10);

  return (
    <div id="busqueda-personalizada">
      <Alert id="nota-busqueda" variant="primary">
        <Alert.Heading>Búsqueda personalizada</Alert.Heading>
        <p>
          En esta búsqueda se recibe como parámetros dos fechas.
          Una corresponderá a la fecha de inicio, es decir,
          la fecha inicial desde donde se recopilarán datos,
          mientras que la otra será la fecha límite, es decir,
          aquella fecha hasta la cual se recopilarán datos.
        </p>
      </Alert>

      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Desplegar búsqueda personalizada</Accordion.Header>
          <Accordion.Body>
            <Row>

              <h5 id="b-rapida-pers" className="mb-3">Búsqueda personalizada</h5> {/* Indicador de búsqueda rápida */}

              <Col md={4}>
                <span className="desde-label">Fecha inicio (Desde)</span>
                <Form.Control
                  as="select"
                  className="anio-selector"
                  value={desdeAnio}
                  onChange={(e) => {
                    setDesdeAnio(Number(e.target.value));
                  }}
                >
                  <option value="">Seleccione año</option>
                  {Array.from(new Set(datos.map(d => d.anio))).map(anio => (
                    <option key={anio} value={anio}>{anio}</option>
                  ))}
                </Form.Control>
                <Form.Control
                  as="select"
                  className="mes-selector"
                  value={desdeMes}
                  onChange={(e) => {
                    setDesdeMes(e.target.value);
                  }}
                >
                  <option value="">Seleccione mes</option>
                  {["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"].map((mes, index) => (
                    <option key={mes} value={(index + 1).toString()}>{mes}</option>
                  ))}
                </Form.Control>
              </Col>

              <Col md={4}>
                <span className="hasta-label">Fecha límite (Hasta)</span>
                <Form.Control
                  as="select"
                  className="anio-selector"
                  value={hastaAnio}
                  onChange={(e) => {
                    setHastaAnio(Number(e.target.value));
                  }}
                >
                  <option value="">Seleccione año</option>
                  {Array.from(new Set(datos.map(d => d.anio))).map(anio => (
                    <option key={anio} value={anio}>{anio}</option>
                  ))}
                </Form.Control>
                <Form.Control
                  as="select"
                  className="mes-selector"
                  value={hastaMes}
                  onChange={(e) => {
                    setHastaMes(e.target.value);
                  }}
                >
                  <option value="">Seleccione mes</option>
                  {["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"].map((mes, index) => (
                    <option key={mes} value={(index + 1).toString()}>{mes}</option>
                  ))}
                </Form.Control>
              </Col>
            </Row>
            <Button className="boton-buscar" onClick={handleBusqueda}>Buscar</Button>


            {/* Sección de selección de últimos n meses */}
            <div id="ultimos-meses">
              <Row className="mb-3">
                <Col>
                <hr style={{ border: '1px solid #ccc', margin: '20px 0' }} />

                  <h5 id="b-rapida-pers" className="mb-2">Búsqueda rápida</h5> {/* Indicador de búsqueda rápida */}

                  <div className="d-flex align-items-center">
                    <span className="ultimos-meses-label me-2">Recopilar último(s): </span>
                    <Form.Control
                      as="select"
                      value={numeroMeses}
                      onChange={(e) => {
                        setNumeroMeses(Number(e.target.value));
                      }}
                      className="me-2"
                    >
                      {[...Array(12)].map((_, i) => (
                        <option key={i} value={i + 1}>
                          {i + 1} mes{ i === 0 ? '' : 'es'}
                        </option>
                      ))}
                    </Form.Control>
                  </div>
                  <Button className="boton-ultimos-meses" onClick={handleUltimosMeses}>
                    Aplicar
                  </Button>
                </Col>
              </Row>
              <hr style={{ border: '1px solid #ccc', margin: '20px 0' }} />

            </div>

            {resultados.length > 0 && (
              <div>
                <Card className="card-exterior">
                <h5 id="resultado-busqueda-h5" className="text-center m-4">
                  {tipoBusqueda === 'personalizada' ?
                    `Resultados del período entre ${obtenerNombreMes(desdeMesTexto)} de ${desdeAnio} y ${obtenerNombreMes(hastaMesTexto)} de ${hastaAnio}` :
                    `Resultados del(los) último(s) ${numeroMeses} mes(es) desde ${obtenerNombreMes(new Date().getMonth() + 1)} del ${new Date().getFullYear()}`}
                <hr style={{ border: '1px solid #ccc'}} />
                </h5>



                  <Card.Body>
                    <Row className="mb-3">
                      <Col md={6} className="mb-3">
                        <Card>
                          <Card.Body>
                            <Card.Title className="titulo-carta">Resumen</Card.Title>
                            <Card.Text>
                              <ul>
                                <li>
                                  <span className="irregularidades-label">Total Irregularidades</span>
                                  <span className="irregularidades-value">{totalIrregularidades}</span>
                                </li>
                                <li>
                                  <span className="irregularidades-label">Irregularidades reparadas</span>
                                  <span className="irregularidades-value">{porcentajeTotalReparaciones}%</span>
                                </li>
                              </ul>
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>

                      <Col md={6} className="mb-3">
                        <Card>
                          <Card.Body>
                            <Card.Title className="titulo-carta">Tipo</Card.Title>
                            <Card.Text>
                              <ul>
                                {Object.entries(totalPorTipo).map(([tipo, cantidad]) => (
                                  <li key={tipo} className="irregularidad-item">
                                    <span className="tipo-irregularidades">{nombresIrregularidades[tipo as keyof IrregularidadesPorTipo]}</span>
                                    <span className="tipo-irregularidades-value">{cantidad}</span>
                                  </li>
                                ))}
                              </ul>
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>

                    <hr style={{ border: '1px solid #ccc', margin: '20px 0' }} />


                    <div className="container-botones">
                      <Button className="botones" onClick={handleShowModal}>Gráficos</Button>
                      <Button className="botones" onClick={handleShowMapModal}>Mapa</Button>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            )}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {/* Modal para gráficos */}
      <Modal show={showModal} onHide={handleCloseModal} dialogClassName="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>Gráficos</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body">
          <Row>
            <Col md={6}>
              <Card className="modal-card">
                <Card.Body className="modal-card-body">
                  <ChartViewPie data={resultados} />
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="modal-card">
                <Card.Body className="modal-card-body">
                  <ChartViewBar data={resultados} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
          {contarMesesUnicos(resultados) > 1 && (
            <Row className="mt-3">
              <Col md={12}>
                <Card className="modal-card">
                  <Card.Body className="modal-card-body">
                    <ChartViewDate data={resultados} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Modal para la vista del mapa */}
      <Modal show={showMapModal} onHide={handleCloseMapModal} dialogClassName="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>Vista Mapa</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body">
          <MapView data={resultados} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseMapModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BusquedaAcumulada;
