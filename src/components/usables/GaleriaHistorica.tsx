import React, { useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import '../styles/GaleriaHistorica.css';
import { ImagenGaleria } from '../../app/Galeria';
import ModalGaleria from './ModalGaleria';

interface GaleriaHistoricaProps {
  images: ImagenGaleria[];
}

const GaleriaHistorica: React.FC<GaleriaHistoricaProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState<ImagenGaleria | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = (image: ImagenGaleria) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
    setShowModal(false);
  };

  return (
    <div id="galeria-container">
      <Container fluid>
        <Row>
          {images.map((image) => (
            <Col key={image.id} xs={12} sm={6} md={4} lg={3} xl={3} className="mb-4">
              <Card className="carta">
                <div className="container-imagen">
                  <Card.Img variant="top" src={image.uri} alt={`Image ${image.id}`} className="gallery-image" />
                </div>
                <Card.Body>
                  <div className="description-container">
                    <p className="image-description">
                      <span className="nombre-atributo">ID:</span> <span className="valor-atributo">{image.id}</span>
                    </p>
                    <p className="image-description">
                      <span className="nombre-atributo">Tipo:</span>
                      <span className="valor-atributo">
                        {image.tipo.map((t) => ' ' + t.charAt(0).toUpperCase() + t.slice(1)).join(', ')}
                      </span>
                    </p>
                    <p className="image-description">
                      <span className="nombre-atributo">Fecha registro:</span> <span className="valor-atributo">{new Date(image.dia_registro).toLocaleDateString()}</span>
                    </p>
                    <p className="image-description">
                      <span className="nombre-atributo">Ultima modificacion:</span> <span className="valor-atributo">{new Date(image.last_update).toLocaleDateString()}</span>
                    </p>
                    <div className="text-center">
                      <Button className="botones-galeria" onClick={() => handleShowModal(image)}>Detalles</Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <ModalGaleria
        show={showModal}
        onHide={handleCloseModal}
        image={selectedImage}
      />
    </div>
  );
};

export default GaleriaHistorica;
