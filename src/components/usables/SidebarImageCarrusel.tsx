import React, { useEffect, useState } from 'react';
import '../styles/SidebarV.css';
import useAPIAuth from '../../hooks/useAPIAuth';
import useAPIServer from '../../hooks/useAPIServer';

interface SidebarImageCarruselProps {
  urisArray: string[];
  openModal: (imageUri: string) => void; // Asegúrate de que el tipo sea string
}

const SidebarImageCarrusel: React.FC<SidebarImageCarruselProps> = ({ urisArray, openModal }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImageUri, setCurrentImageUri] = useState<string>(""); // Asegúrate de que el tipo sea string
  const [isLoading, setIsLoading] = useState(true);

  const apiAuth = useAPIAuth();
  const apiClient = apiAuth.apiAuthClient;
  const apiServer = useAPIServer(apiClient);

  useEffect(() => {
    (async () => {
      if (urisArray.length > 0) {
        setIsLoading(true);
        const response = await apiServer.getImageById(urisArray[currentImageIndex]);
        if (!response) {
          setCurrentImageUri("");
        }
        setCurrentImageUri(response);
        setIsLoading(false);
      }
    })();
  }, [currentImageIndex, urisArray]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [urisArray]);

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % urisArray.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + urisArray.length) % urisArray.length
    );
  };

  const renderImage = () => {
    if (isLoading) {
      return <p>Cargando...</p>;
    }
    if (currentImageUri) {
      return (
        <img
          className="carousel-image clickable-image"
          src={currentImageUri}
          alt="Carrusel"
          onClick={() => openModal(currentImageUri)}
        />
      );
    } else {
      return <p>No se pudo cargar imagen.</p>;
    }
  };

  return (
    <div className="image-carousel">
      <button className="carousel-button left" onClick={handlePrev}>
        ‹
      </button>

      {renderImage()}

      <button className="carousel-button right" onClick={handleNext}>
        ›
      </button>
    </div>
  );
};

export default SidebarImageCarrusel;
