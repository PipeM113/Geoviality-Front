import React, { useState } from 'react';
import { Accordion, Row, Col, Button, Card, Modal, Alert } from 'react-bootstrap';
import ChartViewPie from '../usables/ChartViewPie';
import ChartViewBar from '../usables/ChartViewBar';
import ChartViewDate from '../usables/ChartViewDate';
import MapView from '../usables/MapView';
import '../styles/AcordeonHistorico.css';
import '../styles/ModalStyles.css';
import datosHistoricos from '../../scripts/DatosPrueba';
import { DatosHistoricos, IrregularidadesPorTipo } from '../../app/DatosHistoricos';
import { useNavigate } from 'react-router-dom';

interface AccordionComponentProps {
  datos: DatosHistoricos[];
}

const AcordeonHistorico: React.FC<AccordionComponentProps> = ({ datos }) => {
  const [showModal, setShowModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [modalData, setModalData] = useState<DatosHistoricos[]>([]);
  const [isMonthView, setIsMonthView] = useState(false);

  const navigate = useNavigate();

  const handleShow = (data: DatosHistoricos[], monthView: boolean) => {
    setModalData(data);
    setIsMonthView(monthView);
    setShowModal(true);
  };

  const handleShowMap = (data: DatosHistoricos[]) => {
    setModalData(data);
    setShowMapModal(true);
  };

  const handleClose = () => setShowModal(false);
  const handleCloseMap = () => setShowMapModal(false);

  const RedirigirMes = (anio: number, mes: string) => {
    // Redirige a la página de galería con los parámetros de año y mes
    navigate(`/galeria/${anio}/${mes}`);
  };

  const RedirigirAnio = (anio: number) => {
    // Redirige a la página de galería con los parámetros de año
    navigate(`/galeria/${anio}`);
  };

  // Mapeo de nombres para los tipos de irregularidades
  const nombresIrregularidades: Record<keyof IrregularidadesPorTipo, string> = {
    hoyo: 'Bache',
    "hoyo con agua": 'Bache con agua',
    grieta: 'Grieta (registro manual)',
    longitudinal: 'Grieta longitudinal',
    transversal: 'Grieta transversal',
    cocodrilo: 'Cocodrilo',
    "lomo de toro": 'Lomo de toro',
  };

  // Agrupar datos por año
  const datosPorAnio = datos.reduce((acumulador, dato) => {
    const { anio } = dato;
    if (!acumulador[anio]) {
      acumulador[anio] = [];
    }
    acumulador[anio].push(dato);
    return acumulador;
  }, {} as Record<number, DatosHistoricos[]>);

  return (
    <div id='acordeon-historico'>
      <div id="busqueda-personalizada">
      <Alert id="nota-busqueda" variant="primary">
        <Alert.Heading>Datos históricos </Alert.Heading>
        <p>
          En esta sección se encuentran todos los registros hasta la actualidad
          de irregularidades detectadas, recopiladas por año y por meses.
        </p>
      </Alert>
      </div>
      <Accordion>
        {Object.entries(datosPorAnio).map(([anio, meses]) => {
          // Sumar irregularidades totales por año
          const totalIrregularidadesAnio = meses.reduce(
            (sum, { irregularidadesTotales }) => sum + irregularidadesTotales,
            0
          );

          // Sumar irregularidades por tipo para el año
          const totalIrregularidadesPorTipo = meses.reduce((acum, { irregularidadesPorTipo }) => {
            Object.entries(irregularidadesPorTipo).forEach(([tipo, cantidad]) => {
              acum[tipo as keyof IrregularidadesPorTipo] = (acum[tipo as keyof IrregularidadesPorTipo] || 0) + cantidad;
            });
            return acum;
          }, {} as IrregularidadesPorTipo);

          const totalIrregularidadesReparadas = meses.reduce(
            (sum, { irregularidadesReparadas }) => sum + irregularidadesReparadas,
            0
          );

          const porcentajeReparacionAnio = totalIrregularidadesAnio > 0

            ? `${((totalIrregularidadesReparadas / totalIrregularidadesAnio) * 100).toFixed(2)}`
            : '0.00%';


          return (
            <Accordion.Item eventKey={anio.toString()} key={anio}>
              <Accordion.Header>{`Año ${anio}`}</Accordion.Header>
              <Accordion.Body>
                <Row>
                  <Col md={6} className="mb-3">
                    <Card>
                      <Card.Body>
                        <Card.Title className="titulo-carta">Resumen Anual</Card.Title>
                        <Card.Text>
                          <ul>
                            <li>
                              <span className="irregularidades-label">Total Irregularidades</span>
                              <span className="irregularidades-value">{totalIrregularidadesAnio}</span>
                            </li>
                            <li>
                              <span className="irregularidades-label">Irregularidades reparadas</span>
                              <span className="irregularidades-value">{porcentajeReparacionAnio}%</span>
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
                            {Object.entries(totalIrregularidadesPorTipo).map(([tipo, cantidad]) => (
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
                  <Button className="botones" onClick={() => handleShow(meses, false)}>Gráficos</Button>
                  <Button className="botones" onClick={() => handleShowMap(meses)}>Mapa</Button>
                  <Button className="botones" onClick={() => RedirigirAnio(Number(anio))}>Galería</Button>  {/* Ajusta el mes según sea necesario */}

                </div>
                {/* Acordeon por meses  */}
                <Accordion>
                  <Accordion.Item eventKey="meses">
                    <Accordion.Header>Revisar mes específico</Accordion.Header>
                    <Accordion.Body>
                      <Accordion>
                      {meses.map(({ mes, irregularidadesTotales, irregularidadesPorTipo, coordenadas, irregularidadesReparadas }) => {
                        // Calcula el porcentaje de irregularidades reparadas
                        const porcentajeReparacion = irregularidadesTotales > 0
                          ? ((irregularidadesReparadas / irregularidadesTotales) * 100).toFixed(2)
                          : 'N/A';

                        return (
                          <Accordion.Item eventKey={mes} key={mes}>
                            <Accordion.Header>{mes}</Accordion.Header>
                            <Accordion.Body>
                              <Row>
                                <Col md={6} className="mb-3">
                                  <Card>
                                    <Card.Body>
                                      <Card.Title className="titulo-carta">Resumen</Card.Title>
                                      <Card.Text>
                                        <ul>
                                          <li>
                                            <span className="irregularidades-label">Total Irregularidades</span>
                                            <span className="irregularidades-value">{irregularidadesTotales}</span>
                                          </li>
                                          <li>
                                            <span className="irregularidades-label">Irregularidades reparadas</span>
                                            <span className="irregularidades-value">{porcentajeReparacion}%</span>
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
                                          {Object.entries(irregularidadesPorTipo).map(([tipo, cantidad]) => (
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
                                <Button className="botones" onClick={() => handleShow([{ anio: Number(anio), mes, irregularidadesTotales, irregularidadesPorTipo, coordenadas, irregularidadesReparadas }], true)}>Gráficos</Button>
                                <Button className="botones" onClick={() => handleShowMap([{ anio: Number(anio), mes, irregularidadesTotales, irregularidadesPorTipo, coordenadas, irregularidadesReparadas }])}>Mapa</Button>
                                <Button className="botones" onClick={() => RedirigirMes(Number(anio), mes)}>Galería</Button>  {/* Ajusta el mes según sea necesario */}
                              </div>

                            </Accordion.Body>
                          </Accordion.Item>
                        );
                      })}
                      </Accordion>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>

              </Accordion.Body>
            </Accordion.Item>
          );
        })}
      </Accordion>

      {/* Modal para gráficos */}
      <Modal show={showModal} onHide={handleClose} dialogClassName="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>Gráficos</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body">
          <Row>
            <Col md={6}>
              <Card className="modal-card">
                <Card.Body className="modal-card-body">
                  <ChartViewPie data={modalData} />
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="modal-card">
                <Card.Body className="modal-card-body">
                  <ChartViewBar data={modalData} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
          {!isMonthView && (
            <Row className="mt-3">
              <Col md={12}>
                <Card className="modal-card">
                  <Card.Body className="modal-card-body">
                    <ChartViewDate data={modalData} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para la vista del mapa */}
      <Modal show={showMapModal} onHide={handleCloseMap} dialogClassName="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>Vista Mapa</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body">
          <MapView data={modalData} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseMap}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>


    </div>
  );
};

export default AcordeonHistorico;
