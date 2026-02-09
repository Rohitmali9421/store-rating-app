// src/components/admin/DashboardStats.jsx
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDashboardStats } from '../../features/admin/adminSlice';
import { FaUsers, FaStore, FaStar, FaExclamationTriangle, FaSync } from 'react-icons/fa';

const StatCard = ({ icon, title, value, color, isLoading }) => (
  <div className={`p-6 rounded-xl shadow-lg text-white ${color} transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
    <div className="flex items-center gap-4">
      <div className="text-4xl opacity-90">{icon}</div>
      <div className="flex-1">
        {isLoading ? (
          <div className="h-12 w-24 bg-white/20 rounded-lg animate-pulse"></div>
        ) : (
          <div className="text-4xl font-bold">{value}</div>
        )}
        <div className="text-lg opacity-90 mt-1">{title}</div>
      </div>
    </div>
  </div>
);

const DashboardStats = () => {
  const dispatch = useDispatch();
  const { stats, isLoading, error } = useSelector((state) => state.admin);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch, retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Dashboard Overview</h1>
        <button
          onClick={handleRetry}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg  disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <FaSync className={isLoading ? "animate-spin" : ""} />
          {isLoading ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <FaExclamationTriangle className="text-red-500 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-red-800">Failed to load dashboard statistics</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <button 
              onClick={handleRetry}
              className="mt-2 text-sm font-medium text-red-700 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          icon={<FaUsers />} 
          title="Total Users" 
          value={stats?.users || 0} 
          color="bg-gradient-to-br from-blue-500 to-blue-600" 
          isLoading={isLoading}
        />
        <StatCard 
          icon={<FaStore />} 
          title="Total Stores" 
          value={stats?.stores || 0} 
          color="bg-gradient-to-br from-green-500 to-green-600" 
          isLoading={isLoading}
        />
        <StatCard 
          icon={<FaStar />} 
          title="Total Ratings" 
          value={stats?.ratings || 0} 
          color="bg-gradient-to-br from-amber-500 to-amber-600" 
          isLoading={isLoading}
        />
      </div>

    </div>
  );
};

export default DashboardStats;