import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { DatosHistoricos, IrregularidadesPorTipo } from '../../app/DatosHistoricos';
import '../styles/ChartViewBar.css'; // Importa el archivo CSS

ChartJS.register(
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

interface ChartViewBarProps {
  data: DatosHistoricos[];
}

// Procesa los datos para el gráfico de barras
const processBarData = (data: DatosHistoricos[]) => {
  const tipos = ['hoyo', 'grieta', 'cocodrilo', 'hoyo con agua', 'longitudinal', 'transversal', 'lomo de toro'];

  const tipoData = tipos.map(tipo =>
    data.reduce((sum, { irregularidadesPorTipo }) => sum + irregularidadesPorTipo[tipo as keyof typeof irregularidadesPorTipo], 0)
  );

  return {
    labels: tipos,
    datasets: [
      {
        label: 'Irregularidades',
        data: tipoData,
        backgroundColor: tipos.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.4)`),
        borderColor: tipos.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`),
        borderWidth: 1,
      },
    ],
  };
};

const ChartViewBar: React.FC<ChartViewBarProps> = ({ data }) => {
  const barData = processBarData(data);

  return (
    <div className="modal-chart-container">
      <h3>Cantidad de Irregularidades por tipo</h3>
      <div className="modal-chart">
        <Bar data={barData} />
      </div>
    </div>
  );
};

export default ChartViewBar;
