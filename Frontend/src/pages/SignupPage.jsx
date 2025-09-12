import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signup } from '../features/auth/authSlice.js';
import { MdErrorOutline, MdCheckCircle } from 'react-icons/md';
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";

const SignupPage = () => {
  const { register, handleSubmit, formState: { errors }, watch, trigger } = useForm();
  const dispatch = useDispatch();
  const { user, isLoading, isError, message } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const passwordValue = watch('password', '');

  // Password requirements
  const hasMinLength = passwordValue.length >= 8;
  const hasMaxLength = passwordValue.length <= 16;
  const hasUpperCase = /[A-Z]/.test(passwordValue);
  const hasSpecialChar = /[!@#$&*]/.test(passwordValue);
  const hasNumber = /[0-9]/.test(passwordValue);

  if (user) {
    switch (user.role) {
      case 'SYSTEM_ADMIN':
        return <Navigate to="/admin" replace />;
      case 'STORE_OWNER':
        return <Navigate to="/owner/dashboard" replace />;
      case 'NORMAL_USER':
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }
  
  const onSubmit = async (data) => {
    setApiError(''); 
    
    
    const isValid = await trigger();
    if (!isValid) return;
    
    try {
      const result = await dispatch(signup(data));
      if (result.error) {
        setApiError(result.error.message || 'Registration failed');
      }
    } catch (error) {
      setApiError('An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white pt-20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-400 py-6 px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center text-white">Create Account</h2>
          <p className="mt-2 text-center text-blue-100">Join our community today</p>
        </div>
        
        <div className="py-8 px-6 sm:px-8">
          {(isError || apiError) && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <MdErrorOutline className="text-red-500 text-xl mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-800 font-medium">{apiError || message}</p>
                <p className="text-red-600 text-sm mt-1">Please check your information and try again.</p>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                {...register('name', { 
                  required: 'Name is required', 
                  minLength: { value: 2, message: 'Name must be at least 2 characters' }, 
                  maxLength: { value: 60, message: 'Name cannot exceed 60 characters' } 
                })}
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-colors ${
                  errors.name 
                    ? 'border-red-500 focus:ring-red-200' 
                    : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                }`}
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <MdErrorOutline className="text-base" />
                  {errors.name.message}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email', { 
                  required: 'Email is required', 
                  pattern: { 
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 
                    message: 'Please enter a valid email address' 
                  } 
                })}
                placeholder="Enter your email"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-colors ${
                  errors.email 
                    ? 'border-red-500 focus:ring-red-200' 
                    : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                }`}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <MdErrorOutline className="text-base" />
                  {errors.email.message}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                id="address"
                rows={3}
                autoComplete="street-address"
                {...register('address', { 
                  required: 'Address is required', 
                  maxLength: { 
                    value: 400, 
                    message: 'Address cannot exceed 400 characters' 
                  } 
                })}
                placeholder="Enter your full address"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-colors ${
                  errors.address 
                    ? 'border-red-500 focus:ring-red-200' 
                    : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                }`}
              />
              {errors.address && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <MdErrorOutline className="text-base" />
                  {errors.address.message}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('password', { 
                    required: 'Password is required',
                    validate: {
                      minLength: value => value.length >= 8 || 'Password must be at least 8 characters',
                      maxLength: value => value.length <= 16 || 'Password cannot exceed 16 characters',
                      hasUpperCase: value => /[A-Z]/.test(value) || 'Password must contain at least one uppercase letter',
                      hasSpecialChar: value => /[!@#$&*]/.test(value) || 'Password must contain at least one special character (!@#$&*)',
                      hasNumber: value => /[0-9]/.test(value) || 'Password must contain at least one number'
                    }
                  })}
                  placeholder="Create a secure password"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-colors ${
                    errors.password 
                      ? 'border-red-500 focus:ring-red-200' 
                      : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              
              {/* Password requirements */}
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Password must contain:</p>
                <ul className="space-y-1">
                  <li className={`flex items-center text-sm ${hasMinLength && hasMaxLength ? 'text-green-600' : 'text-gray-500'}`}>
                    {hasMinLength && hasMaxLength ? <MdCheckCircle className="mr-2" /> : <MdErrorOutline className="mr-2" />}
                    8-16 characters
                  </li>
                  <li className={`flex items-center text-sm ${hasUpperCase ? 'text-green-600' : 'text-gray-500'}`}>
                    {hasUpperCase ? <MdCheckCircle className="mr-2" /> : <MdErrorOutline className="mr-2" />}
                    At least one uppercase letter
                  </li>
                  <li className={`flex items-center text-sm ${hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                    {hasSpecialChar ? <MdCheckCircle className="mr-2" /> : <MdErrorOutline className="mr-2" />}
                    At least one special character (!@#$&*)
                  </li>
                  <li className={`flex items-center text-sm ${hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                    {hasNumber ? <MdCheckCircle className="mr-2" /> : <MdErrorOutline className="mr-2" />}
                    At least one number
                  </li>
                </ul>
              </div>
              
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <MdErrorOutline className="text-base" />
                  {errors.password.message}
                </p>
              )}
            </div>

            
            
            
            
            {errors.terms && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <MdErrorOutline className="text-base" />
                {errors.terms.message}
              </p>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-400  hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Creating Account...
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <Link 
                to="/login" 
                className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                Sign in to your account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;