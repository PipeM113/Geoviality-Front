import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import { useNavbarAnimation } from '../../hooks/NavBarAnimation';
import { Button } from 'react-bootstrap';
import useAPIAuth from '../../hooks/useAPIAuth';

interface NavbarProps {
  noSelector?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ noSelector = false }) => {
  const logo = require('../../imgs/logo_texto_color_blanco.png');
  const { pathname } = window.location;
  const [userUsername, setUserUsername] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useNavbarAnimation();
  const apiAuth = useAPIAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const data = localStorage.getItem('username');
      if (data) {
        setUserUsername(data);
      }

      const userData = await apiAuth.getUserData();

      if (userData.tipo === 2) {
        setIsAdmin(true);
      }
    };

    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


  const handleLogout = async () => {
    const confirmLogout = window.confirm('¿Estás seguro que deseas cerrar sesión?');
    if (confirmLogout) {
      await apiAuth.cerrarSesionAsync();
      navigate('/login');
    }
  }

  return (
    <nav className="navbar navbar-expand-custom navbar-mainbg p-0">
      <Link className="navbar-brand navbar-logo" to="/">
        <img src={logo} alt="Logo" className="navbar-logo-img" />
      </Link>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav ml-auto">
          {!noSelector && <div className="hori-selector"><div className="left"></div><div className="right"></div></div>}
          <li className={`nav-item ${pathname === '/' ? 'active' : ''}`}>
            <Link className="nav-link" to="/">
              <i className="fas fa-tachometer-alt"></i>Mapa
            </Link>
          </li>
          <li className={`nav-item ${pathname === '/peatonal' ? 'active' : ''}`}>
            <Link className="nav-link" to="/peatonal">
              <i className="fa-solid fa-person"></i>Peatonal
            </Link>
          </li>
          <li className={`nav-item ${pathname === '/historicos' ? 'active' : ''}`}>
            <Link className="nav-link" to="/historicos">
              <i className="far fa-copy"></i>Registros
            </Link>
          </li>
          {isAdmin && (
            <li className={`nav-item ${pathname === '/admin' ? 'active' : ''}`}>
              <Link className="nav-link" to="/admin">
                <i className="fas fa-user-cog"></i>Admin
              </Link>
            </li>
          )}
        </ul>
        <Button onClick={handleLogout} style={{backgroundColor: "red", marginLeft: 30, marginRight: 15, zIndex: 2}}>
          <i className="fas fa-sign-out-alt"></i>Cerrar Sesion
        </Button>
        <p style={{color: "white", marginRight: 15, marginBottom: 0, display: 'flex', alignItems: 'center'}}>
          <i className="fas fa-user"></i>{userUsername}
        </p>
      </div>
    </nav>
  );
};

export default Navbar;
