// src/components/admin/StoreManagement.js

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllStores, addNewStore } from '../../features/admin/adminSlice';
import { useForm } from 'react-hook-form';
import { FaPlus, FaStar, FaArrowUp, FaArrowDown, FaExclamationTriangle, FaSync, FaSort, FaEye, FaEyeSlash, FaStore } from 'react-icons/fa';
import Pagination from './Pagination';
import TableSkeleton from './TableSkeleton'; // MODIFIED: Import the new skeleton component

const StoreManagement = () => {
    const dispatch = useDispatch();
    const { stores, storePagination, isLoading, isError, message } = useSelector((state) => state.admin);

    const [showForm, setShowForm] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [filters, setFilters] = useState({ name: '', email: '', address: '' });
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
            dispatch(fetchAllStores(params));
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

    const onStoreSubmit = (data) => {
        dispatch(addNewStore(data)).unwrap()
            .then(() => {
                reset();
                setShowForm(false);
            })
            .catch(() => { });
    };

    const clearFilters = () => {
        setFilters({ name: '', email: '', address: '' });
        setCurrentPage(1);
    };

    const handleRetry = () => {
        setRetryCount(prev => prev + 1);
    };

    // This handles the very first load when the `stores` array is empty.
    if (isLoading && stores.length === 0) {
        return (
            <div className="container mx-auto p-4 md:p-6">
                <div className="animate-pulse">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div><div className="h-8 bg-gray-200 rounded w-64 mb-2"></div></div>
                        <div className="h-10 bg-gray-200 rounded w-48 mt-4 md:mt-0"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="h-12 bg-gray-200 rounded"></div>
                        <div className="h-12 bg-gray-200 rounded"></div>
                        <div className="h-12 bg-gray-200 rounded"></div>
                    </div>
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <div className="p-4 border-b border-gray-100 grid grid-cols-4 gap-4">
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded"></div>
                        </div>
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="p-4 border-b border-gray-100 grid grid-cols-4 gap-4">
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

    if (isError && stores.length === 0) {
        return (
            <div className="container mx-auto p-4 md:p-6">
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                    <div className="bg-red-50 p-6 rounded-lg max-w-md w-full">
                        <div className="flex justify-center mb-4"><FaExclamationTriangle className="text-red-500 text-4xl" /></div>
                        <h2 className="text-xl font-bold text-red-800 mb-2">Something went wrong</h2>
                        <p className="text-gray-600 mb-4">{message || 'Failed to load stores data'}</p>
                        <button onClick={handleRetry} className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2">
                            <FaSync /> Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div><h1 className="text-3xl font-bold text-gray-800">Store Management</h1></div>
                <button onClick={() => setShowForm(!showForm)} className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-900 transition-colors shadow-md">
                    <FaPlus /> {showForm ? 'Cancel' : 'Add Store'}
                </button>
            </div>

            {showForm && (
                <div className="mb-6 p-6 bg-white rounded-xl shadow-md border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Store & Owner</h2>
                    {isError && message && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center gap-2">
                            <FaExclamationTriangle /> {message}
                        </div>
                    )}
                    <form onSubmit={handleSubmit(onStoreSubmit)} className="space-y-4">
                        <h3 className="font-bold text-gray-600 border-b pb-2">Store Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                                <input {...register('storeName', { required: 'Store name is required' })} placeholder="Store Name" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                {errors.storeName && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><FaExclamationTriangle className="text-xs" /> {errors.storeName.message}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Store Address</label>
                                <input {...register('storeAddress', { required: 'Store address is required', maxLength: { value: 400, message: 'Max 400 characters' } })} placeholder="Store Address" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                {errors.storeAddress && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><FaExclamationTriangle className="text-xs" /> {errors.storeAddress.message}</p>}
                            </div>
                        </div>

                        <h3 className="font-bold text-gray-600 border-b pb-2 mt-4">New Store Owner Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Owner's Full Name</label>
                                <input {...register('ownerName', { required: "Owner's name is required", minLength: { value: 2, message: 'Min 2 characters' }, maxLength: { value: 60, message: 'Max 60 characters' } })} placeholder="Owner's Full Name" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                {errors.ownerName && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><FaExclamationTriangle className="text-xs" /> {errors.ownerName.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input {...register('email', { required: 'A valid email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })} placeholder="Store & Owner Email" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                {errors.email && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><FaExclamationTriangle className="text-xs" /> {errors.email.message}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Owner's Address</label>
                                <input {...register('ownerAddress', { required: "Owner's address is required", maxLength: { value: 400, message: 'Max 400 characters' } })} placeholder="Owner's Address" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                {errors.ownerAddress && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><FaExclamationTriangle className="text-xs" /> {errors.ownerAddress.message}</p>}
                            </div>
                            <div className="relative md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                    <input type={showPassword ? 'text' : 'password'} {...register('password', { required: 'Owner password is required', pattern: { value: /^(?=.*[A-Z])(?=.*[!@#$&*]).{8,16}$/, message: '8-16 chars, 1 uppercase, 1 special char' } })} placeholder="New Owner's Password" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500">
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><FaExclamationTriangle className="text-xs" /> {errors.password.message}</p>}
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:bg-green-300 transition-colors shadow-md flex items-center gap-2">
                                {isLoading ? 'Creating...' : 'Create Store & Owner'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="mb-6 p-6 bg-white rounded-xl shadow-md border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800">Filters</h3>
                    <button onClick={clearFilters} className="text-sm text-blue-500 hover:text-blue-700 flex items-center gap-1">Clear all filters</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input type="text" name="name" value={filters.name} onChange={handleFilterChange} placeholder="Filter by name..." className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="text" name="email" value={filters.email} onChange={handleFilterChange} placeholder="Filter by email..." className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input type="text" name="address" value={filters.address} onChange={handleFilterChange} placeholder="Filter by address..." className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                </div>
            </div>

            {/* Conditionally render "No Stores" message only if not loading and stores are empty */ }
            {!isLoading && stores.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <div className="flex flex-col items-center justify-center py-10">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4"><FaStore className="text-blue-500 text-2xl" /></div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No Stores Found</h3>
                        <p className="text-gray-600 mb-6 max-w-md">
                            {Object.values(filters).some(val => val !== '') ? 'Try adjusting your filters to find what you are looking for.' : 'There are no stores in the system yet.'}
                        </p>
                        {Object.values(filters).some(val => val !== '') && (
                            <button onClick={clearFilters} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg">Clear Filters</button>
                        )}
                    </div>
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-800">Stores</h3>
                            {isLoading && (<div className="flex items-center text-sm text-gray-500"><FaSync className="animate-spin mr-2" /> Updating...</div>)}
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="p-4 text-left font-semibold text-gray-600 text-sm uppercase"><button onClick={() => requestSort('name')} className="flex items-center gap-1 font-medium hover:text-gray-800 transition-colors group">Name <span className="transition-transform group-hover:scale-110">{getSortIcon('name')}</span></button></th>
                                        <th className="p-4 text-left font-semibold text-gray-600 text-sm uppercase"><button onClick={() => requestSort('email')} className="flex items-center gap-1 font-medium hover:text-gray-800 transition-colors group">Email <span className="transition-transform group-hover:scale-110">{getSortIcon('email')}</span></button></th>
                                        <th className="p-4 text-left font-semibold text-gray-600 text-sm uppercase">Address</th>
                                        <th className="p-4 text-center font-semibold text-gray-600 text-sm uppercase">Avg. Rating</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {/* MODIFIED: Show skeleton on load, otherwise show data */ }
                                    {isLoading ? (
                                        <TableSkeleton rows={10} cols={4} />
                                    ) : (
                                        stores.map((store, index) => (
                                            <tr key={store.id} className={`transition-colors group ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}>
                                                <td className="p-4">
                                                    <div className="flex items-center">
                                                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold mr-3 group-hover:bg-indigo-200 transition-colors">{store.name.charAt(0)}</div>
                                                        <span className="font-medium text-gray-800">{store.name}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-gray-600"><div className="max-w-[200px] truncate" title={store.email}>{store.email}</div></td>
                                                <td className="p-4 text-gray-600"><div className="max-w-[200px] truncate" title={store.address}>{store.address}</div></td>
                                                <td className="p-4">
                                                    <div className="flex items-center justify-center">
                                                        <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full flex items-center gap-1">
                                                            <span className="font-bold">{store.rating || 'N/A'}</span>
                                                            <FaStar className="text-amber-400" />
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 text-sm text-gray-500 flex justify-between items-center">
                            <div>{sortConfig.key && (<span>Sorted by {sortConfig.key} ({sortConfig.direction === 'asc' ? 'ascending' : 'descending'})</span>)}</div>
                            <div>
                                Showing {isLoading ? '...' : stores.length} of {storePagination?.totalItems || 0} stores
                            </div>
                        </div>
                    </div>

                    {storePagination  && (
                        <Pagination
                            currentPage={storePagination.currentPage}
                            totalPages={storePagination.totalPages}
                            onPageChange={(page) => setCurrentPage(page)}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default StoreManagement;