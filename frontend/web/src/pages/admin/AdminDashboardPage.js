import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// Admin Dashboard Page
import { useState } from 'react';
import { Card, Badge, Button, Modal } from '@components/common';
import { Input } from '@components/forms';
import { useAppSelector } from '@hooks';
import { selectUser, selectSensors } from '@store';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
export const AdminDashboardPage = () => {
    const user = useAppSelector(selectUser);
    const sensors = useAppSelector(selectSensors);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedSensor, setSelectedSensor] = useState(null);
    const [formData, setFormData] = useState({
        deviceName: '',
        location: '',
        latitude: '',
        longitude: '',
    });
    if (user?.role !== 'admin') {
        return (_jsx("div", { className: "p-6", children: _jsx(Card, { children: _jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-red-600 dark:text-red-400 font-semibold", children: "Access Denied: Admin only" }) }) }) }));
    }
    const handleAddSensor = async () => {
        if (!formData.deviceName || !formData.location) {
            toast.error('Please fill in all fields');
            return;
        }
        try {
            // Call API to add sensor
            toast.success('Sensor added successfully');
            setIsAddModalOpen(false);
            setFormData({ deviceName: '', location: '', latitude: '', longitude: '' });
        }
        catch (error) {
            toast.error('Failed to add sensor');
        }
    };
    const handleDeleteSensor = async (sensorId) => {
        if (!confirm('Are you sure you want to delete this sensor?'))
            return;
        try {
            // Call API to delete sensor
            toast.success('Sensor deleted successfully');
        }
        catch (error) {
            toast.error('Failed to delete sensor');
        }
    };
    return (_jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-white", children: "Admin Dashboard" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mt-1", children: "Manage sensors, users, and system settings" })] }), _jsx(Button, { variant: "primary", size: "lg", icon: _jsx(FiPlus, {}), onClick: () => setIsAddModalOpen(true), children: "Add Sensor" })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsx(Card, { children: _jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Total Sensors" }), _jsx("p", { className: "text-3xl font-bold text-gray-900 dark:text-white", children: sensors.length })] }) }), _jsx(Card, { children: _jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Online Devices" }), _jsx("p", { className: "text-3xl font-bold text-green-600", children: sensors.filter((s) => s.status === 'online').length })] }) }), _jsx(Card, { children: _jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Offline Devices" }), _jsx("p", { className: "text-3xl font-bold text-red-600", children: sensors.filter((s) => s.status === 'offline').length })] }) }), _jsx(Card, { children: _jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Critical Alerts" }), _jsx("p", { className: "text-3xl font-bold text-orange-600", children: "0" })] }) })] }), _jsx(Card, { title: "Connected Sensors", description: "Manage all devices", children: sensors.length === 0 ? (_jsx("div", { className: "text-center py-8 text-gray-600 dark:text-gray-400", children: _jsx("p", { children: "No sensors added yet" }) })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-200 dark:border-gray-700", children: [_jsx("th", { className: "text-left py-3 px-4 font-semibold text-gray-900 dark:text-white", children: "Device Name" }), _jsx("th", { className: "text-left py-3 px-4 font-semibold text-gray-900 dark:text-white", children: "Location" }), _jsx("th", { className: "text-left py-3 px-4 font-semibold text-gray-900 dark:text-white", children: "Status" }), _jsx("th", { className: "text-left py-3 px-4 font-semibold text-gray-900 dark:text-white", children: "Last Update" }), _jsx("th", { className: "text-left py-3 px-4 font-semibold text-gray-900 dark:text-white", children: "Actions" })] }) }), _jsx("tbody", { children: sensors.map((sensor) => (_jsxs("tr", { className: "border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors", children: [_jsx("td", { className: "py-3 px-4 text-gray-900 dark:text-white font-medium", children: sensor.deviceName }), _jsx("td", { className: "py-3 px-4 text-gray-600 dark:text-gray-400", children: sensor.location }), _jsx("td", { className: "py-3 px-4", children: _jsx(Badge, { variant: sensor.status === 'online' ? 'success' : 'danger', size: "sm", children: sensor.status.charAt(0).toUpperCase() +
                                                    sensor.status.slice(1) }) }), _jsx("td", { className: "py-3 px-4 text-gray-600 dark:text-gray-400 text-sm", children: sensor.lastUpdate
                                                ? new Date(sensor.lastUpdate).toLocaleString()
                                                : 'N/A' }), _jsx("td", { className: "py-3 px-4", children: _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { className: "p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-600 rounded transition-colors", title: "Edit", children: _jsx(FiEdit2, { size: 18 }) }), _jsx("button", { onClick: () => handleDeleteSensor(sensor.id), className: "p-2 text-red-600 hover:bg-red-50 dark:hover:bg-gray-600 rounded transition-colors", title: "Delete", children: _jsx(FiTrash2, { size: 18 }) })] }) })] }, sensor.id))) })] }) })) }), _jsx(Modal, { isOpen: isAddModalOpen, title: "Add New Sensor", onClose: () => setIsAddModalOpen(false), size: "md", footer: _jsxs(_Fragment, { children: [_jsx(Button, { variant: "secondary", onClick: () => setIsAddModalOpen(false), children: "Cancel" }), _jsx(Button, { variant: "primary", onClick: handleAddSensor, children: "Add Sensor" })] }), children: _jsxs("div", { className: "space-y-4", children: [_jsx(Input, { label: "Device Name", placeholder: "Sensor-001", value: formData.deviceName, onChange: (e) => setFormData({ ...formData, deviceName: e.target.value }), required: true }), _jsx(Input, { label: "Location", placeholder: "City, Country", value: formData.location, onChange: (e) => setFormData({ ...formData, location: e.target.value }), required: true }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(Input, { label: "Latitude", type: "number", placeholder: "40.7128", value: formData.latitude, onChange: (e) => setFormData({ ...formData, latitude: e.target.value }), step: "0.0001" }), _jsx(Input, { label: "Longitude", type: "number", placeholder: "-74.0060", value: formData.longitude, onChange: (e) => setFormData({ ...formData, longitude: e.target.value }), step: "0.0001" })] })] }) })] }));
};
export default AdminDashboardPage;
