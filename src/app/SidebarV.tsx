import React, { useEffect, useState } from 'react';
import useAPIServer from '../hooks/useAPIServer';
import useAPIAuth from '../hooks/useAPIAuth';

interface SidebarVProps {
  streetName: string | null;
  properties: { [key: string]: any } | null;
  images: string[]; // Array de IDs de imágenes que viene desde StreetVisualizer
  isVisible: boolean;
  onClose: () => void;
}

interface ImageCarouselProps {
  images: string[]; // Array de URLs de imágenes
}

interface PropertyListProps {
  properties: { [key: string]: any };
  allowedKeys: string[]; // Claves permitidas que deseas mostrar
}

const PropertyList: React.FC<PropertyListProps> = ({ properties, allowedKeys }) => {
  const filteredProperties = Object.entries(properties).filter(([key]) =>
    allowedKeys.includes(key)
  );

  return (
    <ul className='sidebarV-content'>
      {filteredProperties.length > 0 ? (
        filteredProperties.map(([key, value]) => (
          <li key={key}>
            <strong>{key}:</strong> {value}
          </li>
        ))
      ) : (
        <p>No hay propiedades disponibles para mostrar.</p>
      )}
    </ul>
  );
};

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPreviousImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className='image-carousel'>
      <button className='carousel-button left' onClick={goToPreviousImage}>
        &#10094;
      </button>
      <img src={images[currentIndex]} alt={`Imagen ${currentIndex + 1}`} className='carousel-image' />
      <button className='carousel-button right' onClick={goToNextImage}>
        &#10095;
      </button>
    </div>
  );
};

const SidebarV: React.FC<SidebarVProps> = ({ streetName, properties, images, isVisible, onClose }) => {
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const apiAuth = useAPIAuth();
    const apiClient = apiAuth.apiAuthClient;
    const apiServer = useAPIServer(apiClient);

    const allowedKeys = ["@id", "name", "Hoyo", "Cocodrilo", "Longitudinal", "Transversal", "Lomo de toro"];

    useEffect(() => {
      const fetchImages = async () => {
        try {
          setImageUrls([]);
          if (images.length > 0) {
            for (const imageId of images) {
              const response = await apiServer.getImageById(imageId);
              if (!response) {
                throw new Error(`Error al obtener la imagen ${imageId}`);
              }
              setImageUrls((prevUrls) => [...prevUrls, response]);
            }
          }
        } catch (error) {
          console.error('Error al cargar las imágenes:', error);
        }
      };

      fetchImages();
    }, [images]);

    return (
      <div className={`sidebarV ${isVisible ? 'sidebarV-visible' : ''}`}>
        {/* Cambiamos el botón de cierre */}
        <button className="sidebar-close-button" onClick={onClose}>
          Cerrar
        </button>
        <h2>{streetName || 'Selecciona una calle'}</h2>
        {properties ? (
          <div className='sidebarV-card'>
            <PropertyList properties={properties} allowedKeys={allowedKeys} />
          </div>
        ) : (
          <p>No hay información disponible.</p>
        )}

        <div className='image-container'>
          <h3>Imágenes</h3>
          {imageUrls.length > 0 ? (
            <ImageCarousel images={imageUrls} />
          ) : (
            <p>Sin imagenes.</p>
          )}
        </div>
      </div>
    );
  };

export default SidebarV;












