
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = ({ className, type, value, onChange, ...props }) => {
  const baseClasses = "flex h-11 w-full rounded-lg border border-white/30 bg-white/40 backdrop-blur-xl px-4 py-2 text-base shadow-inner transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";
  const combinedClasses = `${baseClasses} ${className || ''}`;

  return <input type={type} className={combinedClasses} value={value} onChange={onChange} {...props} />;
};

export default Input;
