import { Link } from "react-router";

const RestaurantDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 md:px-10">
      <div className="mx-auto max-w-7xl">

        {/* ================= HEADER ================= */}

        <h1 className="text-3xl font-bold text-gray-800 md:text-4xl">
          Restaurant Dashboard
        </h1>

        <p className="mt-2 text-gray-600">
          Welcome to Delivo Restaurant Dashboard
        </p>

        {/* ================= MANAGEMENT CARDS ================= */}

        <div className="mt-10 grid gap-6 md:grid-cols-3">

          {/* Restaurant Owner / Profile */}

          <Link
            to="/restaurant/owner"
            className="rounded-2xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="text-4xl">🏪</div>

            <h2 className="mt-4 text-xl font-bold text-gray-800">
              Restaurant Profile
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              View and manage your restaurant profile,
              image, location, cuisine and opening hours.
            </p>

            <div className="mt-5 inline-block rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white">
              Manage Restaurant
            </div>
          </Link>

          {/* Menu Management */}

          <Link
            to="/restaurant/dashboard"
            className="rounded-2xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="text-4xl">🍽️</div>

            <h2 className="mt-4 text-xl font-bold text-gray-800">
              Menu Management
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Create, update and delete menu items,
              prices, extras and nutrition information.
            </p>

            <div className="mt-5 inline-block rounded-lg bg-green-500 px-4 py-2 font-semibold text-white">
              Manage Menu
            </div>
          </Link>

          {/* Orders */}

          <Link
            to="/restaurant/orders"
            className="rounded-2xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="text-4xl">📦</div>

            <h2 className="mt-4 text-xl font-bold text-gray-800">
              Orders
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              View customer orders and update order
              status from Pending to Delivered.
            </p>

            <div className="mt-5 inline-block rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white">
              Manage Orders
            </div>
          </Link>

        </div>

        {/* ================= ORDER STATUS FLOW ================= */}

        <div className="mt-10 rounded-2xl bg-white p-6 shadow-md">

          <h2 className="text-2xl font-bold text-gray-800">
            Order Status Flow
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-xl bg-gray-100 p-5 text-center">
              <div className="text-3xl">🕐</div>

              <p className="mt-2 font-bold text-gray-800">
                Pending
              </p>
            </div>

            <div className="rounded-xl bg-yellow-50 p-5 text-center">
              <div className="text-3xl">👨‍🍳</div>

              <p className="mt-2 font-bold text-yellow-700">
                Preparing
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-5 text-center">
              <div className="text-3xl">🛵</div>

              <p className="mt-2 font-bold text-blue-700">
                Out for Delivery
              </p>
            </div>

            <div className="rounded-xl bg-green-50 p-5 text-center">
              <div className="text-3xl">✅</div>

              <p className="mt-2 font-bold text-green-700">
                Delivered
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default RestaurantDashboard;