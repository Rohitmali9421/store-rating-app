import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllUsers, addNewUser } from '../../features/admin/adminSlice';
import { useForm } from 'react-hook-form';
import { FaPlus, FaStar, FaArrowUp, FaArrowDown, FaExclamationTriangle, FaSync, FaSort, FaSmile, FaKey, FaUsers } from 'react-icons/fa';
import Pagination from './Pagination';

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, pagination, isLoading, isError, message } = useSelector((state) => state.admin);
  
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [retryCount, setRetryCount] = useState(0);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const debouncedFetch = setTimeout(() => {
      const params = {
        ...filters,
        page: currentPage,
        limit: 10,
        sortBy: sortConfig.key,
        order: sortConfig.direction,
      };
      dispatch(fetchAllUsers(params));
    }, 500);
    return () => clearTimeout(debouncedFetch);
  }, [dispatch, filters, currentPage, sortConfig, retryCount]);
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="inline ml-1 text-xs text-gray-400" />;
    return sortConfig.direction === 'asc' 
      ? <FaArrowUp className="inline ml-1 text-xs text-blue-500" /> 
      : <FaArrowDown className="inline ml-1 text-xs text-blue-500" />;
  };

  const onUserSubmit = (data) => {
    dispatch(addNewUser(data)).unwrap()
      .then(() => {
        reset();
        setShowForm(false);
      })
      .catch(() => {});
  };

  const clearFilters = () => {
    setFilters({ name: '', email: '', address: '', role: '' });
    setCurrentPage(1);
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  // Loading state with skeleton screens
  if (isLoading && users.length === 0) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <div className="animate-pulse">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-48 mt-4 md:mt-0"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
          
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="p-4 border-b border-gray-100 grid grid-cols-5 gap-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 border-b border-gray-100 grid grid-cols-5 gap-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError && users.length === 0) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <div className="bg-red-50 p-6 rounded-lg max-w-md w-full">
            <div className="flex justify-center mb-4">
              <FaExclamationTriangle className="text-red-500 text-4xl" />
            </div>
            <h2 className="text-xl font-bold text-red-800 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">{message || 'Failed to load users data'}</p>
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

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-900 transition-colors shadow-md"
        >
          <FaPlus /> {showForm ? 'Cancel' : 'Add User'}
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-6 bg-white rounded-xl shadow-md border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Add New User</h2>
          {isError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center gap-2">
              <FaExclamationTriangle /> {message}
            </div>
          )}
          <form onSubmit={handleSubmit(onUserSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input 
                      {...register('name', { required: 'Name is required' })} 
                      placeholder="Full Name" 
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><FaExclamationTriangle className="text-xs" /> {errors.name.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address"
                        }
                      })} 
                      placeholder="Email" 
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><FaExclamationTriangle className="text-xs" /> {errors.email.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input 
                      type="password" 
                      {...register('password', { 
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters"
                        }
                      })} 
                      placeholder="Password" 
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><FaExclamationTriangle className="text-xs" /> {errors.password.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input 
                      {...register('address', { required: 'Address is required' })} 
                      placeholder="Address" 
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><FaExclamationTriangle className="text-xs" /> {errors.address.message}</p>}
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select 
                      {...register('role', { required: 'Role is required' })} 
                      className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      defaultValue=""
                    >
                        <option value="" disabled>Select a Role</option>
                        <option value="NORMAL_USER">Normal User</option>
                        <option value="SYSTEM_ADMIN">System Admin</option>
                    </select>
                    {errors.role && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><FaExclamationTriangle className="text-xs" /> {errors.role.message}</p>}
                </div>
            </div>
            <div className="flex justify-end">
              <button 
                type="submit" 
                disabled={isLoading} 
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:bg-green-300 transition-colors shadow-md flex items-center gap-2"
              >
                {isLoading ? 'Saving...' : 'Save User'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters Section */}
      <div className="mb-6 p-6 bg-white rounded-xl shadow-md border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Filters</h3>
          <button 
            onClick={clearFilters}
            className="text-sm text-blue-500 hover:text-blue-700 flex items-center gap-1"
          >
            Clear all filters
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input 
              type="text" 
              name="name" 
              value={filters.name} 
              onChange={handleFilterChange} 
              placeholder="Filter by name..." 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="text" 
              name="email" 
              value={filters.email} 
              onChange={handleFilterChange} 
              placeholder="Filter by email..." 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input 
              type="text" 
              name="address" 
              value={filters.address} 
              onChange={handleFilterChange} 
              placeholder="Filter by address..." 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select 
              name="role" 
              value={filters.role} 
              onChange={handleFilterChange} 
              className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
                <option value="">All Roles</option>
                <option value="NORMAL_USER">Normal User</option>
                <option value="SYSTEM_ADMIN">System Admin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      {users.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <FaUsers className="text-blue-500 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Users Found</h3>
            <p className="text-gray-600 mb-6 max-w-md">
              {Object.values(filters).some(val => val !== '') 
                ? 'Try adjusting your filters to find what you are looking for.' 
                : 'There are no users in the system yet.'}
            </p>
            {Object.values(filters).some(val => val !== '') && (
              <button
                onClick={clearFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Users</h3>
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
                        Name 
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
                        Email 
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
                        Address 
                        <span className="transition-transform group-hover:scale-110">
                          {getSortIcon('address')}
                        </span>
                      </button>
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-600 text-sm uppercase">
                      <button 
                        onClick={() => requestSort('role')} 
                        className="flex items-center gap-1 font-medium hover:text-gray-800 transition-colors group"
                      >
                        Role 
                        <span className="transition-transform group-hover:scale-110">
                          {getSortIcon('role')}
                        </span>
                      </button>
                    </th>
                    <th className="p-4 text-center font-semibold text-gray-600 text-sm uppercase">
                      Store Rating
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user, index) => (
                    <tr 
                      key={user.id} 
                      className={`transition-colors group ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-blue-50`}
                    >
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold mr-3 group-hover:bg-indigo-200 transition-colors">
                            {user.name.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-800">{user.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">
                        <div className="max-w-[200px] truncate" title={user.email}>
                          {user.email}
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">
                        <div className="max-w-[200px] truncate" title={user.address}>
                          {user.address || 'Not provided'}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 text-xs rounded-full font-medium
                          ${user.role === 'SYSTEM_ADMIN' ? 'bg-purple-100 text-purple-800' : 
                            user.role === 'STORE_OWNER' ? 'bg-blue-100 text-blue-800' : 
                            'bg-gray-100 text-gray-800'}`}
                        >
                          {user.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center">
                          {user.role === 'STORE_OWNER' ? ( 
                            <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full flex items-center gap-1">
                              <span className="font-bold">{user.storeAverageRating || 'N/A'}</span>
                              <FaStar className="text-amber-400" />
                            </div>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
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
                Showing {users.length} of {pagination?.totalItems || 0} users
              </div>
            </div>
          </div>
          
          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default UserManagement;