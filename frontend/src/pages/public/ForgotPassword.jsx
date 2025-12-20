import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { Button, Input, Alert } from '../../components/common';
import { ROUTES } from '../../utils/constants';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(true);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto !mb-6">
          <FiCheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 !mb-2">Check Your Email</h2>
        <p className="text-gray-600 !mb-8">
          We've sent a password reset link to your email address. Please check your inbox.
        </p>
        <Link to={ROUTES.LOGIN}>
          <Button variant="outline" icon={FiArrowLeft}>
            Back to Login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        to={ROUTES.LOGIN}
        className="inline-flex items-center text-sm text-gray-600 hover:text-pakistan-green !mb-8"
      >
        <FiArrowLeft className="!mr-2" />
        Back to Login
      </Link>

      <h2 className="text-2xl font-bold text-gray-900 !mb-2">Forgot Password?</h2>
      <p className="text-gray-600 !mb-8">
        Enter your email address and we'll send you a link to reset your password.
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

        <Button type="submit" fullWidth loading={loading}>
          Send Reset Link
        </Button>
      </form>
    </div>
  );
};

export default ForgotPassword;
