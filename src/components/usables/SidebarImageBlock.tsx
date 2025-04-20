import React from 'react';
import { SelectedPoint } from '../../hooks/mapa/useGeoJSON';

interface SidebarImageBlockProps {
  imageUri: string;
  openModal: () => void;
}

const SidebarImageBlock: React.FC<SidebarImageBlockProps> = ({ imageUri, openModal }) => {
  return (
    <div className="sidebar-image-block">
      <p><strong>Imagen Referencial</strong></p>
      <br />
      {imageUri ? (
        <>
          <img
            src={imageUri}
            alt="Imagen del punto"
            onClick={openModal}
            className="clickable-image"
          />
        </>
      ) : (
        <p>No disponible</p>
      )}
    </div>
  );
};

export default SidebarImageBlock;
