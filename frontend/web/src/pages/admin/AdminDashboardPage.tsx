// Admin Dashboard Page
import React, { useState } from 'react';
import { Card, Badge, Button, Modal } from '@components/common';
import { Input, Select, Checkbox } from '@components/forms';
import { useAppSelector } from '@hooks';
import { selectUser, selectSensors } from '@store';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus, FiBarChart2 } from 'react-icons/fi';

export const AdminDashboardPage: React.FC = () => {
  const user = useAppSelector(selectUser);
  const sensors = useAppSelector(selectSensors);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    deviceName: '',
    location: '',
    latitude: '',
    longitude: '',
  });

  if (user?.role !== 'admin') {
    return (
      <div className="p-6">
        <Card>
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 font-semibold">
              Access Denied: Admin only
            </p>
          </div>
        </Card>
      </div>
    );
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
    } catch (error) {
      toast.error('Failed to add sensor');
    }
  };

  const handleDeleteSensor = async (sensorId: string) => {
    if (!confirm('Are you sure you want to delete this sensor?')) return;

    try {
      // Call API to delete sensor
      toast.success('Sensor deleted successfully');
    } catch (error) {
      toast.error('Failed to delete sensor');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage sensors, users, and system settings
          </p>
        </div>
        <Button
          variant="primary"
          size="lg"
          icon={<FiPlus />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Sensor
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Sensors
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {sensors.length}
            </p>
          </div>
        </Card>

        <Card>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Online Devices
            </p>
            <p className="text-3xl font-bold text-green-600">
              {sensors.filter((s) => s.status === 'online').length}
            </p>
          </div>
        </Card>

        <Card>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Offline Devices
            </p>
            <p className="text-3xl font-bold text-red-600">
              {sensors.filter((s) => s.status === 'offline').length}
            </p>
          </div>
        </Card>

        <Card>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Critical Alerts
            </p>
            <p className="text-3xl font-bold text-orange-600">0</p>
          </div>
        </Card>
      </div>

      {/* Sensors Table */}
      <Card title="Connected Sensors" description="Manage all devices">
        {sensors.length === 0 ? (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">
            <p>No sensors added yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Device Name
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Location
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Last Update
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sensors.map((sensor) => (
                  <tr
                    key={sensor.id}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                      {sensor.deviceName}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {sensor.location}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          sensor.status === 'online' ? 'success' : 'danger'
                        }
                        size="sm"
                      >
                        {sensor.status.charAt(0).toUpperCase() +
                          sensor.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400 text-sm">
                      {sensor.lastUpdate
                        ? new Date(sensor.lastUpdate).toLocaleString()
                        : 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-600 rounded transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteSensor(sensor.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-gray-600 rounded transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add Sensor Modal */}
      <Modal
        isOpen={isAddModalOpen}
        title="Add New Sensor"
        onClose={() => setIsAddModalOpen(false)}
        size="md"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddSensor}>
              Add Sensor
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Device Name"
            placeholder="Sensor-001"
            value={formData.deviceName}
            onChange={(e) =>
              setFormData({ ...formData, deviceName: e.target.value })
            }
            required
          />

          <Input
            label="Location"
            placeholder="City, Country"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Latitude"
              type="number"
              placeholder="40.7128"
              value={formData.latitude}
              onChange={(e) =>
                setFormData({ ...formData, latitude: e.target.value })
              }
              step="0.0001"
            />

            <Input
              label="Longitude"
              type="number"
              placeholder="-74.0060"
              value={formData.longitude}
              onChange={(e) =>
                setFormData({ ...formData, longitude: e.target.value })
              }
              step="0.0001"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboardPage;
