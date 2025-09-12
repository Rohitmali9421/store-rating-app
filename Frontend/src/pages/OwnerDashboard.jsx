import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchOwnerDashboard } from '../features/stores/storeSlice';
import { FaStar, FaUsers, FaKey, FaArrowUp, FaArrowDown, FaExclamationTriangle, FaSync, FaSort, FaSmile } from 'react-icons/fa';
import Pagination from '../components/admin/Pagination';

const OwnerDashboard = () => {
  const dispatch = useDispatch();
  const { dashboardData, isLoading, isError, message } = useSelector((state) => state.stores);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const params = {
        page: currentPage,
        limit: 10,
        sortBy: sortConfig.key,
        order: sortConfig.direction
    };
    dispatch(fetchOwnerDashboard(params));
  }, [dispatch, currentPage, sortConfig, retryCount]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };
  
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="inline ml-1 text-xs text-gray-400" />;
    return sortConfig.direction === 'asc' 
      ? <FaArrowUp className="inline ml-1 text-xs text-blue-500" /> 
      : <FaArrowDown className="inline ml-1 text-xs text-blue-500" />;
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  // Loading state with skeleton screens
  if (isLoading && !dashboardData) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <div className="animate-pulse">
          <div className="flex flex-wrap justify-between items-center mb-6">
            <div>
              <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-48"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-48 mt-4 md:mt-0"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-200 h-32 rounded-lg"></div>
            <div className="bg-gray-200 h-32 rounded-lg"></div>
          </div>
          
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 border-b border-gray-100">
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <div className="bg-red-50 p-6 rounded-lg max-w-md w-full">
            <div className="flex justify-center mb-4">
              <FaExclamationTriangle className="text-red-500 text-4xl" />
            </div>
            <h2 className="text-xl font-bold text-red-800 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">{message || 'Failed to load dashboard data'}</p>
            <button
              onClick={handleRetry}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2"
            >
              <FaSync /> Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!dashboardData) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <div className="bg-blue-50 p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold text-blue-800 mb-2">No Data Available</h2>
            <p className="text-gray-600 mb-4">Your store doesn't have any ratings yet.</p>
            <Link
              to="/promote-store"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg inline-block"
            >
              Promote Your Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { storeName, averageRating, ratings } = dashboardData;
  const { data: usersWhoRated, pagination } = ratings;

  return (
    <div className="container mx-auto p-4 md:p-6 pt-20 md:pt-20">
      {/* Header Section */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Store Dashboard</h1>
          <h2 className="text-xl font-semibold text-gray-600 mt-1">{storeName}</h2>
        </div>
        <Link 
          to="/update-password" 
          className="mt-4 md:mt-0 bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-900 transition-colors shadow-md"
        >
          <FaKey className="text-sm" /> Update Password
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full">
              <FaStar className="text-2xl" />
            </div>
            <div>
              <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
              <div className="text-lg opacity-90">Average Rating</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full">
              <FaUsers className="text-2xl" />
            </div>
            <div>
              <div className="text-4xl font-bold">{pagination.totalItems}</div>
              <div className="text-lg opacity-90">Total Ratings</div>
            </div>
          </div>
        </div>
      </div>

      {/* Ratings Section - Only show table if there are ratings */}
      {usersWhoRated.length > 0 ? (
        <>
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Ratings Received</h3>
              {isLoading && (
                <div className="flex items-center text-sm text-gray-500">
                  <FaSync className="animate-spin mr-2" /> Updating...
                </div>
              )}
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left font-semibold text-gray-600 text-sm uppercase">
                      <button 
                        onClick={() => requestSort('name')} 
                        className="flex items-center gap-1 font-medium hover:text-gray-800 transition-colors group"
                      >
                        User Name 
                        <span className="transition-transform group-hover:scale-110">
                          {getSortIcon('name')}
                        </span>
                      </button>
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-600 text-sm uppercase">
                      <button 
                        onClick={() => requestSort('email')} 
                        className="flex items-center gap-1 font-medium hover:text-gray-800 transition-colors group"
                      >
                        User Email 
                        <span className="transition-transform group-hover:scale-110">
                          {getSortIcon('email')}
                        </span>
                      </button>
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-600 text-sm uppercase">
                      <button 
                        onClick={() => requestSort('address')} 
                        className="flex items-center gap-1 font-medium hover:text-gray-800 transition-colors group"
                      >
                        User Address 
                        <span className="transition-transform group-hover:scale-110">
                          {getSortIcon('address')}
                        </span>
                      </button>
                    </th>
                    <th className="p-4 text-center font-semibold text-gray-600 text-sm uppercase">
                      <button 
                        onClick={() => requestSort('rating')} 
                        className="flex items-center gap-1 font-medium hover:text-gray-800 transition-colors justify-center group mx-auto"
                      >
                        Rating 
                        <span className="transition-transform group-hover:scale-110">
                          {getSortIcon('rating')}
                        </span>
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {usersWhoRated.map((rating, index) => (
                    <tr 
                      key={index} 
                      className={`transition-colors group ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-blue-50`}
                    >
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold mr-3 group-hover:bg-indigo-200 transition-colors">
                            {rating.name.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-800">{rating.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">
                        <div className="max-w-[200px] truncate" title={rating.email}>
                          {rating.email}
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">
                        <div className="max-w-[200px] truncate" title={rating.address}>
                          {rating.address || 'Not provided'}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center">
                          <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full flex items-center gap-1">
                            <span className="font-bold">{rating.rating}</span>
                            <FaStar className="text-amber-400" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Table Footer with Sorting Indicator */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 text-sm text-gray-500 flex justify-between items-center">
              <div>
                {sortConfig.key && (
                  <span>
                    Sorted by {sortConfig.key} ({sortConfig.direction === 'asc' ? 'ascending' : 'descending'})
                  </span>
                )}
              </div>
              <div>
                Showing {usersWhoRated.length} of {pagination.totalItems} ratings
              </div>
            </div>
          </div>
          
          {/* Pagination */}
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            alwaysShow={true}
          />
        </>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <FaSmile className="text-amber-500 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Ratings Yet</h3>
            <p className="text-gray-600 mb-6 max-w-md">
              Your store hasn't received any ratings yet. Share your store with customers to start receiving feedback!
            </p>
           
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;