import React from 'react';
import '../styles/Admin.css';

interface FormaUsuarioProps {
  newUser: { username: string; email: string; nombre: string, apellido: string, password: string, tipo: number };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onAddUser: () => void;
}

const FormaUsuario: React.FC<FormaUsuarioProps> = ({ newUser, onInputChange, onAddUser }) => {
  return (
    <div className="admin-form">

      <input
        type="text"
        name="username"
        placeholder="Nombre de Usuario"
        value={newUser.username}
        onChange={onInputChange}
      />

      <input
        type="text"
        name="nombre"
        placeholder="Nombre"
        value={newUser.nombre}
        onChange={onInputChange}
      />

      <input
        type="text"
        name="apellido"
        placeholder="Apellido"
        value={newUser.apellido}
        onChange={onInputChange}
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={newUser.email}
        onChange={onInputChange}
      />

      <input
        type="password"
        name="password"
        placeholder="Contraseña"
        value={newUser.password}
        onChange={onInputChange}
      />

      <select
        name="tipo"
        value={newUser.tipo}
        onChange={onInputChange}
        required
      >
        <option value={0}>Funcionario</option>
        <option value={1}>Analista</option>
        <option value={2}>Administrador</option>
      </select>

      <button onClick={onAddUser}>Agregar</button>
    </div>
  );
};

export default FormaUsuario;
