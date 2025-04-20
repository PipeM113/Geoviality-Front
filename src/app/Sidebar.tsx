import React from 'react';
import '../components/styles/Sidebar.css';
import SidebarCard from '../components/usables/SidebarCard';
import SidebarImageCarrusel from '../components/usables/SidebarImageCarrusel';
import { SelectedPoint } from '../hooks/mapa/useGeoJSON';

interface SidebarProps {
  selectedPoint: SelectedPoint | null;
  isVisible: boolean;
  vereda?: boolean;
  onClose: () => void;
  openModal: (imageUri: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedPoint, isVisible, onClose, openModal, vereda = false }) => {
  return (
    <div className={`sidebar ${isVisible ? 'sidebar-visible' : ''}`}>
      {selectedPoint ? (
        <>
          <SidebarCard selectedPoint={selectedPoint} onClose={onClose} vereda={vereda} />
          <SidebarImageCarrusel urisArray={selectedPoint.imageIDArray || []} openModal={openModal} />
        </>
      ) : (
        <p>No se seleccionó ningún punto.</p>
      )}
    </div>
  );
};

export default Sidebar;
