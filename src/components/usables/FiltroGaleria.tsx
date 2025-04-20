import React from 'react';
import { Accordion, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/FiltroGaleria.css';

interface FiltroTiposProps {
  tipos: string[];
  tiposSeleccionados: string[];
  onTiposSeleccionados: (tipos: string[]) => void;
}

const FiltroGaleria: React.FC<FiltroTiposProps> = ({ tipos, tiposSeleccionados, onTiposSeleccionados }) => {
  const navigate = useNavigate();

  const handleCheckboxChange = (tipo: string) => {
    const nuevosTiposSeleccionados = tiposSeleccionados.includes(tipo)
      ? tiposSeleccionados.filter((t) => t !== tipo)
      : [...tiposSeleccionados, tipo];
    onTiposSeleccionados(nuevosTiposSeleccionados);
  };

  const handleRedirect = () => {
    navigate('/historicos');
  };

  return (
    <div id="filtro-galeria" className="filtro-container">
      <Button
        onClick={handleRedirect}
        className="boton-volver-filtro"
      >
        Volver
      </Button>
      <h5 className="filtro-titulo">Filtrar por tipo:</h5>

      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header className="filtro-header">
            <i className="bi bi-caret-down-fill me-2"></i>
            <span className="texto-ocultar">Seleccionar tipo(s) irregularidad(es)</span>
          </Accordion.Header>
          <Accordion.Body>
            <Form>
              {tipos.map((tipo) => {
                const tipoConPrimeraMayuscula = tipo.charAt(0).toUpperCase() + tipo.slice(1); // String final del tipo
                return (
                  <Form.Check
                    key={tipo}
                    type="checkbox"
                    label={tipoConPrimeraMayuscula}
                    checked={tiposSeleccionados.includes(tipo)}
                    onChange={() => handleCheckboxChange(tipo)}
                    className="check-opcion"
                  />
                );
              })}
            </Form>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default FiltroGaleria;
