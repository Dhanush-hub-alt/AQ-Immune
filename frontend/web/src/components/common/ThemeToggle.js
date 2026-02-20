import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
export const ThemeToggle = () => {
    const toggle = () => {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    };
    React.useEffect(() => {
        const saved = localStorage.getItem('theme') || 'dark';
        if (saved === 'dark')
            document.documentElement.classList.add('dark');
        else
            document.documentElement.classList.remove('dark');
    }, []);
    return (_jsx("button", { className: "btn-neon", onClick: toggle, "aria-label": "Toggle theme", children: "Toggle Theme" }));
};
export default ThemeToggle;
