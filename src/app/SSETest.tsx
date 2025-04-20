import React, { useEffect, useState } from 'react';

const SSETest: React.FC = () => {

  const [datos, setDatos] = useState()


  useEffect(() => {
    const direccion_api_eventos = "https://shark-quick-loon.ngrok-free.app/test/sse";
    const fuente_evento = new EventSource(direccion_api_eventos);

    fuente_evento.onmessage = (evento) => {
      console.log("Evento:", evento)
      console.log("Datos: ", evento.data);
      const json_data = JSON.parse(evento.data);

      console.log("Datos en JSON: ", json_data);
      setDatos(json_data);
    };

    fuente_evento.onerror = (error) => {
      console.error(`Error en la fuente de eventos:\n${error}`);
      fuente_evento.close();
    };

    return () => {
      fuente_evento.close();
    };
  }, []);

  return (
    <div>
      <p>{JSON.stringify(datos)}</p>
    </div>
  );
};

export default SSETest;
