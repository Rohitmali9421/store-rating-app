import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchStores } from '../features/stores/storeSlice.js';
import StoreCard from '../components/StoreCard.jsx';
import Pagination from '../components/admin/Pagination.jsx';
import { FaSearch, FaKey, FaStore, FaExclamationTriangle, FaSync } from 'react-icons/fa';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { stores, pagination, isLoading, isError, message } = useSelector((state) => state.stores);
  
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    setLocalLoading(true);
    const handler = setTimeout(() => {
      dispatch(fetchStores({ ...filters, page: currentPage, limit: 9 }))
        .finally(() => {
          setLocalLoading(false);
        });
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [filters, currentPage, dispatch]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleRetry = () => {
    dispatch(fetchStores({ ...filters, page: currentPage, limit: 9 }));
  };

  return (
    <div className="container mx-auto p-4 md:p-6 min-h-screen bg-white pt-20 md:pt-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 p-4 bg-white rounded-xl shadow-sm">
        <div className="mb-4 md:mb-0">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FaStore className="text-blue-500" />
            Registered Stores
          </h1>
          <p className="text-gray-600 mt-1">Browse and rate stores on the platform.</p>
        </div>
        <Link 
          to="/update-password" 
          className="bg-gray-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg"
        >
          <FaKey className="text-sm" /> 
          Update Password
        </Link>
      </div>

      {/* Search Filters */}
      <div className="mb-8 p-6 bg-white rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Search Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input 
              type="text"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              placeholder="Search by store name..."
              className="w-full pl-10 p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input 
              type="text"
              name="address"
              value={filters.address}
              onChange={handleFilterChange}
              placeholder="Search by address..."
              className="w-full pl-10 p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        {/* Loading State */}
        {(isLoading || localLoading) && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Loading stores...</p>
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-red-50 p-5 rounded-xl mb-5">
              <FaExclamationTriangle className="text-red-500 text-4xl mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Failed to Load Stores</h3>
            <p className="text-gray-600 mb-6 max-w-md">{message || 'An unexpected error occurred'}</p>
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 px-5 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
            >
              <FaSync /> Try Again
            </button>
          </div>
        )}

        {/* Success State */}
        {!isError && !isLoading && (
          <>
            {stores.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stores.map((store) => (
                    <StoreCard key={store.id} store={store} />
                  ))}
                </div>
                
                {/* Pagination */}
                {pagination && (
                  <div className="mt-10">
                    <Pagination
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      onPageChange={(page) => setCurrentPage(page)}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-gray-100 p-5 rounded-full mb-5">
                  <FaStore className="text-gray-400 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Stores Found</h3>
                <p className="text-gray-600 max-w-md">
                  {filters.name || filters.address 
                    ? "No stores match your search criteria. Try adjusting your filters."
                    : "There are no stores registered on the platform yet."}
                </p>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
};

export default DashboardPage;