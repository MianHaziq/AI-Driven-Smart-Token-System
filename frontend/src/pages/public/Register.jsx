import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiUser, FiMail, FiLock, FiPhone, FiArrowRight, FiCreditCard } from 'react-icons/fi';
import { Button, Input, Alert } from '../../components/common';
import { ROUTES } from '../../utils/constants';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const registerUser = useAuthStore((state) => state.register);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      const result = await registerUser(
        data.name,
        data.phone,
        data.cnic,
        data.email,
        data.password
      );

      if (result.success) {
        toast.success('Account created successfully! Please login.', {
          icon: '✅',
          duration: 4000,
        });
        navigate(ROUTES.LOGIN);
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
      <h2 className="text-2xl font-bold text-gray-900 !mb-2">Create Account</h2>
      <p className="text-gray-600 !mb-8">
        Register to start booking tokens and saving time.
      </p>

      {error && (
        <Alert variant="error" className="!mb-6" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="!space-y-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="Ahmed Khan"
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
          label="Phone Number"
          type="tel"
          placeholder="03XX XXXXXXX"
          icon={FiPhone}
          error={errors.phone?.message}
          {...register('phone', {
            required: 'Phone number is required',
            pattern: {
              value: /^(03[0-9]{9}|\\+923[0-9]{9})$/,
              message: 'Enter valid Pakistani phone number',
            },
          })}
        />

        <Input
          label="CNIC"
          type="text"
          placeholder="XXXXX-XXXXXXX-X"
          icon={FiCreditCard}
          error={errors.cnic?.message}
          {...register('cnic', {
            required: 'CNIC is required',
            pattern: {
              value: /^[0-9]{5}-[0-9]{7}-[0-9]$/,
              message: 'Enter valid CNIC format (XXXXX-XXXXXXX-X)',
            },
          })}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Create a password"
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

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          icon={FiLock}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === password || 'Passwords do not match',
          })}
        />

        <div className="flex items-start">
          <input
            type="checkbox"
            id="terms"
            className="w-4 h-4 !mt-1 text-pakistan-green border-gray-300 rounded focus:ring-pakistan-green"
            {...register('terms', {
              required: 'You must accept the terms and conditions',
            })}
          />
          <label htmlFor="terms" className="!ml-2 text-sm text-gray-600">
            I agree to the{' '}
            <Link to="#" className="text-pakistan-green hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="#" className="text-pakistan-green hover:underline">
              Privacy Policy
            </Link>
          </label>
        </div>
        {errors.terms && (
          <p className="text-sm text-red-500">{errors.terms.message}</p>
        )}

        <Button
          type="submit"
          fullWidth
          loading={loading}
          icon={FiArrowRight}
          iconPosition="right"
        >
          Create Account
        </Button>
      </form>

      <p className="!mt-6 text-center text-gray-600">
        Already have an account?{' '}
        <Link
          to={ROUTES.LOGIN}
          className="font-medium text-pakistan-green hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;
