import { Navigate, Outlet, useLocation } from "react-router";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const {
    user,
    isAuthenticated,
    loading,
  } = useSelector((state) => state.auth);

  const location = useLocation();

  // Wait for authentication check
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-semibold text-gray-700">
          Loading...
        </p>
      </div>
    );
  }

  // User is not logged in
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Admin dashboard protection
  if (
    location.pathname.startsWith("/admin") &&
    user.role !== "admin"
  ) {
    return <Navigate to="/" replace />;
  }

  // Restaurant dashboard protection
  if (
    location.pathname.startsWith("/restaurant/dashboard") &&
    user.role !== "restaurant"
  ) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;