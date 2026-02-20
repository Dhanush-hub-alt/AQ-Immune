import { jsx as _jsx } from "react/jsx-runtime";
export const Badge = ({ children, variant = 'primary', size = 'sm', className, style, }) => {
    const baseStyles = 'inline-flex items-center font-semibold rounded-full';
    const variantStyles = {
        primary: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200',
        success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    };
    const sizeStyles = {
        sm: 'px-2.5 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-1.5 text-base',
    };
    return (_jsx("span", { className: `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className || ''}`, style: style, children: children }));
};
export default Badge;
