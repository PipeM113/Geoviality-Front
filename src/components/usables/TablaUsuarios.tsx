import React from 'react';
import FilaTablaUsuarios from './FilaTablaUsuarios';
import {UserList} from './pruebaUserList';

interface User {
  username: string;
  email: string;
  nombre: string;
  apellido: string;
  password: string;
  tipo: number;
}

interface FilaTablaUsuariosProps {
  users: User[];
  onDeleteUser: (username: string) => void;
  onEditUser: (username: string) => void;
}

//Importé UserList de pruebaUserList.tsx para usarla en mas sitios
/*const UserList = [
    { username: 'user1', name: 'Nombre 1',secondName: 'Apellido 1' , email: 'email@email.cl'
    },
    { username: 'user2', name: 'Nombre 2',secondName: 'Apellido 2' , email: 'email2@email.cl'
    },
    { username: 'user3', name: 'Nombre 3',secondName: 'Apellido 3' , email: 'email3@email.cl'
    },
    { username: 'user4', name: 'Nombre 4',secondName: 'Apellido 4' , email: 'email4@email.cl'
    },
  ]
*/


  //Cambiar UserList por lo que entregue la API
const TablaUsuarios: React.FC<FilaTablaUsuariosProps> = ({ users, onDeleteUser, onEditUser }) => {
  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Nombre de Usuario</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Email</th>
          <th>Permisos</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody>

        {users.map(users => (
          <FilaTablaUsuarios key={users.username} user={users}
          onDeleteUser={onDeleteUser} onEditUser={onEditUser} />
        ))}
      </tbody>
    </table>
  );
};

export default TablaUsuarios;
