import React from 'react';
import { SelectedPoint } from '../../hooks/mapa/useGeoJSON';
import { Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import useFecha from '../../hooks/utilidades/useFecha';

interface SidebarCardProps {
  selectedPoint: SelectedPoint;
  vereda?: boolean;
  onClose: () => void;
}

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const capitalizeEachType = (types: string[]) => {
  return types.map(type => capitalizeFirstLetter(type)).join(', ');
};

const SidebarCard: React.FC<SidebarCardProps> = ({ selectedPoint, onClose, vereda = false }) => {
  const navigate = useNavigate();

  const fechas_hook = useFecha();

  return (
    <div className="sidebar-card">
      <button
        onClick={onClose}
        className="sidebar-close-button"
        aria-label="Cerrar sidebar"
      >
        Cerrar
      </button>
      {vereda ?
        <Button variant="primary" onClick={() => navigate(`/edit/sidewalk/${selectedPoint.id}`)}>Editar</Button>
      : <Button variant="primary" onClick={() => navigate(`/edit/${selectedPoint.id}`)}>Editar</Button>}

      <h3>{selectedPoint.nombreCalle || 'Sin calle.'}</h3>

      <div className="sidebar-info-group">
        <p><strong>Fecha Medición</strong> <br />{fechas_hook.convertir_date_a_string(selectedPoint.date)}</p>
        <p><strong>Estado</strong> <br />{selectedPoint.estado === 1 ? "Reparado" : "No Reparado"}</p>
        <p><strong>Tipo</strong> <br />{capitalizeEachType(selectedPoint.type)}</p>
        <p><strong>Autor</strong> <br />{selectedPoint.user}</p>
        <p><strong>Reparación</strong> <br />{selectedPoint.repair_at}</p>
        <p><strong>Observaciones</strong> <br />{selectedPoint.observaciones}</p>
        <p><strong>Última Actualización</strong> <br />{fechas_hook.convertir_date_a_string(selectedPoint.last_update)}</p>
      </div>
    </div>
  );
};

export default SidebarCard;
