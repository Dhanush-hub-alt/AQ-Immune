import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Modal Component
import { useEffect, useRef } from 'react';
import FocusTrap from 'focus-trap-react';
export const Modal = ({ isOpen, title, children, onClose, size = 'md', showCloseButton = true, footer, className, }) => {
    const modalRef = useRef(null);
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEscape);
        }
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);
    if (!isOpen)
        return null;
    const sizeStyles = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
    };
    return (_jsx(FocusTrap, { children: _jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50", children: _jsxs("div", { ref: modalRef, className: `bg-white dark:bg-gray-800 rounded-lg shadow-xl ${sizeStyles[size]} w-full mx-4 ${className || ''}`, children: [title && (_jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 dark:text-white", children: title }), showCloseButton && (_jsx("button", { onClick: onClose, className: "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200", children: _jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) }))] })), _jsx("div", { className: "px-6 py-4", children: children }), footer && (_jsx("div", { className: "px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex gap-3 justify-end", children: footer }))] }) }) }));
};
export default Modal;
