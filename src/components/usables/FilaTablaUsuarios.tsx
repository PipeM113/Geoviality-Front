import React from 'react';

interface User {
  username: string;
  email: string;
  nombre: string;
  apellido: string;
  password: string;
  tipo: number;
}

interface FilaTablaUsuariosProps {
  user: User;
  onDeleteUser: (username: string) => void;
  onEditUser: (username: string) => void;
}

const parseTipo = (tipo: number) => {

  // Normalizar el tipo de usuario
  tipo = parseInt(tipo.toString());

  switch (tipo) {
    case 0:
      return 'Funcionario';
    case 1:
      return 'Analista';
    case 2:
      return 'Administrador';
    default:
      return 'Desconocido';
  }
}

const FilaTablaUsuarios: React.FC<FilaTablaUsuariosProps> = ({ user, onDeleteUser, onEditUser }) => {
  return (
    <tr>
      <td>{user.username}</td>
      <td>{user.nombre}</td>
      <td>{user.apellido}</td>
      <td>{user.email}</td>
      <td>{parseTipo(user.tipo)}</td>
      <td>
        <button className='delete-button' onClick={() => onDeleteUser(user.username)}>Eliminar</button>
        <button className= 'edit-button' onClick={() => onEditUser(user.username)}>Editar</button>
      </td>
    </tr>
  );
};

export default FilaTablaUsuarios;
