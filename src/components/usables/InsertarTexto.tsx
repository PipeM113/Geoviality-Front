import React from 'react';

interface InsertarTextoProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const InsertarTexto: React.FC<InsertarTextoProps> = ({ id, value, onChange, placeholder }) => {
  return (
    <div className="form-group">
      <input
        type="text"
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
      />
    </div>
  );
};

export default InsertarTexto;