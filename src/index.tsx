import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App'; // Asegúrate de que esta línea apunte al archivo correcto
import './components/styles/index.css'; // Si tienes un archivo de estilos
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './app/Login';
import SignUp from './app/SignUp';
import DatosHistoricos from './app/DatosHistoricos';
import ModificarDatos from './app/ModificarDatos';
import Admin from './app/Admin';
import EditUser from './app/EditUser';
import SSETest from './app/SSETest';
import Galeria from './app/Galeria';
import MapaPeatonal from './app/MapPeatonal';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/historicos" element={<DatosHistoricos />} />
        <Route path="/edit/:point_id" element={<ModificarDatos />} />
        <Route path="/edit/sidewalk/:point_id" element={<ModificarDatos vereda/>} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/:username" element={<EditUser />} />
        <Route path="/test" element={<SSETest />} />
        <Route path="/galeria/:anio/:mes" element={<Galeria />} />
        <Route path="/galeria/:anio" element={<Galeria />} />
        <Route path="/peatonal" element={<MapaPeatonal />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

