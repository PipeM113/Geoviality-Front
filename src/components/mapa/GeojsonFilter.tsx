import React, { useEffect } from 'react';
import feather from 'feather-icons'; // Importamos Feather Icons para iconos

// Definimos las propiedades que este componente recibirá
interface GeojsonCollection {
  name: string;
  geojsonData: GeoJSON.FeatureCollection; // Datos GeoJSON de la colección
}

interface GeojsonFilterProps {
  geojsonCollections: GeojsonCollection[];  // Las colecciones GeoJSON a mostrar
  selectedCollections: string[];  // Las colecciones seleccionadas (basado en el nombre)
  isAllSelected: boolean;  // Si todas las colecciones están seleccionadas
  onFilterChange: (name: string) => void;  // Función que se ejecuta al cambiar un filtro
  onShowAll: () => void;  // Función para seleccionar todas las colecciones
}

// Componente de filtro que acepta las propiedades definidas arriba
const GeojsonFilter: React.FC<GeojsonFilterProps> = ({ geojsonCollections, selectedCollections, isAllSelected, onFilterChange, onShowAll }) => {

  // Este efecto asegura que los íconos de Feather se actualicen cuando el componente se renderiza
  useEffect(() => {
    feather.replace();
  }, []);

  // Retornamos el componente visual de filtros
  return (
    <ul className="filter-nav" >
      <li className="filter-nav__item">
        <a
          className={`filter-nav__link ${isAllSelected ? 'filter-nav__link--active' : ''}`}
          onClick={onShowAll}  // Llama a la función para seleccionar todas las colecciones
          role="button"
          tabIndex={0}
        >
          All
        </a>
      </li>

      {/* Mapeamos cada colección GeoJSON para mostrarla como un filtro */}
      {geojsonCollections.map(collection => (
        <li className="filter-nav__item" key={collection.name}>
          <a
            className={`filter-nav__link ${selectedCollections.includes(collection.name) ? 'filter-nav__link--active' : ''}`}
            onClick={() => onFilterChange(collection.name)}  // Llama a la función cuando se selecciona o deselecciona una colección
            role="button"
            tabIndex={0}
          >
            {collection.name}  {/* Nombre de la colección que se muestra */}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default GeojsonFilter;

