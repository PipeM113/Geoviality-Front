
// App.tsx

import React from 'react';
import Mapa from './MapComponent'; // Ajusta la ruta según donde guardes el componente
import Navbar from '../components/usables/navbar';
import MapComponentAuto from './MapComponentAuto';
import { Button } from 'react-bootstrap';
import MapVisualizer from './MapVisualizer'; // Asegúrate de ajustar la ruta según corresponda
import '../components/styles/App.css';
const App: React.FC = () => {

  const [modoMapa, setModoMapa] = React.useState<number>(0);

  const renderMapa = () => {
    if (modoMapa === 0) {
      return <Mapa />;
    } else if (modoMapa === 1) {
      return <MapComponentAuto />;
    } else if (modoMapa === 2) {
      return <MapVisualizer />
    }
  }

  const renderBotonesCambioModo = () => {
    return (
      <div
        style={{
          position: "absolute",
          left: 0,
          top: "45%",
          zIndex: 10,
          width: "500px",
        }}
      >
      <ul className="mapMode-nav">
        <li className="mapMode-nav__item">
          <a
            className={`mapMode-nav__link ${modoMapa === 0 ? 'mapMode-nav__link--active' : ''}`}
            onClick={() => setModoMapa(0)}
          >
            Mapa
          </a>
        </li>
        <li className="mapMode-nav__item">
          <a
            className={`mapMode-nav__link ${modoMapa === 1 ? 'mapMode-nav__link--active' : ''}`}
            onClick={() => setModoMapa(1)}
          >
            Mapa Auto
          </a>
        </li>
        <li className="mapMode-nav__item">
          <a
            className={`mapMode-nav__link ${modoMapa === 2 ? 'mapMode-nav__link--active' : ''}`}
            onClick={() => setModoMapa(2)}
          >
            Calles
          </a>
        </li>
      </ul>
      </div>
    );
  };

  return (
    <div style={{flex:1, display: 'flex', flexDirection: 'column', height: "100vh"}}>
      <Navbar />
      {renderMapa()}
      {renderBotonesCambioModo()}
    </div>
  );
};

export default App;

/*
import React from 'react';
import MapPeatonal from './MapPeatonal';

const App: React.FC = () => {
  return (
     <div>
       <MapPeatonal />
     </div>
   );
 };

 export default App;
*/


/*Para probar el Login y el SignUp hay q reemplazar todo el codigo
por lo siguiente:

import React from 'react';
import '../components/styles/App.css';
import SignUp from './SignUp';
import Login from './Login';

const App: React.FC = () => {
  return (
    <div className="App">
    <SignUp />
    </div>
  );
};

export default App;

*/





