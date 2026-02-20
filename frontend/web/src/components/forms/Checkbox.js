import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const Checkbox = ({ label, error, helperText, className, ...props }) => {
    return (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("input", { type: "checkbox", className: `w-4 h-4 rounded border-gray-300 text-sky-500 bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-sky-500 cursor-pointer transition-all duration-200 ${error ? 'border-red-500' : ''} ${className || ''}`, ...props }), label && (_jsxs("label", { className: "text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer", children: [label, props.required && _jsx("span", { className: "text-red-500 ml-1", children: "*" })] }))] }), error && (_jsx("p", { className: "text-sm text-red-500 mt-1", children: error })), helperText && !error && (_jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-1", children: helperText }))] }));
};
export default Checkbox;
