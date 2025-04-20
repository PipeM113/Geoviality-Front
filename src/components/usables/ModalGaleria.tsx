import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { ImagenGaleria } from '../../app/Galeria';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import '../styles/ModalGaleria.css';

interface ModalGaleriaProps {
  show: boolean;
  onHide: () => void;
  image: ImagenGaleria | null;
}

const ModalGaleria: React.FC<ModalGaleriaProps> = ({ show, onHide, image }) => {
  const navigate = useNavigate(); // Usar useNavigate

  // Función para capitalizar la primera letra de cada palabra
  const capitalizeFirstLetter = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  // Función para mostrar el estado de reparación
  const getEstadoReparacion = (estado: number) => {
    return estado === 1 ? 'Reparado' : 'No reparado';
  };

  const handleGoToMap = () => {
    if (image && image.coordenadas) {
      const { lat, lng } = image.coordenadas;
      navigate(`/?point=${image.id}&lon=${lng}&lat=${lat}`); // Redirige a la ruta con coordenadas
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal-galeria"
    >
      <Modal.Body id="modal-galeria">
        {image ? (
          <div className="modal-content">
            <div className="modal-image">
              <img src={image.uri} alt={`Imagen ${image.id}`} className="img-fluid" />
            </div>
            <div className="modal-details">
              <h5 className="titulo-detalles-imagen">Detalles de la imagen del registro</h5>
              <p><strong className="etiqueta-detalles-imagen">ID:</strong> <span className="valor-detalles-imagen">{image.id}</span></p>
              <p><strong className="etiqueta-detalles-imagen">Modo registro:</strong> <span className="valor-detalles-imagen">{capitalizeFirstLetter(image.modo)}</span></p>
              <p><strong className="etiqueta-detalles-imagen">Usuario que registró:</strong> <span className="valor-detalles-imagen">{capitalizeFirstLetter(image.user)}</span></p>
              <p><strong className="etiqueta-detalles-imagen">Fecha registro:</strong> <span className="valor-detalles-imagen">{new Date(image.dia_registro).toLocaleDateString()}</span></p>
              <p><strong className="etiqueta-detalles-imagen">Coordenadas:</strong> <span className="valor-detalles-imagen">Lat: {image.coordenadas.lat}, Lng: {image.coordenadas.lng}</span></p>
              <p><strong className="etiqueta-detalles-imagen">Tipo(s) detectado(s):</strong> <span className="valor-detalles-imagen">{image.tipo.map((t) => capitalizeFirstLetter(t)).join(', ')}</span></p>
              <p><strong className="etiqueta-detalles-imagen">Estado:</strong> <span className="valor-detalles-imagen">{getEstadoReparacion(image.estado)}</span></p>
              <p><strong className="etiqueta-detalles-imagen">Observaciones:</strong> <span className="valor-detalles-imagen">{image.observaciones}</span></p>
              <p><strong className="etiqueta-detalles-imagen">Última modificación:</strong> <span className="valor-detalles-imagen">{new Date(image.last_update).toLocaleDateString()}</span></p>
              <Button className="boton-modal" onClick={handleGoToMap}>Ir a Mapa</Button>
              <Button className="boton-modal" onClick={onHide}>Cerrar</Button>
            </div>
          </div>
        ) : (
          <p>Cargando datos...</p>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ModalGaleria;
