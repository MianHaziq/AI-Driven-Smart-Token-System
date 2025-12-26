import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiSettings,
  FiSave,
  FiGlobe,
  FiBell,
  FiClock,
  FiMapPin,
  FiVolume2,
  FiSun,
  FiUser,
  FiLock,
  FiTrash2,
  FiAlertTriangle,
} from 'react-icons/fi';
import { Card, Button, Input, Select, Loader, Modal } from '../../components/common';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import useAuthStore from '../../store/authStore';

const Settings = () => {
  const navigate = useNavigate();
  const { changePassword, deleteAccount, user } = useAuthStore();

  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Delete account state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    centerName: '',
    centerCode: '',
    address: '',
    phone: '',
    email: '',
    timezone: 'Asia/Karachi',
    language: 'en',
    maxQueueSize: 200,
    avgServiceTime: 15,
    tokenPrefix: 'A',
    autoCallEnabled: true,
    noShowTimeout: 5,
    priorityEnabled: true,
    smsEnabled: true,
    emailEnabled: true,
    pushEnabled: true,
    notifyBefore: 3,
    reminderInterval: 10,
    openTime: '09:00',
    closeTime: '17:00',
    breakStart: '13:00',
    breakEnd: '14:00',
    workDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
    displayLanguage: 'bilingual',
    showEstimatedWait: true,
    showQueuePosition: true,
    announcementVolume: 80,
    darkMode: false,
  });

  // Fetch settings from backend
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/settings');
      setSettings(prev => ({ ...prev, ...response.data }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const tabs = [
    { id: 'general', label: 'General', icon: FiSettings },
    { id: 'queue', label: 'Queue Settings', icon: FiClock },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'hours', label: 'Operating Hours', icon: FiClock },
    { id: 'display', label: 'Display', icon: FiSun },
    { id: 'account', label: 'Account', icon: FiUser },
  ];

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    setIsChangingPassword(true);
    try {
      const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);
      if (result.success) {
        toast.success(result.message || 'Password changed successfully');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(result.message || 'Failed to change password');
      }
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error('Please enter your password');
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteAccount(deletePassword);
      if (result.success) {
        toast.success(result.message || 'Account deleted successfully');
        setShowDeleteModal(false);
        navigate('/login');
      } else {
        toast.error(result.message || 'Failed to delete account');
      }
    } catch (error) {
      toast.error('Failed to delete account');
    } finally {
      setIsDeleting(false);
    }
  };

  const timezones = [
    { value: 'Asia/Karachi', label: 'Pakistan (PKT)' },
    { value: 'Asia/Dubai', label: 'UAE (GST)' },
    { value: 'Europe/London', label: 'UK (GMT)' },
  ];

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'ur', label: 'Urdu' },
    { value: 'bilingual', label: 'Bilingual (EN/UR)' },
  ];

  const workDayOptions = [
    { value: 'mon', label: 'Monday' },
    { value: 'tue', label: 'Tuesday' },
    { value: 'wed', label: 'Wednesday' },
    { value: 'thu', label: 'Thursday' },
    { value: 'fri', label: 'Friday' },
    { value: 'sat', label: 'Saturday' },
    { value: 'sun', label: 'Sunday' },
  ];

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await api.put('/settings', settings);
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleWorkDayToggle = (day) => {
    setSettings(prev => ({
      ...prev,
      workDays: prev.workDays.includes(day)
        ? prev.workDays.filter(d => d !== day)
        : [...prev.workDays, day],
    }));
  };

  const ToggleSwitch = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <div>
        <p className="font-medium text-gray-900">{label}</p>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <button
        onClick={onChange}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          enabled ? 'bg-pakistan-green' : 'bg-gray-300'
        }`}
      >
        <motion.div
          initial={false}
          animate={{ x: enabled ? 24 : 2 }}
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
        />
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">Configure your service center settings and preferences</p>
        </div>
        <Button icon={FiSave} onClick={handleSave} loading={isSaving}>
          Save Changes
        </Button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="border-0 shadow-lg lg:col-span-1 h-fit">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-pakistan-green text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </Card>

        {/* Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* General Settings */}
            {activeTab === 'general' && (
              <Card className="border-0 shadow-lg">
                <Card.Header>
                  <Card.Title subtitle="Basic information about your service center">
                    <span className="flex items-center gap-2">
                      <FiGlobe className="w-5 h-5 text-pakistan-green" />
                      General Settings
                    </span>
                  </Card.Title>
                </Card.Header>

                <div className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="Center Name"
                      value={settings.centerName}
                      onChange={(e) => setSettings({ ...settings, centerName: e.target.value })}
                    />
                    <Input
                      label="Center Code"
                      value={settings.centerCode}
                      onChange={(e) => setSettings({ ...settings, centerCode: e.target.value })}
                    />
                  </div>

                  <Input
                    label="Address"
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    icon={FiMapPin}
                  />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="Phone"
                      value={settings.phone}
                      onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Select
                      label="Timezone"
                      options={timezones}
                      value={settings.timezone}
                      onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                    />
                    <Select
                      label="Language"
                      options={languages}
                      value={settings.language}
                      onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                    />
                  </div>
                </div>
              </Card>
            )}

            {/* Queue Settings */}
            {activeTab === 'queue' && (
              <Card className="border-0 shadow-lg">
                <Card.Header>
                  <Card.Title subtitle="Configure queue behavior and token settings">
                    <span className="flex items-center gap-2">
                      <FiClock className="w-5 h-5 text-pakistan-green" />
                      Queue Settings
                    </span>
                  </Card.Title>
                </Card.Header>

                <div className="space-y-6">
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Input
                      label="Max Queue Size"
                      type="number"
                      value={settings.maxQueueSize}
                      onChange={(e) => setSettings({ ...settings, maxQueueSize: parseInt(e.target.value) || 0 })}
                    />
                    <Input
                      label="Avg Service Time (min)"
                      type="number"
                      value={settings.avgServiceTime}
                      onChange={(e) => setSettings({ ...settings, avgServiceTime: parseInt(e.target.value) || 0 })}
                    />
                    <Input
                      label="Token Prefix"
                      value={settings.tokenPrefix}
                      onChange={(e) => setSettings({ ...settings, tokenPrefix: e.target.value })}
                      maxLength={2}
                    />
                  </div>

                  <Input
                    label="No-Show Timeout (minutes)"
                    type="number"
                    value={settings.noShowTimeout}
                    onChange={(e) => setSettings({ ...settings, noShowTimeout: parseInt(e.target.value) || 0 })}
                    helperText="Time to wait before marking token as no-show after being called"
                  />

                  <div className="space-y-2">
                    <ToggleSwitch
                      enabled={settings.autoCallEnabled}
                      onChange={() => handleToggle('autoCallEnabled')}
                      label="Auto-Call Next Token"
                      description="Automatically call next token when current is completed"
                    />
                    <ToggleSwitch
                      enabled={settings.priorityEnabled}
                      onChange={() => handleToggle('priorityEnabled')}
                      label="Priority Queue"
                      description="Enable priority booking for senior citizens and disabled persons"
                    />
                  </div>
                </div>
              </Card>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <Card className="border-0 shadow-lg">
                <Card.Header>
                  <Card.Title subtitle="Configure how customers receive notifications">
                    <span className="flex items-center gap-2">
                      <FiBell className="w-5 h-5 text-pakistan-green" />
                      Notification Settings
                    </span>
                  </Card.Title>
                </Card.Header>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <ToggleSwitch
                      enabled={settings.smsEnabled}
                      onChange={() => handleToggle('smsEnabled')}
                      label="SMS Notifications"
                      description="Send SMS alerts when customer's turn is approaching"
                    />
                    <ToggleSwitch
                      enabled={settings.emailEnabled}
                      onChange={() => handleToggle('emailEnabled')}
                      label="Email Notifications"
                      description="Send email confirmations and reminders"
                    />
                    <ToggleSwitch
                      enabled={settings.pushEnabled}
                      onChange={() => handleToggle('pushEnabled')}
                      label="Push Notifications"
                      description="Send real-time push notifications via mobile app"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="Notify Before (tokens)"
                      type="number"
                      value={settings.notifyBefore}
                      onChange={(e) => setSettings({ ...settings, notifyBefore: parseInt(e.target.value) || 0 })}
                      helperText="Number of tokens before to send notification"
                    />
                    <Input
                      label="Reminder Interval (min)"
                      type="number"
                      value={settings.reminderInterval}
                      onChange={(e) => setSettings({ ...settings, reminderInterval: parseInt(e.target.value) || 0 })}
                      helperText="Time between reminder notifications"
                    />
                  </div>
                </div>
              </Card>
            )}

            {/* Operating Hours */}
            {activeTab === 'hours' && (
              <Card className="border-0 shadow-lg">
                <Card.Header>
                  <Card.Title subtitle="Set your service center operating hours">
                    <span className="flex items-center gap-2">
                      <FiClock className="w-5 h-5 text-pakistan-green" />
                      Operating Hours
                    </span>
                  </Card.Title>
                </Card.Header>

                <div className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="Opening Time"
                      type="time"
                      value={settings.openTime}
                      onChange={(e) => setSettings({ ...settings, openTime: e.target.value })}
                    />
                    <Input
                      label="Closing Time"
                      type="time"
                      value={settings.closeTime}
                      onChange={(e) => setSettings({ ...settings, closeTime: e.target.value })}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="Break Start"
                      type="time"
                      value={settings.breakStart}
                      onChange={(e) => setSettings({ ...settings, breakStart: e.target.value })}
                    />
                    <Input
                      label="Break End"
                      type="time"
                      value={settings.breakEnd}
                      onChange={(e) => setSettings({ ...settings, breakEnd: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Working Days
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {workDayOptions.map(day => (
                        <button
                          key={day.value}
                          onClick={() => handleWorkDayToggle(day.value)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                            settings.workDays.includes(day.value)
                              ? 'bg-pakistan-green text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Display Settings */}
            {activeTab === 'display' && (
              <Card className="border-0 shadow-lg">
                <Card.Header>
                  <Card.Title subtitle="Configure display and announcement settings">
                    <span className="flex items-center gap-2">
                      <FiSun className="w-5 h-5 text-pakistan-green" />
                      Display Settings
                    </span>
                  </Card.Title>
                </Card.Header>

                <div className="space-y-6">
                  <Select
                    label="Display Language"
                    options={languages}
                    value={settings.displayLanguage}
                    onChange={(e) => setSettings({ ...settings, displayLanguage: e.target.value })}
                  />

                  <div className="space-y-2">
                    <ToggleSwitch
                      enabled={settings.showEstimatedWait}
                      onChange={() => handleToggle('showEstimatedWait')}
                      label="Show Estimated Wait Time"
                      description="Display estimated wait time on customer screens"
                    />
                    <ToggleSwitch
                      enabled={settings.showQueuePosition}
                      onChange={() => handleToggle('showQueuePosition')}
                      label="Show Queue Position"
                      description="Display customer's position in the queue"
                    />
                    <ToggleSwitch
                      enabled={settings.darkMode}
                      onChange={() => handleToggle('darkMode')}
                      label="Dark Mode"
                      description="Enable dark mode for display screens"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Announcement Volume: {settings.announcementVolume}%
                    </label>
                    <div className="flex items-center gap-4">
                      <FiVolume2 className="w-5 h-5 text-gray-400" />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={settings.announcementVolume}
                        onChange={(e) => setSettings({ ...settings, announcementVolume: parseInt(e.target.value) })}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pakistan-green"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Account Settings */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                {/* Change Password */}
                <Card className="border-0 shadow-lg">
                  <Card.Header>
                    <Card.Title subtitle="Update your password to keep your account secure">
                      <span className="flex items-center gap-2">
                        <FiLock className="w-5 h-5 text-pakistan-green" />
                        Change Password
                      </span>
                    </Card.Title>
                  </Card.Header>

                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <Input
                      label="Current Password"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      placeholder="Enter current password"
                      required
                    />
                    <Input
                      label="New Password"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      placeholder="Enter new password (min 6 characters)"
                      required
                    />
                    <Input
                      label="Confirm New Password"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      placeholder="Confirm new password"
                      required
                    />
                    <Button
                      type="submit"
                      loading={isChangingPassword}
                      icon={FiLock}
                    >
                      Change Password
                    </Button>
                  </form>
                </Card>

                {/* Delete Account */}
                <Card className="border-0 shadow-lg border-red-200">
                  <Card.Header>
                    <Card.Title subtitle="Permanently delete your account and all associated data">
                      <span className="flex items-center gap-2 text-red-600">
                        <FiTrash2 className="w-5 h-5" />
                        Delete Account
                      </span>
                    </Card.Title>
                  </Card.Header>

                  <div className="space-y-4">
                    <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                      <div className="flex items-start gap-3">
                        <FiAlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-red-800">Warning: This action is irreversible</p>
                          <p className="text-sm text-red-600 mt-1">
                            Once you delete your account, all your data will be permanently removed.
                            This includes your profile, tokens history, and any other associated information.
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="danger"
                      icon={FiTrash2}
                      onClick={() => setShowDeleteModal(true)}
                    >
                      Delete My Account
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletePassword('');
        }}
        title="Delete Account"
        size="sm"
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-50 rounded-xl">
            <p className="text-sm text-red-600">
              This will permanently delete your account. Enter your password to confirm.
            </p>
          </div>
          <Input
            label="Enter your password"
            type="password"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            placeholder="Your password"
          />
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false);
                setDeletePassword('');
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteAccount}
              loading={isDeleting}
              className="flex-1"
            >
              Delete Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Settings;
