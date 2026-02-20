import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// User Profile Page
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge } from '@components/common';
import { Input, Select, Checkbox } from '@components/forms';
import { useAppSelector, useAppDispatch } from '@hooks';
import { selectUser } from '@store';
import { uiActions, authActions } from '@store';
import toast from 'react-hot-toast';
import { FiEdit2, FiSave, FiX, FiLogOut } from 'react-icons/fi';
import { authService } from '@services/firebase';
export const UserProfilePage = () => {
    const user = useAppSelector(selectUser);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        displayName: user?.displayName || '',
        email: user?.email || '',
        theme: (user?.preferences?.theme || 'dark'),
        language: user?.preferences?.language || 'en',
        unitsSystem: (user?.preferences?.units || 'metric'),
        notificationsEnabled: user?.preferences?.notifications_enabled === true,
    });
    const handleSaveProfile = async () => {
        try {
            // Call API to update profile
            // await updateUserProfile(user!.id, formData);
            toast.success('Profile updated successfully');
            setIsEditing(false);
        }
        catch (error) {
            toast.error('Failed to update profile');
        }
    };
    const handleThemeChange = (newTheme) => {
        setFormData({ ...formData, theme: newTheme });
        dispatch(uiActions.setTheme(newTheme));
    };
    const handleLogout = async () => {
        try {
            await authService.logout();
            dispatch(authActions.logout());
            toast.success('Logged out successfully');
            navigate('/login');
        }
        catch (error) {
            toast.error('Failed to logout');
            console.error(error);
        }
    };
    // Default profile image SVG
    const defaultProfileImage = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236B7280'%3E%3Ccircle cx='12' cy='12' r='12'/%3E%3Ccircle cx='12' cy='8' r='4' fill='white'/%3E%3Cpath d='M 12 14 C 8 14 4 16 4 20 L 20 20 C 20 16 16 14 12 14 Z' fill='white'/%3E%3C/svg%3E`;
    return (_jsxs("div", { className: "p-6 space-y-6 max-w-4xl", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-white", children: "Account Settings" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mt-1", children: "Manage your profile and preferences" })] }), _jsx(Card, { title: "Profile Information", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center gap-4 pb-6 border-b border-gray-200 dark:border-gray-700", children: [_jsx("img", { src: user?.photoURL || defaultProfileImage, alt: user?.displayName, className: "w-20 h-20 rounded-full", onError: (e) => {
                                        e.target.src = defaultProfileImage;
                                    } }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: user?.displayName }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: user?.email }), _jsx(Badge, { variant: "primary", size: "sm", className: "mt-2", children: user?.role.charAt(0).toUpperCase() + user?.role.slice(1) })] })] }), isEditing ? (_jsxs("div", { className: "space-y-4", children: [_jsx(Input, { label: "Display Name", value: formData.displayName, onChange: (e) => setFormData({ ...formData, displayName: e.target.value }) }), _jsx(Input, { label: "Email", type: "email", value: formData.email, disabled: true }), _jsxs("div", { className: "flex gap-3", children: [_jsx(Button, { variant: "primary", icon: _jsx(FiSave, {}), onClick: handleSaveProfile, children: "Save Changes" }), _jsx(Button, { variant: "secondary", icon: _jsx(FiX, {}), onClick: () => setIsEditing(false), children: "Cancel" })] })] })) : (_jsx(Button, { variant: "secondary", icon: _jsx(FiEdit2, {}), onClick: () => setIsEditing(true), children: "Edit Profile" }))] }) }), _jsx(Card, { title: "Preferences", children: _jsxs("div", { className: "space-y-4", children: [_jsx(Select, { label: "Theme", options: [
                                { label: 'Light', value: 'light' },
                                { label: 'Dark', value: 'dark' },
                                { label: 'Auto', value: 'auto' },
                            ], value: formData.theme, onChange: (e) => handleThemeChange(e.target.value) }), _jsx(Select, { label: "Language", options: [
                                { label: 'English', value: 'en' },
                                { label: 'Spanish', value: 'es' },
                                { label: 'French', value: 'fr' },
                                { label: 'German', value: 'de' },
                                { label: 'Chinese', value: 'zh' },
                            ], value: formData.language, onChange: (e) => setFormData({ ...formData, language: e.target.value }) }), _jsx(Select, { label: "Units System", options: [
                                { label: 'Metric (°C, m³)', value: 'metric' },
                                { label: 'Imperial (°F, ft³)', value: 'imperial' },
                            ], value: formData.unitsSystem, onChange: (e) => setFormData({
                                ...formData,
                                unitsSystem: e.target.value
                            }) })] }) }), _jsxs(Card, { title: "Notifications & Alerts", children: [_jsxs("div", { className: "space-y-4", children: [_jsx(Checkbox, { label: "Enable All Notifications", checked: formData.notificationsEnabled, onChange: (e) => setFormData({
                                    ...formData,
                                    notificationsEnabled: e.target.checked,
                                }) }), formData.notificationsEnabled && (_jsxs("div", { className: "space-y-3 pl-6 border-l-2 border-sky-500", children: [_jsx(Checkbox, { label: "Email Notifications", defaultChecked: true }), _jsx(Checkbox, { label: "Push Notifications", defaultChecked: true }), _jsx(Checkbox, { label: "SMS Alerts" })] }))] }), _jsxs("div", { className: "mt-6 pt-6 border-t border-gray-200 dark:border-gray-700", children: [_jsx("h4", { className: "font-semibold text-gray-900 dark:text-white mb-4", children: "Alert Thresholds" }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsx(Input, { label: "PM2.5 Threshold (\u03BCg/m\u00B3)", type: "number", defaultValue: "50" }), _jsx(Input, { label: "PM10 Threshold (\u03BCg/m\u00B3)", type: "number", defaultValue: "100" }), _jsx(Input, { label: "CO2 Threshold (ppm)", type: "number", defaultValue: "800" }), _jsx(Input, { label: "Temperature Threshold (\u00B0C)", type: "number", defaultValue: "30" })] }), _jsx(Button, { variant: "primary", className: "mt-4", children: "Save Alert Settings" })] })] }), _jsx(Card, { title: "Security", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-gray-900 dark:text-white mb-3", children: "Change Password" }), _jsx(Button, { variant: "secondary", children: "Update Password" })] }), _jsxs("div", { className: "pt-4 border-t border-gray-200 dark:border-gray-700", children: [_jsx("h4", { className: "font-semibold text-gray-900 dark:text-white mb-3", children: "Two-Factor Authentication" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-3", children: "Add an extra layer of security to your account" }), _jsx(Button, { variant: "secondary", children: "Enable 2FA" })] }), _jsxs("div", { className: "pt-4 border-t border-gray-200 dark:border-gray-700", children: [_jsx("h4", { className: "font-semibold text-gray-900 dark:text-white mb-3", children: "Danger Zone" }), _jsxs("div", { className: "space-y-3", children: [_jsx(Button, { variant: "danger", icon: _jsx(FiLogOut, {}), onClick: handleLogout, fullWidth: true, children: "Logout" }), _jsx(Button, { variant: "danger", children: "Delete Account" })] })] })] }) })] }));
};
export default UserProfilePage;
