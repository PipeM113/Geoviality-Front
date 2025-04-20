import React, { useState } from 'react';
import '../components/styles/SignUp.css';
import InsertarTexto from '../components/usables/InsertarTexto';
import Boton from '../components/usables/Boton';
import PasswordInput from '../components/usables/PasswordInput';

const SignUp: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log('Nombre de usuario:', username);
    console.log('Correo:', email);
    console.log('Contraseña:', password);
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2>Registrarse</h2>

        <InsertarTexto
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Usuario"
        />

        <InsertarTexto
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo"
        />

        <PasswordInput
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
        />

        <Boton type="submit" className="signup-button">
          Registrarse
        </Boton>
      </form>
    </div>
  );
};

export default SignUp;