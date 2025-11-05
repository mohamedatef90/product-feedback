import React from 'react';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  name: string;
  selectedValue: string | null;
  onChange: (value: string) => void;
  label?: string;
  description?: string;
  className?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ options, name, selectedValue, onChange, label, description, className }) => {
  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-foreground mb-1">{label}</label>}
      {description && <p className="text-muted-foreground text-sm mb-2">{description}</p>}
      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <label key={option.value} className="flex items-center space-x-2 cursor-pointer p-3 border rounded-md transition-colors has-[:checked]:bg-secondary has-[:checked]:border-gray-400 hover:border-gray-400/80">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={() => onChange(option.value)}
              className="h-4 w-4 text-primary focus:ring-primary border-muted-foreground"
            />
            <span className="text-sm font-medium text-foreground">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioGroup;