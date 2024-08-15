import React, { ButtonHTMLAttributes, ReactNode } from 'react'
import { Spinner } from '@chakra-ui/react'


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean; // Optional loading state
  children: ReactNode; // Content of the button

}

// Button component definition
const Button: React.FC<ButtonProps> = ({ children, loading, ...props }) => {
  return (
    <button {...props} disabled={loading}>
      {loading ? <Spinner /> : children}
    </button>
  );
};
export default Button