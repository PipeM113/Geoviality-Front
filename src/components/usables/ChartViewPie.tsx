import React, { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { DatosHistoricos } from '../../app/DatosHistoricos'; // Ajusta la ruta según sea necesario
import '../styles/ChartViewPie.css'; // Importa el archivo CSS

ChartJS.register(
  ArcElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface ChartViewPieProps {
  data: DatosHistoricos[];
}

// Procesa los datos para el gráfico de pastel
const processPieData = (data: DatosHistoricos[], selectedTypes: string[]) => {
  let totalReparadas = 0;
  let totalIrregularidades  = 0;

  data.forEach(({ irregularidadesTotales, irregularidadesReparadas }) => {
    // Sumar todas las irregularidades reparadas
    totalReparadas += irregularidadesReparadas;

    // Sumar el total de irregularidades
    totalIrregularidades += irregularidadesTotales;
  });

  return {
    labels: ['Reparadas', 'No Reparadas'],
    datasets: [
      {
        data: [totalReparadas, totalIrregularidades],
        backgroundColor: ['rgba(75, 192, 192, 0.4)', 'rgba(255, 99, 132, 0.4)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
   };
  };

const ChartViewPie: React.FC<ChartViewPieProps> = ({ data }) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['hoyo', 'grieta', 'cocodrilo', 'hoyo con agua', 'longitudinal', 'transversal', 'lomo de toro']);

  const handleTypeChange = (type: string) => {
    setSelectedTypes((prevSelectedTypes) =>
      prevSelectedTypes.includes(type)
        ? prevSelectedTypes.filter((t) => t !== type)
        : [...prevSelectedTypes, type]
    );
  };

  const pieData = processPieData(data, selectedTypes);

  return (
    <div className="modal-chart-container">
      <h3>% Irregularidades reparadas</h3>
      <div className="modal-chart">
        <Pie data={pieData} />
      </div>
    </div>
  );
};

export default ChartViewPie;
