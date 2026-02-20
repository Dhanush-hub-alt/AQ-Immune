// Checkbox Component
import React, { InputHTMLAttributes } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  error,
  helperText,
  className,
  ...props
}) => {
  return (
    <div>
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          className={`w-4 h-4 rounded border-gray-300 text-sky-500 bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-sky-500 cursor-pointer transition-all duration-200 ${error ? 'border-red-500' : ''} ${className || ''}`}
          {...props}
        />
        {label && (
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Checkbox;
