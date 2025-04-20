import React, { useState, useEffect } from 'react';
import { UserList } from '../components/usables/pruebaUserList';
import { useNavigate, useParams } from 'react-router-dom';
import useAPIAuth from '../hooks/useAPIAuth';
import useAPIServer from '../hooks/useAPIServer';
import '../components/styles/EditUser.css';

interface User {
  username: string;
  email: string;
  nombre: string;
  apellido: string;
  password: string;
  tipo: number;
}

const EditUser: React.FC = () => {
  const { username } = useParams();
  const navigate = useNavigate()

  // API
  const apiAuth = useAPIAuth();
  const apiClient = apiAuth.apiAuthClient;
  const apiServer = useAPIServer(apiClient);
  // FIN API

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (username) {
          const data = await apiServer.getUserByUsername(username);
          setSelectedUser(data);
        }
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    console.log('Usuario seleccionado:', selectedUser);
  }, [selectedUser]);

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    console.log(`Cambiando "${e.target.name}" a "${e.target.value}"`);
    if (selectedUser) {
      setSelectedUser({
        ...selectedUser,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSaveChanges = async () => {
    const confirmation = window.confirm(`¿Estás seguro de actualizar al usuario ${selectedUser?.username}?`);
    if (!confirmation) {
      console.log('Operación cancelada');
      return;
    }

    try {
      if (selectedUser) {
        console.log('Haciendo consulta a "/api/user/edit" con datos:', selectedUser);
        const status = await apiServer.editUser(selectedUser);
        console.log('Estado de la respuesta:', status);

        if (status === 200) {
          alert('Usuario actualizado correctamente');
          navigate('/admin');
        } else {
          console.error('Error al actualizar usuario');
        }
      }
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
    }
  };

  return (
    <div className="edituser-root">
      <div className="edituser-container">
        <form className="edituser-form">
        <h2 className="edituser-title">Editar Usuario</h2>
          <div>
            <label className="edituser-label">Nombre de Usuario</label>
            <input
              type="text"
              name="username"
              className="edituser-input"
              value={selectedUser?.username || ''}
              onChange={handleUserChange}
              disabled
            />
          </div>
          <div>
            <label className="edituser-label">Nombre</label>
            <input
              type="text"
              name="nombre"
              className="edituser-input"
              value={selectedUser?.nombre || ''}
              onChange={handleUserChange}
              required
            />
          </div>
          <div>
            <label className="edituser-label">Apellido</label>
            <input
              type="text"
              name="apellido"
              className="edituser-input"
              value={selectedUser?.apellido || ''}
              onChange={handleUserChange}
              required
            />
          </div>
          <div>
            <label className="edituser-label">Email</label>
            <input
              type="email"
              name="email"
              className="edituser-input"
              value={selectedUser?.email || ''}
              onChange={handleUserChange}
              required
            />
          </div>
          <div>
            <label className="edituser-label">Contraseña</label>
            <input
              type="password"
              name="password"
              className="edituser-input"
              value={selectedUser?.password || ''}
              onChange={handleUserChange}
              required
            />
          </div>
          <div>
            <label className="edituser-label">Tipo de Usuario</label>
            <select
              name="tipo"
              className="edituser-input"
              value={selectedUser?.tipo || 0}
              onChange={handleUserChange}
              required
            >
              <option value={0}>Funcionario</option>
              <option value={1}>Analista</option>
              <option value={2}>Administrador</option>
            </select>
          </div>

          <button type="button" className="edituser-button" onClick={handleSaveChanges}>Guardar cambios</button>

          <button type="button" className="edituser-button" onClick={() => navigate('/admin')}>Cancelar</button>

        </form>
      </div>
    </div>
  );
};

export default EditUser;
