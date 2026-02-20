import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useAuth } from '@context/AuthContext';
import { Navigate } from 'react-router-dom';
export const ProtectedAdmin = ({ children }) => {
    const { user, role, loading } = useAuth();
    if (loading)
        return _jsx("div", { className: "p-6", children: "Loading..." });
    if (!user)
        return _jsx(Navigate, { to: "/login", replace: true });
    if (role !== 'admin')
        return _jsx("div", { className: "p-6", children: "Unauthorized" });
    return _jsx(_Fragment, { children: children });
};
export default ProtectedAdmin;
