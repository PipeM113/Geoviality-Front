import React from 'react';
import { useTable, useSortBy, Column } from 'react-table';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/TablaHistoricos.css';

// Datos tabla
interface DatosHistoricos {
  fecha: string;
  ubicacion: string;
  descripcion: string;
  estado: string;
}

interface TablaHistoricosProps {
  data: DatosHistoricos[];
}

const TablaHistoricos: React.FC<TablaHistoricosProps> = ({ data }) => {
  const columns: Column<DatosHistoricos>[] = React.useMemo(
    () => [
      {
        Header: 'Fecha',
        accessor: 'fecha',
      },
      {
        Header: 'Ubicación',
        accessor: 'ubicacion',
      },
      {
        Header: 'Descripción',
        accessor: 'descripcion',
      },
      {
        Header: 'Estado',
        accessor: 'estado',
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    { columns, data },
    useSortBy
  );

  return (
    <Table striped bordered hover responsive {...getTableProps()} className="table">
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps((column as any).getSortByToggleProps())}>
                {column.render('Header')}
                <span>
                  {(column as any).isSorted
                    ? (column as any).isSortedDesc
                      ? ' 🔽'
                      : ' 🔼'
                    : ''}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => (
                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default TablaHistoricos;


