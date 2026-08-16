import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";

import { logout } from "../redux/authSlice";
import { logoutUser } from "../services/authServices";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Mobile menu state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close mobile menu
  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Logout
  const handleLogout = async () => {
    try {
      await logoutUser();

      dispatch(logout());

      closeMobileMenu();

      toast.success("Logout successful!");

      navigate("/login");
    } catch (error) {
      console.log(
        "LOGOUT ERROR:",
        error.response?.data?.message || error.message,
      );

      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <nav className="w-full border-b border-gray-200 bg-white shadow-sm">
      {/* =====================================================
          NAVBAR TOP
      ====================================================== */}
      <div className="flex w-full items-center justify-between px-4 py-3 sm:px-6 md:px-10 md:py-4">
        {/* ===================================================
            LOGO
        ==================================================== */}
        <Link to="/" onClick={closeMobileMenu} className="flex items-center">
          <div className="flex h-11 w-24 items-center justify-center rounded-lg bg-orange-600">
            <span className="text-xl font-bold text-white md:text-2xl">
              Delivo
            </span>
          </div>
        </Link>

        {/* ===================================================
            DESKTOP NAVIGATION
        ==================================================== */}
        <div className="hidden items-center gap-5 md:flex lg:gap-7">
          {/* Home */}
          <Link
            to="/"
            className="font-medium text-gray-700 transition hover:text-orange-600"
          >
            Home
          </Link>

          {/* Restaurants */}
          <Link
            to="/restaurants"
            className="font-medium text-gray-700 transition hover:text-orange-600"
          >
            Restaurants
          </Link>

          {/* Favorites */}
          <Link
            to="/favorites"
            className="font-medium text-gray-700 transition hover:text-orange-600"
          >
            Favorites
          </Link>

          {/* Orders */}
          <Link
            to="/orders"
            className="font-medium text-gray-700 transition hover:text-orange-600"
          >
            Orders
          </Link>

          {/* Notifications */}
          {isAuthenticated && user?.role === "user" && (
            <Link
              to="/notifications"
              className="font-medium text-gray-700 transition hover:text-orange-600"
            >
              🔔 Notifications
            </Link>
          )}

          {/* Cart */}
          <Link
            to="/cart"
            className="font-medium text-gray-700 transition hover:text-orange-600"
          >
            🛒 Cart
          </Link>

          {/* =================================================
              USER NOT LOGGED IN
          ================================================== */}
          {!isAuthenticated && (
            <>
              {/* Login */}
              <Link
                to="/login"
                className="font-medium text-gray-700 transition hover:text-orange-600"
              >
                Login
              </Link>

              {/* Register */}
              <Link
                to="/register"
                className="font-medium text-gray-700 transition hover:text-orange-600"
              >
                Register
              </Link>
            </>
          )}

          {/* =================================================
              USER LOGGED IN
          ================================================== */}
          {isAuthenticated && user && (
            <>
              {/* Profile */}
              <Link
                to="/profile"
                className="font-medium text-gray-700 transition hover:text-orange-600"
              >
                Profile
              </Link>

              {/* Restaurant Dashboard */}
              {user.role === "restaurant" && (
                <Link
                  to="/restaurant/dashboard"
                  className="font-medium text-gray-700 transition hover:text-orange-600"
                >
                  Dashboard
                </Link>
              )}

              {/* Admin Dashboard */}
              {user.role === "admin" && (
                <Link
                  to="/admin/dashboard"
                  className="font-medium text-gray-700 transition hover:text-orange-600"
                >
                  Dashboard
                </Link>
              )}

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-orange-500 px-5 py-2 font-semibold text-white shadow-sm transition hover:bg-orange-600 active:scale-95"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* ===================================================
            MOBILE MENU BUTTON
        ==================================================== */}
        <button
          type="button"
          onClick={toggleMobileMenu}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-2xl text-gray-700 transition hover:bg-orange-50 hover:text-orange-600 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* =====================================================
          MOBILE NAVIGATION
      ====================================================== */}
      {isMenuOpen && (
        <div className="border-t border-gray-200 bg-white shadow-md md:hidden">
          <div className="flex flex-col px-4 py-3 sm:px-6">
            {/* Home */}
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="rounded-lg px-4 py-3 font-medium text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
            >
              Home
            </Link>

            {/* Restaurants */}
            <Link
              to="/restaurants"
              onClick={closeMobileMenu}
              className="rounded-lg px-4 py-3 font-medium text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
            >
              Restaurants
            </Link>

            {/* Favorites */}
            <Link
              to="/favorites"
              onClick={closeMobileMenu}
              className="rounded-lg px-4 py-3 font-medium text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
            >
              Favorites
            </Link>

            {/* Orders */}
            <Link
              to="/orders"
              onClick={closeMobileMenu}
              className="rounded-lg px-4 py-3 font-medium text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
            >
              Orders
            </Link>

            {/* Notifications */}
            {isAuthenticated && user?.role === "user" && (
              <Link
                to="/notifications"
                onClick={closeMobileMenu}
                className="rounded-lg px-4 py-3 font-medium text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
              >
                🔔 Notifications
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              onClick={closeMobileMenu}
              className="rounded-lg px-4 py-3 font-medium text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
            >
              🛒 Cart
            </Link>

            {/* =================================================
                NOT LOGGED IN
            ================================================== */}
            {!isAuthenticated && (
              <>
                {/* Login */}
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="rounded-lg px-4 py-3 font-medium text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
                >
                  Login
                </Link>

                {/* Register */}
                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="rounded-lg px-4 py-3 font-medium text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
                >
                  Register
                </Link>
              </>
            )}

            {/* =================================================
                LOGGED IN
            ================================================== */}
            {isAuthenticated && user && (
              <>
                {/* Profile */}
                <Link
                  to="/profile"
                  onClick={closeMobileMenu}
                  className="rounded-lg px-4 py-3 font-medium text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
                >
                  Profile
                </Link>

                {/* Restaurant Dashboard */}
                {user.role === "restaurant" && (
                  <Link
                    to="/restaurant/dashboard"
                    onClick={closeMobileMenu}
                    className="rounded-lg px-4 py-3 font-medium text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
                  >
                    Dashboard
                  </Link>
                )}

                {/* Admin Dashboard */}
                {user.role === "admin" && (
                  <Link
                    to="/admin/dashboard"
                    onClick={closeMobileMenu}
                    className="rounded-lg px-4 py-3 font-medium text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
                  >
                    Dashboard
                  </Link>
                )}

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-2 rounded-lg bg-orange-500 px-4 py-3 font-semibold text-white transition hover:bg-orange-600 active:scale-95"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
