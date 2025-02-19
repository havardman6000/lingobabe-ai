import { JSX } from "react";

interface KeyboardOnlyProps {
    children: React.ReactNode;
    as?: keyof JSX.IntrinsicElements;
    className?: string;
  }
  
  export function KeyboardOnly({
    children,
    as: Component = 'div',
    className = '',
  }: KeyboardOnlyProps) {
    return (
      <Component
        className={`invisible focus-within:visible ${className}`}
        style={{ 
          outline: 'none',
        }}
      >
        {children}
      </Component>
    );
  }