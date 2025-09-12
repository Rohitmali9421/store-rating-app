// src/pages/AdminDashboard.jsx
import { NavLink, Outlet } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaStore } from 'react-icons/fa';

const AdminDashboard = () => {
  const linkClasses =
    "flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-200";
  const activeLinkClasses = "bg-black text-white hover:bg-gray-600";

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white pt-10">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white p-4 shadow-md md:fixed md:top-14 md:left-0 md:h-screen  ">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Admin Panel</h2>
        <nav className="flex flex-row md:flex-col gap-2">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses
            }
          >
            <FaTachometerAlt /> Dashboard
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses
            }
          >
            <FaUsers /> Users
          </NavLink>
          <NavLink
            to="/admin/stores"
            className={({ isActive }) =>
              isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses
            }
          >
            <FaStore /> Stores
          </NavLink>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 md:ml-64">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
