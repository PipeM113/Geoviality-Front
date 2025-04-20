import React, { useState } from 'react';
import '../styles/SignUp.css';

interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ id, value, onChange, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="form-group" style={{ position: 'relative' }}>
      <input
        id={id}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="form-control"
        required
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          height: '100%',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0 10px'
        }}
      >
        <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
      </button>
    </div>
  );
};

export default PasswordInput;