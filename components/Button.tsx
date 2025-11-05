import React, { ElementType } from 'react';

// FIX: Updated type definitions to a more robust pattern for polymorphic components
// to resolve JSX element type errors with the 'as' prop.
type ButtonOwnProps = {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
};

type PolymorphicComponentProps<
  E extends ElementType,
  P = {}
> = React.PropsWithChildren<P & { as?: E }> &
  Omit<React.ComponentPropsWithoutRef<E>, keyof (P & { as?: E })>;


const defaultElement = 'button';

type ButtonProps<E extends ElementType = typeof defaultElement> = PolymorphicComponentProps<
  E,
  ButtonOwnProps
>;

const Button = <E extends ElementType = typeof defaultElement>({
  variant = 'default',
  size = 'default',
  as,
  className,
  ...props
}: ButtonProps<E>) => {
  const Component = as || defaultElement;

  const baseClasses = "inline-flex items-center justify-center font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60 backdrop-blur-xl border shadow-lg";

  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 border-primary",
    destructive: "bg-system-red/30 text-system-red hover:bg-system-red/40 border-white/30",
    outline: "border-black/15 bg-transparent hover:bg-black/5 text-foreground",
    secondary: "bg-black/10 text-foreground hover:bg-black/20 border-white/20",
    ghost: "border-transparent hover:bg-black/10 text-foreground",
    link: "text-system-blue underline-offset-4 hover:underline border-transparent shadow-none backdrop-blur-none",
  };

  const sizeClasses = {
    default: "h-11 px-6 rounded-full text-base",
    sm: "h-9 px-4 rounded-full text-sm",
    lg: "h-12 px-8 rounded-full text-lg",
    icon: "h-11 w-11 rounded-full",
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className || ''}`;

  return <Component className={combinedClasses} {...props} />;
};

export default Button;