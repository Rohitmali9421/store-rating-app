import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { updatePassword, clearAuthState } from '../features/auth/authSlice.js';
import { MdErrorOutline, MdCheckCircleOutline, MdLock } from "react-icons/md";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";

const UpdatePasswordPage = () => {
  const { register, handleSubmit, watch, reset, formState: { errors, isValid } } = useForm({
    mode: 'onChange'
  });
  const dispatch = useDispatch();
  const { user, isLoading, isError, message } = useSelector((state) => state.auth);

  const [visibility, setVisibility] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [passwordStrength, setPasswordStrength] = useState(0);

  const toggleVisibility = (field) => {
    setVisibility(prev => ({ ...prev, [field]: !prev[field] }));
  };

  useEffect(() => {
    // Calculate password strength
    const newPassword = watch('newPassword') || '';
    let strength = 0;
    
    if (newPassword.length >= 8) strength++;
    if (/[A-Z]/.test(newPassword)) strength++;
    if (/[!@#$&*]/.test(newPassword)) strength++;
    if (newPassword.length >= 12) strength++;
    
    setPasswordStrength(strength);
  }, [watch('newPassword')]);

  useEffect(() => {
    return () => { dispatch(clearAuthState()); };
  }, [dispatch]);

  const onSubmit = (data) => {
    dispatch(updatePassword({ 
      currentPassword: data.currentPassword, 
      newPassword: data.newPassword 
    })).unwrap()
    .then(() => { reset(); })
    .catch(() => {});
  };

  const isSuccess = !isError && message;
  const getDashboardLink = () => {
    switch (user?.role) {
      case 'SYSTEM_ADMIN': return '/admin';
      case 'STORE_OWNER': return '/owner/dashboard';
      case 'NORMAL_USER': return '/dashboard';
      default: return '/';
    }
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-200';
    if (passwordStrength === 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-orange-500';
    if (passwordStrength === 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength === 1) return 'Weak';
    if (passwordStrength === 2) return 'Fair';
    if (passwordStrength === 3) return 'Good';
    return 'Strong';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 pt-20">
      <div className="container max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <Link 
            to={getDashboardLink()} 
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Back to Dashboard
          </Link>
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdLock className="text-3xl text-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Update Password</h2>
            <p className="text-gray-600 mt-2">Secure your account with a new password</p>
          </div>
          
          {isError && message && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-start gap-3">
              <MdErrorOutline className="text-xl mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Error</p>
                <p className="text-sm mt-1">{message}</p>
              </div>
            </div>
          )}
          
          {isSuccess && (
            <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 flex items-start gap-3">
              <MdCheckCircleOutline className="text-xl mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium">Success!</p>
                <p className="text-sm mt-1">{message}</p>
                <Link 
                  to={getDashboardLink()} 
                  className="inline-block mt-3 text-green-800 font-medium hover:underline"
                >
                  Return to your Dashboard
                </Link>
              </div>
            </div>
          )}
          
          {!isSuccess && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Current Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input 
                    type={visibility.current ? 'text' : 'password'} 
                    {...register('currentPassword', { 
                      required: 'Current password is required' 
                    })} 
                    placeholder="Enter your current password" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all pr-12" 
                  />
                  <button 
                    type="button" 
                    onClick={() => toggleVisibility('current')} 
                    className="absolute inset-y-0 right-0 px-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {visibility.current ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                    <MdErrorOutline /> {errors.currentPassword.message}
                  </p>
                )}
              </div>
              
              {/* New Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input 
                    type={visibility.new ? 'text' : 'password'} 
                    {...register('newPassword', { 
                      required: 'New password is required', 
                      pattern: { 
                        value: /^(?=.*[A-Z])(?=.*[!@#$&*]).{8,16}$/, 
                        message: 'Password must be 8-16 characters with one uppercase and one special character' 
                      }
                    })} 
                    placeholder="Create a new password" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all pr-12" 
                  />
                  <button 
                    type="button" 
                    onClick={() => toggleVisibility('new')} 
                    className="absolute inset-y-0 right-0 px-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {visibility.new ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                
                {/* Password Strength Meter */}
                {watch('newPassword') && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">Password strength:</span>
                      <span className={`text-xs font-medium ${
                        passwordStrength < 2 ? 'text-red-600' : 
                        passwordStrength < 4 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 4) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {errors.newPassword && (
                  <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                    <MdErrorOutline /> {errors.newPassword.message}
                  </p>
                )}
              </div>
              
              {/* Confirm New Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input 
                    type={visibility.confirm ? 'text' : 'password'} 
                    {...register('confirmNewPassword', { 
                      required: 'Please confirm your new password',
                      validate: value => value === watch('newPassword') || 'Passwords do not match'
                    })} 
                    placeholder="Confirm your new password" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all pr-12" 
                  />
                  <button 
                    type="button" 
                    onClick={() => toggleVisibility('confirm')} 
                    className="absolute inset-y-0 right-0 px-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {visibility.confirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmNewPassword && (
                  <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                    <MdErrorOutline /> {errors.confirmNewPassword.message}
                  </p>
                )}
              </div>
              
              <button 
                type="submit" 
                disabled={isLoading || !isValid}
                className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating Password...
                  </span>
                ) : 'Update Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdatePasswordPage;