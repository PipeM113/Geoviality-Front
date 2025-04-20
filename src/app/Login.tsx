import React, { useState } from 'react';
import '../components/styles/SignUp.css'; //reutilicé el css de SignUp
import InsertarTexto from '../components/usables/InsertarTexto';
import PasswordInput from '../components/usables/PasswordInput';
import BotonFuncion from '../components/usables/BotonFuncion';
import useAPIAuth from '../hooks/useAPIAuth';

import { useNavigate } from "react-router-dom";


const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const apiAuth = useAPIAuth(false)
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!username || !password) {
      alert('Por favor, complete todos los campos');
      return;
    }

    console.log('Nombre de usuario:', username);
    console.log('Contraseña:', password);

    setLoading(true);
    setMessage('');

    const loggedIn = await apiAuth.iniciarSesionAsync(username, password);

    if (loggedIn) {
      console.log('Usuario autenticado');
      navigate('/');
      setLoading(false);
    } else {
      console.log('Error al autenticar usuario');
      setMessage('Usuario o contraseña incorrectos');
      setLoading(false);
    }
  };

  const renderLoginButton = () => {
    if (loading) {
      return <BotonFuncion textoBoton='Iniciar Sesión' funcionEjecutar={handleSubmit} disabled/>
    }
    return <BotonFuncion textoBoton='Iniciar Sesión' funcionEjecutar={handleSubmit}/>
  }

  const renderMessage = () => {
    if (message) {
      return <p>{message}</p>
    }
  }

  const logo = require('../imgs/logo_full_color_fondo_blanco.png');

  return (
    <div className="signup-container">
    <form onSubmit={handleSubmit} className="signup-form">
      <img src={logo} alt="Logotipo" className="signup-logo" />
      <h2>Iniciar Sesión</h2>

      <InsertarTexto
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Usuario"
      />

      <PasswordInput
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
        />

      {renderLoginButton()}

      {renderMessage()}

    </form>
  </div>
  );
};

export default Login;
