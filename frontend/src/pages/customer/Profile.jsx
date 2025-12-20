import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiSave,
  FiEdit2,
  FiShield,
  FiClock,
} from 'react-icons/fi';
import { Button, Input, Card, Alert, Badge } from '../../components/common';
import { formatDate, formatPhoneNumber } from '../../utils/helpers';

const Profile = ({ user }) => {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const mockUser = user || {
    name: 'Ahmed Khan',
    email: 'ahmed.khan@email.com',
    phone: '03001234567',
    cnic: '35201-1234567-1',
    role: 'customer',
    createdAt: new Date(Date.now() - 86400000 * 30),
    isEmailVerified: true,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: mockUser.name,
      email: mockUser.email,
      phone: mockUser.phone,
      cnic: mockUser.cnic,
    },
  });

  const stats = {
    totalTokens: 24,
    completedTokens: 21,
    noShows: 2,
    avgWaitTime: '22 mins',
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(true);
      setEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="!space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>
        {!editing && (
          <Button variant="outline" icon={FiEdit2} onClick={() => setEditing(true)}>
            Edit Profile
          </Button>
        )}
      </div>

      {success && (
        <Alert variant="success" onClose={() => setSuccess(false)}>
          Profile updated successfully!
        </Alert>
      )}

      <div className="grid lg:grid-cols-3 !gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-2">
          <Card>
            <Card.Header>
              <Card.Title>Personal Information</Card.Title>
            </Card.Header>

            <div className="flex items-center !space-x-4 !mb-6">
              <div className="w-20 h-20 bg-pakistan-green rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {mockUser.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {mockUser.name}
                </h3>
                <p className="text-gray-500">{mockUser.email}</p>
                <div className="flex items-center !gap-2 !mt-1">
                  <Badge variant="primary" size="sm">
                    {mockUser.role}
                  </Badge>
                  {mockUser.isEmailVerified && (
                    <Badge variant="success" size="sm" icon={FiShield}>
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {editing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="!space-y-4">
                <Input
                  label="Full Name"
                  icon={FiUser}
                  error={errors.name?.message}
                  {...register('name', {
                    required: 'Name is required',
                    minLength: {
                      value: 3,
                      message: 'Name must be at least 3 characters',
                    },
                  })}
                />
                <Input
                  label="Email Address"
                  type="email"
                  icon={FiMail}
                  error={errors.email?.message}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />
                <Input
                  label="Phone Number"
                  icon={FiPhone}
                  error={errors.phone?.message}
                  {...register('phone', {
                    required: 'Phone number is required',
                  })}
                />
                <Input
                  label="CNIC"
                  error={errors.cnic?.message}
                  {...register('cnic')}
                />
                <div className="flex !gap-3">
                  <Button type="submit" loading={loading} icon={FiSave}>
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="!space-y-4">
                <div className="grid sm:grid-cols-2 !gap-4">
                  <div className="!p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 !mb-1">Full Name</p>
                    <p className="font-medium text-gray-900">{mockUser.name}</p>
                  </div>
                  <div className="!p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 !mb-1">Email Address</p>
                    <p className="font-medium text-gray-900">{mockUser.email}</p>
                  </div>
                  <div className="!p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 !mb-1">Phone Number</p>
                    <p className="font-medium text-gray-900">
                      {formatPhoneNumber(mockUser.phone)}
                    </p>
                  </div>
                  <div className="!p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 !mb-1">CNIC</p>
                    <p className="font-medium text-gray-900">
                      {mockUser.cnic || 'Not provided'}
                    </p>
                  </div>
                </div>
                <div className="!pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">
                    Member since {formatDate(mockUser.createdAt, 'long')}
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Stats */}
        <div className="!space-y-6">
          <Card>
            <Card.Header>
              <Card.Title>Account Statistics</Card.Title>
            </Card.Header>

            <div className="!space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Tokens</span>
                <span className="text-xl font-bold text-gray-900">
                  {stats.totalTokens}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Completed</span>
                <span className="text-xl font-bold text-green-600">
                  {stats.completedTokens}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">No Shows</span>
                <span className="text-xl font-bold text-red-600">
                  {stats.noShows}
                </span>
              </div>
              <div className="flex items-center justify-between !pt-4 border-t border-gray-100">
                <span className="text-gray-600">Avg. Wait Time</span>
                <span className="text-xl font-bold text-pakistan-green">
                  {stats.avgWaitTime}
                </span>
              </div>
            </div>
          </Card>

          <Card className="bg-pakistan-green-50 border-pakistan-green-200">
            <div className="text-center">
              <FiClock className="w-8 h-8 text-pakistan-green mx-auto mb-2" />
              <p className="text-sm text-pakistan-green font-medium">
                Time Saved with SQP
              </p>
              <p className="text-2xl font-bold text-pakistan-green">12+ Hours</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
