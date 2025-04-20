import React from 'react';
import '../styles/ModalImagenMapa.css';

interface ModalImagenMapaProps {
  isModalOpen: boolean;
  closeModal: () => void;
  imageUrl: string; // Asegúrate de que el tipo sea string
}

const ModalImagenMapa: React.FC<ModalImagenMapaProps> = ({ isModalOpen, closeModal, imageUrl }) => {
  if (!isModalOpen) return null;

  return (
    <div className="modal-imagen-mapa-overlay" onClick={closeModal}>
      <div className="modal-imagen-mapa-content" onClick={(e) => e.stopPropagation()}>
        <img src={imageUrl} alt="Imagen en grande" className="modal-imagen-mapa-image" />
        <button className="modal-imagen-mapa-close" onClick={closeModal}>
          ×
        </button>
      </div>
    </div>
  );
};

export default ModalImagenMapa;
