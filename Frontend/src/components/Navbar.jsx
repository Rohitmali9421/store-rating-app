import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice.js';
import { FaSignOutAlt, FaStore, FaUserShield, FaUser } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white text-black p-4 border-b fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold flex items-center gap-2">
          <FaStore /> StoreRater
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {user.role === 'SYSTEM_ADMIN' && (
                <Link className="flex items-center gap-2" to="/admin">
                  <FaUserShield /> Admin
                </Link>
              )}
              {user.role === 'NORMAL_USER' && (
                <Link className="flex items-center gap-2" to="/dashboard">
                  <FaUser /> Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 hover:text-red-400"
              >
                <FaSignOutAlt /> Logout
              </button>
            </>
          ) : (
            <div className="space-x-4">
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
