import { Link } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';

const UnauthorizedPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-10 text-center max-w-md w-full animate-fadeIn">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 text-red-600 w-16 h-16 flex items-center justify-center rounded-full">
            <FaLock className="text-3xl" />
          </div>
        </div>
        <h1 className="text-3xl font-extrabold text-red-500">Access Denied</h1>
        <p className="text-gray-600 mt-3 text-base">
          You do not have permission to view this page.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2.5 rounded-lg font-medium shadow hover:from-blue-600 hover:to-blue-700 transition-transform hover:scale-105"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
