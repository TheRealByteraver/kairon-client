import React, { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, ...restProps }) => {
  return (
    <button className="h-12 py-2 px-12 rounded-lg bg-green-600 text-white capitalize" {...restProps}>
      {children}
    </button>
  );
}

export default Button;