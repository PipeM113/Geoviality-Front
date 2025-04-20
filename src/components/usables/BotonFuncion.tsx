import React from 'react';
import '../styles/SignUp.css'; //! Deberia haber un CSS para los botones en general

interface BotonProps {
  textoBoton: string;
  funcionEjecutar: () => void;
  style?: React.CSSProperties;
  textStyle?: React.CSSProperties;
  disabled?: boolean;
}

export default function BotonFuncion(props: BotonProps) {
  const combinedStyle = props.disabled
    ? { ...props.style, ...disabledStyle }
    : props.style;

  return (
    //? signup-button es un nombre de clase que deberia ser cambiado a algo mas generico
    <button
      type="button"
      className="signup-button"
      onClick={props.funcionEjecutar}
      style={combinedStyle}
      disabled={props.disabled}
    >
      <span style={props.textStyle}>{props.textoBoton}</span>
    </button>
  );
}

const disabledStyle: React.CSSProperties = {
  backgroundColor: 'grey',
  color: 'white'
};
