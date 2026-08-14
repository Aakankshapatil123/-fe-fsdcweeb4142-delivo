import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getDashboardStatistics } from "../services/adminDashboardService";

const AdminDashboard = () => {
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    totalRestaurants: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    deliveregOrders: 0,
    cancleOrders: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const data = await getDashboardStatistics();

        console.log("DASHBOARD STATISTICS:", data);

        setStatistics(data.result);
      } catch (error) {
        console.error(
          "GET DASHBOARD STATISTICS ERROR:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Admin Dashboard
        </h1>

        <p className="mt-6 text-gray-600">
          Loading dashboard statistics...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">

        <h1 className="text-3xl font-bold text-gray-800">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-gray-600">
          Welcome to Delivo Admin Dashboard
        </p>

        {/* Statistics */}

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          {/* Users */}

          <Link
            to="/admin/users"
            className="rounded-2xl bg-white p-6 shadow-md"
          >
            <div className="text-4xl">👥</div>

            <h2 className="mt-4 text-lg font-semibold text-gray-600">
              Total Users
            </h2>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {statistics.totalUsers}
            </p>
          </Link>

          {/* Restaurants */}

          <Link
            to="/admin/restaurants"
            className="rounded-2xl bg-white p-6 shadow-md"
          >
            <div className="text-4xl">🏪</div>

            <h2 className="mt-4 text-lg font-semibold text-gray-600">
              Total Restaurants
            </h2>

            <p className="mt-2 text-3xl font-bold text-orange-500">
              {statistics.totalRestaurants}
            </p>
          </Link>

          {/* Orders */}

          <Link
            to="/admin/orders"
            className="rounded-2xl bg-white p-6 shadow-md"
          >
            <div className="text-4xl">📦</div>

            <h2 className="mt-4 text-lg font-semibold text-gray-600">
              Total Orders
            </h2>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {statistics.totalOrders}
            </p>
          </Link>

          {/* Revenue */}

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="text-4xl">💰</div>

            <h2 className="mt-4 text-lg font-semibold text-gray-600">
              Total Revenue
            </h2>

            <p className="mt-2 text-3xl font-bold text-purple-600">
              ₹{Number(statistics.totalRevenue || 0).toFixed(2)}
            </p>
          </div>

        </div>

        {/* Order Status */}

        <div className="mt-10 rounded-2xl bg-white p-6 shadow-md">

          <h2 className="text-2xl font-bold text-gray-800">
            Order Status
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">

            <div className="rounded-xl bg-gray-100 p-5 text-center">
              <div className="text-3xl">🕐</div>

              <p className="mt-2 font-bold">
                Pending
              </p>

              <p className="mt-2 text-3xl font-bold">
                {statistics.pendingOrders}
              </p>
            </div>

            <div className="rounded-xl bg-green-50 p-5 text-center">
              <div className="text-3xl">✅</div>

              <p className="mt-2 font-bold text-green-700">
                Delivered
              </p>

              <p className="mt-2 text-3xl font-bold text-green-600">
                {statistics.deliveregOrders}
              </p>
            </div>

            <div className="rounded-xl bg-red-50 p-5 text-center">
              <div className="text-3xl">❌</div>

              <p className="mt-2 font-bold text-red-700">
                Cancelled
              </p>

              <p className="mt-2 text-3xl font-bold text-red-600">
                {statistics.cancleOrders}
              </p>
            </div>

          </div>
        </div>

        {/* Quick Actions */}

        <div className="mt-8 flex flex-wrap gap-4">

          <Link
            to="/admin/users"
            className="rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white"
          >
            Manage Users
          </Link>

          <Link
            to="/admin/restaurants"
            className="rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white"
          >
            Manage Restaurants
          </Link>

          <Link
            to="/admin/orders"
            className="rounded-lg bg-green-500 px-6 py-3 font-semibold text-white"
          >
            View Orders
          </Link>

          <Link
            to="/admin/reviews"
            className="rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-white"
          >
            Manage Reviews
          </Link>

        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;