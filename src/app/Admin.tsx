// src/app/Admin.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../components/styles/Admin.css';
import FormaUsuario from '../components/usables/FormaUsuario';
import TablaUsuarios from '../components/usables/TablaUsuarios';
import useAPIServer from '../hooks/useAPIServer';
import useAPIAuth from '../hooks/useAPIAuth';
import '../components/styles/Admin.css';
import { Button } from 'react-bootstrap';

const logo = require('../imgs/logo_full_color_fondo_blanco.png');

//newUser: { username: string; email: string; name: string, secondName: string, password: string };
interface User {
  username: string;
  email: string;
  nombre: string;
  apellido: string;
  password: string;
  tipo: number;
}

const Admin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<User>({ username: '', email: '', nombre: '', apellido: '', password: '', tipo: 0 });
  const history = useNavigate();

  // API
  const apiAuth = useAPIAuth();
  const apiClient = apiAuth.apiAuthClient;
  const apiServer = useAPIServer(apiClient);
  // FIN API

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiServer.getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    console.log("Usuario nuevo:", newUser);
  }, [newUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleAddUser = async () => {
    const confirmation = window.confirm(`¿Estás seguro de agregar al usuario ${newUser.username}? con el permiso ${newUser.tipo}`);
    if (!confirmation) {
      console.log('Operación cancelada');
      return;
    }

    console.log('Haciendo consulta a "/api/user/create" con datos:', newUser, 'con permiso', newUser.tipo);
    try {
      const status = await apiServer.createNewUser(newUser);
      console.log('Estado de la respuesta:', status);
      if (status === 201) {
        alert(`Usuario ${newUser.username} creado correctamente`);
        setUsers([...users, newUser]);
      }
    } catch (error) {
      console.error('Error al crear usuario:', error);
      alert(`Error al crear usuario ${newUser.username}. ${error}`);
    }
  };

  const handleDeleteUser = async (username: string) => {
    const confirmation = window.confirm(`¿Estás seguro de eliminar al usuario ${username}?`);
    if (!confirmation) {
      console.log("Operación cancelada");
      return;
    }

    try {
      console.log(`Haciendo consulta a "/api/user/delete/${username}"`);
      const status = await apiServer.deleteUser(username);
      console.log('Estado de la respuesta:', status);
      if (status === 200) {
        alert(`Usuario ${username} eliminado correctamente`);
        setUsers(users.filter(user => user.username !== username));
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      alert(`Error al eliminar usuario ${username}. ${error}`);
    }
  };

  const handleEditUser = (username: string) => {
    // Redirigir a la página de edición del usuario
    history(`/admin/${username}`);
  };

  return (
    <div className="admin-root">
      <div className="admin-container">
        <Button onClick={() => history('/')} className="admin-back-button">Regresar</Button>
        <img src={logo} alt="Logotipo" className="admin-logo" />
        <h1 className="admin-header">Administrador de Usuarios</h1>

        <FormaUsuario newUser={newUser} onInputChange={handleInputChange} onAddUser={handleAddUser} />

        <TablaUsuarios
        users={users}
        onDeleteUser={handleDeleteUser}
        onEditUser={handleEditUser} />

      </div>
    </div>
  );
};

export default Admin;
