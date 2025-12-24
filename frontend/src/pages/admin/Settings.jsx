import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiSettings,
  FiSave,
  FiGlobe,
  FiBell,
  FiClock,
  FiShield,
  FiMail,
  FiSmartphone,
  FiDatabase,
  FiRefreshCw,
  FiToggleLeft,
  FiToggleRight,
  FiMapPin,
  FiVolume2,
  FiSun,
  FiMoon,
} from 'react-icons/fi';
import { Card, Button, Input, Select } from '../../components/common';
import toast from 'react-hot-toast';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    // General
    centerName: 'NADRA Office - Islamabad',
    centerCode: 'ISB-001',
    address: 'F-8 Markaz, Islamabad',
    phone: '051-1234567',
    email: 'isb-001@nadra.gov.pk',
    timezone: 'Asia/Karachi',
    language: 'en',

    // Queue Settings
    maxQueueSize: 200,
    avgServiceTime: 15,
    tokenPrefix: 'A',
    autoCallEnabled: true,
    noShowTimeout: 5,
    priorityEnabled: true,

    // Notifications
    smsEnabled: true,
    emailEnabled: true,
    pushEnabled: true,
    notifyBefore: 3,
    reminderInterval: 10,

    // Operating Hours
    openTime: '09:00',
    closeTime: '17:00',
    breakStart: '13:00',
    breakEnd: '14:00',
    workDays: ['mon', 'tue', 'wed', 'thu', 'fri'],

    // Display
    displayLanguage: 'bilingual',
    showEstimatedWait: true,
    showQueuePosition: true,
    announcementVolume: 80,
    darkMode: false,
  });

  const tabs = [
    { id: 'general', label: 'General', icon: FiSettings },
    { id: 'queue', label: 'Queue Settings', icon: FiClock },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'hours', label: 'Operating Hours', icon: FiClock },
    { id: 'display', label: 'Display', icon: FiSun },
  ];

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
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    toast.success('Settings saved successfully');
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
                      onChange={(e) => setSettings({ ...settings, maxQueueSize: parseInt(e.target.value) })}
                    />
                    <Input
                      label="Avg Service Time (min)"
                      type="number"
                      value={settings.avgServiceTime}
                      onChange={(e) => setSettings({ ...settings, avgServiceTime: parseInt(e.target.value) })}
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
                    onChange={(e) => setSettings({ ...settings, noShowTimeout: parseInt(e.target.value) })}
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
                      onChange={(e) => setSettings({ ...settings, notifyBefore: parseInt(e.target.value) })}
                      helperText="Number of tokens before to send notification"
                    />
                    <Input
                      label="Reminder Interval (min)"
                      type="number"
                      value={settings.reminderInterval}
                      onChange={(e) => setSettings({ ...settings, reminderInterval: parseInt(e.target.value) })}
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
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
