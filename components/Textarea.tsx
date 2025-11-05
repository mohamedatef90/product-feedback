import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea: React.FC<TextareaProps> = ({ className, ...props }) => {
  const baseClasses = "flex min-h-[120px] w-full rounded-lg border border-black/15 bg-black/5 backdrop-blur-sm px-4 py-3 text-base shadow-inner placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";
  const combinedClasses = `${baseClasses} ${className || ''}`;

  return <textarea className={combinedClasses} {...props} />;
};

export default Textarea;
