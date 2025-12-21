import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { Button, Input, Alert } from '../../components/common';
import { ROUTES } from '../../utils/constants';
import useAuthStore from '../../store/authStore';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      const result = await login(data.email, data.password);

      if (result.success) {
        // Check for pending booking
        const pendingBooking = localStorage.getItem('pendingBooking');
        const from = location.state?.from;

        if (pendingBooking && from === ROUTES.BOOK_TOKEN) {
          // User came from book-token page, redirect back to complete booking
          navigate(ROUTES.BOOK_TOKEN, {
            state: { resumeBooking: true }
          });
          return;
        }

        // Normal role-based redirection
        if (result.user.role === 'admin') {
          navigate(ROUTES.ADMIN_DASHBOARD);
        } else {
          navigate(ROUTES.CUSTOMER_DASHBOARD);
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 !mb-2">Welcome Back</h2>
      <p className="text-gray-600 !mb-8">
        Login to your account to manage your tokens.
      </p>

      {error && (
        <Alert variant="error" className="!mb-6" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="!space-y-5">
        <Input
          label="Email Address"
          type="email"
          placeholder="your@email.com"
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
          label="Password"
          type="password"
          placeholder="Enter your password"
          icon={FiLock}
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="w-4 h-4 text-pakistan-green border-gray-300 rounded focus:ring-pakistan-green"
              {...register('remember')}
            />
            <span className="!ml-2 text-sm text-gray-600">Remember me</span>
          </label>

          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-sm text-pakistan-green hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          fullWidth
          loading={loading}
          icon={FiArrowRight}
          iconPosition="right"
        >
          Login
        </Button>
      </form>

      <div className="!mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="!px-4 bg-white text-gray-500">or</span>
          </div>
        </div>

        <p className="!mt-6 text-center text-gray-600">
          Don't have an account?{' '}
          <Link
            to={ROUTES.REGISTER}
            className="font-medium text-pakistan-green hover:underline"
          >
            Register now
          </Link>
        </p>
      </div>

      {/* Demo Credentials */}
      <div className="!mt-8 !p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 font-medium !mb-2">Demo Credentials:</p>
        <p className="text-xs text-gray-500">Customer: user@email.com</p>
        <p className="text-xs text-gray-500">Admin: admin@email.com</p>
        <p className="text-xs text-gray-500">Password: any (6+ chars)</p>
      </div>
    </div>
  );
};

export default Login;
