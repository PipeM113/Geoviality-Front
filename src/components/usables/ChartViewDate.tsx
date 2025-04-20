import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { DatosHistoricos, IrregularidadesPorTipo } from '../../app/DatosHistoricos';
import '../styles/ChartViewDate.css'; // Importa el archivo CSS

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

interface ChartViewDateProps {
  data: DatosHistoricos[];
}

// Función para obtener el número del mes a partir del nombre del mes
const getMonthNumber = (monthName: string): number => {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return months.indexOf(monthName) + 1;
};

// Procesa los datos para el gráfico de líneas
const processLineData = (data: DatosHistoricos[]) => {
  // Ordenar los datos por año y mes
  const sortedData = data.sort((a, b) => {
    if (a.anio === b.anio) {
      return getMonthNumber(a.mes) - getMonthNumber(b.mes);
    }
    return a.anio - b.anio;
  });

  const labels = sortedData.map(d => `${d.mes} ${d.anio}`);
  const irregularidadesTotales = sortedData.map(d => d.irregularidadesTotales);

  return {
    labels,
    datasets: [
      {
        label: 'Irregularidades Totales',
        data: irregularidadesTotales,
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };
};

const ChartViewDate: React.FC<ChartViewDateProps> = ({ data }) => {
  const lineData = processLineData(data);

  return (
    <div className="modal-chart-container">
      <h3>Irregularidades Totales por Mes</h3>
      <div className="modal-chart">
        <Line data={lineData} />
      </div>
    </div>
  );
};

export default ChartViewDate;
