// User Profile Page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge } from '@components/common';
import { Input, Select, Checkbox } from '@components/forms';
import { useAppSelector, useAppDispatch } from '@hooks';
import { selectUser } from '@store';
import { uiActions, authActions } from '@store';
import toast from 'react-hot-toast';
import { FiEdit2, FiSave, FiX, FiLogOut } from 'react-icons/fi';
import { authService } from '@services/firebase';

interface FormData {
  displayName: string;
  email: string;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  unitsSystem: 'metric' | 'imperial';
  notificationsEnabled: boolean;
}

export const UserProfilePage: React.FC = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    displayName: user?.displayName || '',
    email: user?.email || '',
    theme: (user?.preferences?.theme || 'dark') as 'light' | 'dark' | 'auto',
    language: user?.preferences?.language || 'en',
    unitsSystem: (user?.preferences?.units || 'metric') as 'metric' | 'imperial',
    notificationsEnabled: user?.preferences?.notifications_enabled === true,
  });

  const handleSaveProfile = async () => {
    try {
      // Call API to update profile
      // await updateUserProfile(user!.id, formData);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setFormData({ ...formData, theme: newTheme as any });
    dispatch(uiActions.setTheme(newTheme as any));
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(authActions.logout());
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout');
      console.error(error);
    }
  };

  // Default profile image SVG
  const defaultProfileImage = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236B7280'%3E%3Ccircle cx='12' cy='12' r='12'/%3E%3Ccircle cx='12' cy='8' r='4' fill='white'/%3E%3Cpath d='M 12 14 C 8 14 4 16 4 20 L 20 20 C 20 16 16 14 12 14 Z' fill='white'/%3E%3C/svg%3E`;

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Account Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your profile and preferences
        </p>
      </div>

      {/* Profile Card */}
      <Card title="Profile Information">
        <div className="space-y-4">
          <div className="flex items-center gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
            <img
              src={user?.photoURL || defaultProfileImage}
              alt={user?.displayName}
              className="w-20 h-20 rounded-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = defaultProfileImage;
              }}
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {user?.displayName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {user?.email}
              </p>
              <Badge variant="primary" size="sm" className="mt-2">
                {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
              </Badge>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <Input
                label="Display Name"
                value={formData.displayName}
                onChange={(e) =>
                  setFormData({ ...formData, displayName: e.target.value })
                }
              />

              <Input
                label="Email"
                type="email"
                value={formData.email}
                disabled
              />

              <div className="flex gap-3">
                <Button
                  variant="primary"
                  icon={<FiSave />}
                  onClick={handleSaveProfile}
                >
                  Save Changes
                </Button>
                <Button
                  variant="secondary"
                  icon={<FiX />}
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="secondary"
              icon={<FiEdit2 />}
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          )}
        </div>
      </Card>

      {/* Preferences Card */}
      <Card title="Preferences">
        <div className="space-y-4">
          <Select
            label="Theme"
            options={[
              { label: 'Light', value: 'light' },
              { label: 'Dark', value: 'dark' },
              { label: 'Auto', value: 'auto' },
            ]}
            value={formData.theme}
            onChange={(e) => handleThemeChange(e.target.value)}
          />

          <Select
            label="Language"
            options={[
              { label: 'English', value: 'en' },
              { label: 'Spanish', value: 'es' },
              { label: 'French', value: 'fr' },
              { label: 'German', value: 'de' },
              { label: 'Chinese', value: 'zh' },
            ]}
            value={formData.language}
            onChange={(e) =>
              setFormData({ ...formData, language: e.target.value })
            }
          />

          <Select
            label="Units System"
            options={[
              { label: 'Metric (°C, m³)', value: 'metric' },
              { label: 'Imperial (°F, ft³)', value: 'imperial' },
            ]}
            value={formData.unitsSystem}
            onChange={(e) =>
              setFormData({ 
                ...formData, 
                unitsSystem: e.target.value as 'metric' | 'imperial'
              })
            }
          />
        </div>
      </Card>

      {/* Notifications Card */}
      <Card title="Notifications & Alerts">
        <div className="space-y-4">
          <Checkbox
            label="Enable All Notifications"
            checked={formData.notificationsEnabled}
            onChange={(e) =>
              setFormData({
                ...formData,
                notificationsEnabled: e.target.checked,
              })
            }
          />

          {formData.notificationsEnabled && (
            <div className="space-y-3 pl-6 border-l-2 border-sky-500">
              <Checkbox label="Email Notifications" defaultChecked />
              <Checkbox label="Push Notifications" defaultChecked />
              <Checkbox label="SMS Alerts" />
            </div>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
            Alert Thresholds
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="PM2.5 Threshold (μg/m³)"
              type="number"
              defaultValue="50"
            />
            <Input
              label="PM10 Threshold (μg/m³)"
              type="number"
              defaultValue="100"
            />
            <Input
              label="CO2 Threshold (ppm)"
              type="number"
              defaultValue="800"
            />
            <Input
              label="Temperature Threshold (°C)"
              type="number"
              defaultValue="30"
            />
          </div>
          <Button variant="primary" className="mt-4">
            Save Alert Settings
          </Button>
        </div>
      </Card>

      {/* Security Card */}
      <Card title="Security">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
              Change Password
            </h4>
            <Button variant="secondary">Update Password</Button>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
              Two-Factor Authentication
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Add an extra layer of security to your account
            </p>
            <Button variant="secondary">Enable 2FA</Button>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
              Danger Zone
            </h4>
            <div className="space-y-3">
              <Button 
                variant="danger"
                icon={<FiLogOut />}
                onClick={handleLogout}
                fullWidth
              >
                Logout
              </Button>
              <Button variant="danger">Delete Account</Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserProfilePage;
