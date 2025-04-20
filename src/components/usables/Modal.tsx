import React from 'react';

interface ModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  imageUrl: string;
}

const Modal: React.FC<ModalProps> = ({ isModalOpen, closeModal, imageUrl }) => {
  if (!isModalOpen) return null;

  return (
    <div className="modal" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="modal-close" onClick={closeModal}>&times;</span>
        <img src={imageUrl} alt="Imagen ampliada" className="modal-image" />
      </div>
    </div>
  );
};

export default Modal;
