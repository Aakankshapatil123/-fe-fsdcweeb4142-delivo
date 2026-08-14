import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";

import { logout } from "../redux/authSlice";
import { logoutUser } from "../services/authServices";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleLogout = async () => {
    try {
      await logoutUser();

      // Clear Redux user
      dispatch(logout());

      toast.success("Logout successful!");

      // Go to login page
      navigate("/login");
    } catch (error) {
      console.log(
        "LOGOUT ERROR:",
        error.response?.data?.message
      );

      toast.error(
        error.response?.data?.message || "Logout failed"
      );
    }
  };

  return (
    <nav className="w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="flex w-full items-center justify-between px-6 py-4 md:px-10">

        {/* Logo */}
        <Link to="/" className="flex items-center">
          <div className="flex h-11 w-24 items-center justify-center rounded-lg bg-orange-600">
            <span className="text-xl font-bold text-white md:text-2xl">
              Delivo
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex lg:gap-8">

          {/* Home */}
          <Link
            to="/"
            className="font-medium text-gray-700 transition hover:text-blue-600"
          >
            Home
          </Link>

          {/* Restaurants */}
          <Link
            to="/restaurants"
            className="font-medium text-gray-700 transition hover:text-blue-600"
          >
            Restaurants
          </Link>

          {/* Favorites */}
          <Link
            to="/favorites"
            className="font-medium text-gray-700 transition hover:text-blue-600"
          >
            Favorites
          </Link>

          {/* Orders */}
          <Link
            to="/orders"
            className="font-medium text-gray-700 transition hover:text-blue-600"
          >
            Orders
          </Link>

          {/* Notifications - Only for User */}
          {isAuthenticated && user?.role === "user" && (
            <Link
              to="/notifications"
              className="font-medium text-gray-700 transition hover:text-blue-600"
            >
              🔔 Notifications
            </Link>
          )}

          {/* Cart */}
          <Link
            to="/cart"
            className="font-medium text-gray-700 transition hover:text-blue-600"
          >
            🛒 Cart
          </Link>

          {/* When user is NOT logged in */}
          {!isAuthenticated && (
            <>
              {/* Login */}
              <Link
                to="/login"
                className="font-medium text-gray-700 transition hover:text-blue-600"
              >
                Login
              </Link>

              {/* Register */}
              <Link
                to="/register"
                className="font-medium text-gray-700 transition hover:text-blue-600"
              >
                Register
              </Link>
            </>
          )}

          {/* When user IS logged in */}
          {isAuthenticated && user && (
            <>
              {/* Profile */}
              <Link
                to="/profile"
                className="font-medium text-gray-700 transition hover:text-blue-600"
              >
                Profile
              </Link>

              {/* Restaurant Dashboard */}
              {user?.role === "restaurant" && (
                <Link
                  to="/restaurant/dashboard"
                  className="font-medium text-gray-700 transition hover:text-blue-600"
                >
                  Dashboard
                </Link>
              )}

              {/* Admin Dashboard */}
              {user?.role === "admin" && (
                <Link
                  to="/admin/dashboard"
                  className="font-medium text-gray-700 transition hover:text-blue-600"
                >
                  Dashboard
                </Link>
              )}

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="rounded-lg bg-orange-500 px-5 py-2 font-semibold text-white shadow-sm transition hover:bg-orange-600 active:scale-95"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="rounded-md p-2 text-2xl text-gray-700 transition hover:bg-gray-100 hover:text-blue-600 md:hidden"
          aria-label="Open menu"
        >
          ☰
        </button>

      </div>
    </nav>
  );
};

export default Navbar;