import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const Card = ({ children, className, title, description, footer, hoverable = false, clickable = false, onClick, }) => {
    return (_jsxs("div", { className: `bg-white dark:bg-gray-800 rounded-lg shadow-md transition-all duration-200 ${hoverable ? 'hover:shadow-lg hover:scale-105' : ''} ${clickable ? 'cursor-pointer' : ''} ${className || ''}`, onClick: onClick, children: [title && (_jsxs("div", { className: "px-6 py-4 border-b border-gray-200 dark:border-gray-700", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: title }), description && (_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-1", children: description }))] })), _jsx("div", { className: "px-6 py-4", children: children }), footer && (_jsx("div", { className: "px-6 py-4 border-t border-gray-200 dark:border-gray-700", children: footer }))] }));
};
export default Card;
