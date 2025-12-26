import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiSave,
  FiEdit2,
  FiShield,
  FiClock,
  FiList,
  FiArrowRight,
} from 'react-icons/fi';
import { Button, Input, Card, Alert, Badge, Loader } from '../../components/common';
import { formatDate, formatPhoneNumber } from '../../utils/helpers';
import { ROUTES } from '../../utils/constants';
import useAuthStore from '../../store/authStore';
import useTokenStore from '../../store/tokenStore';
import toast from 'react-hot-toast';

const Profile = () => {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [stats, setStats] = useState({
    totalTokens: 0,
    completedTokens: 0,
    noShows: 0,
    avgWaitTime: '0 mins',
  });

  const { user, updateProfile, getProfile, isLoading: authLoading } = useAuthStore();
  const { fetchMyTokens, fetchTokenHistory, myTokens, tokenHistory } = useTokenStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phoneNumber || '',
      cnic: user?.cnic || '',
    },
  });

  // Fetch user profile and stats on mount
  useEffect(() => {
    const loadData = async () => {
      await getProfile();
      await fetchMyTokens();
      await fetchTokenHistory();
    };
    loadData();
  }, []);

  // Calculate stats from tokens
  useEffect(() => {
    const allTokens = [...(myTokens || []), ...(tokenHistory || [])];
    const completed = allTokens.filter(t => t.status === 'completed');
    const noShows = allTokens.filter(t => t.status === 'no-show');

    const avgWait = completed.length > 0
      ? Math.round(completed.reduce((sum, t) => sum + (t.actualWaitTime || 0), 0) / completed.length)
      : 0;

    setStats({
      totalTokens: allTokens.length,
      completedTokens: completed.length,
      noShows: noShows.length,
      avgWaitTime: `${avgWait} mins`,
    });
  }, [myTokens, tokenHistory]);

  // Reset form when user changes
  useEffect(() => {
    reset({
      name: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phoneNumber || '',
      cnic: user?.cnic || '',
    });
  }, [user, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await updateProfile({
        fullName: data.name,
        phoneNumber: data.phone,
        email: data.email,
      });

      if (result.success) {
        setSuccess(true);
        setEditing(false);
        toast.success(result.message || 'Profile updated successfully!');
        setTimeout(() => setSuccess(false), 3000);
      } else {
        toast.error(result.message || 'Failed to update profile');
      }
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="space-y-6">
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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <Card>
              <Card.Header>
                <Card.Title>Personal Information</Card.Title>
              </Card.Header>

              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 bg-pakistan-green rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {user.fullName || 'User'}
                  </h3>
                  <p className="text-gray-500">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="primary" size="sm">
                      {user.role || 'customer'}
                    </Badge>
                    {user.isEmailVerified && (
                      <Badge variant="success" size="sm" icon={FiShield}>
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {editing ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                    disabled
                    error={errors.email?.message}
                    {...register('email')}
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
                    placeholder="35201-1234567-1"
                    {...register('cnic')}
                  />
                  <div className="flex gap-3">
                    <Button type="submit" loading={loading} icon={FiSave}>
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setEditing(false);
                        reset();
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Full Name</p>
                      <p className="font-medium text-gray-900">{user.fullName || 'Not provided'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Email Address</p>
                      <p className="font-medium text-gray-900">{user.email}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                      <p className="font-medium text-gray-900">
                        {user.phoneNumber ? formatPhoneNumber(user.phoneNumber) : 'Not provided'}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">CNIC</p>
                      <p className="font-medium text-gray-900">
                        {user.cnic || 'Not provided'}
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                      Member since {user.createdAt ? formatDate(user.createdAt, 'long') : 'N/A'}
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Stats */}
          <div className="space-y-6">
            <Card>
              <Card.Header>
                <Card.Title>Account Statistics</Card.Title>
              </Card.Header>

              <div className="space-y-4">
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
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
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
                <p className="text-2xl font-bold text-pakistan-green">
                  {stats.completedTokens > 0 ? `${stats.completedTokens * 30}+ mins` : '0 mins'}
                </p>
              </div>
            </Card>

            {/* Quick Links */}
            <Card>
              <Card.Header>
                <Card.Title>Quick Links</Card.Title>
              </Card.Header>
              <div className="space-y-2">
                <Link
                  to={ROUTES.MY_TOKENS}
                  className="flex items-center justify-between p-3 bg-gray-50 hover:bg-pakistan-green-50 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pakistan-green-100 rounded-lg flex items-center justify-center">
                      <FiList className="w-5 h-5 text-pakistan-green" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 group-hover:text-pakistan-green">My Tokens</p>
                      <p className="text-xs text-gray-500">View active tokens</p>
                    </div>
                  </div>
                  <FiArrowRight className="w-5 h-5 text-gray-400 group-hover:text-pakistan-green" />
                </Link>
                <Link
                  to={ROUTES.TOKEN_HISTORY}
                  className="flex items-center justify-between p-3 bg-gray-50 hover:bg-pakistan-green-50 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <FiClock className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 group-hover:text-pakistan-green">History</p>
                      <p className="text-xs text-gray-500">View past tokens</p>
                    </div>
                  </div>
                  <FiArrowRight className="w-5 h-5 text-gray-400 group-hover:text-pakistan-green" />
                </Link>
                <Link
                  to={ROUTES.BOOK_TOKEN}
                  className="flex items-center justify-between p-3 bg-gray-50 hover:bg-pakistan-green-50 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FiArrowRight className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 group-hover:text-pakistan-green">Book Token</p>
                      <p className="text-xs text-gray-500">Get a new token</p>
                    </div>
                  </div>
                  <FiArrowRight className="w-5 h-5 text-gray-400 group-hover:text-pakistan-green" />
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
