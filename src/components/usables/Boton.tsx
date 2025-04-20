import React from 'react';

interface BotonProps {
  type: "button" | "submit" | "reset";
  className: string;
  children: React.ReactNode;
}

const Boton: React.FC<BotonProps> = ({ type, className, children }) => {
  return (
    <button type={type} className={className}>
      {children}
    </button>
  );
};

export default Boton;