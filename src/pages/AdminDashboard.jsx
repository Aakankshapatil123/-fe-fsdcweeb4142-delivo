import { Link } from "react-router";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">

        {/* ================= HEADER ================= */}

        <h1 className="text-3xl font-bold text-gray-800">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-gray-600">
          Welcome to Delivo Admin Dashboard
        </p>

        {/* ================= MANAGEMENT CARDS ================= */}

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          {/* USERS */}

          <Link
            to="/admin/users"
            className="rounded-2xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="text-4xl">
              👥
            </div>

            <h2 className="mt-4 text-xl font-bold text-gray-800">
              Users
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              View and manage registered users.
            </p>

            <div className="mt-5 inline-block rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white">
              Manage Users
            </div>
          </Link>

          {/* RESTAURANTS */}

          <Link
            to="/admin/restaurants"
            className="rounded-2xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="text-4xl">
              🏪
            </div>

            <h2 className="mt-4 text-xl font-bold text-gray-800">
              Restaurants
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Manage restaurant listings and profiles.
            </p>

            <div className="mt-5 inline-block rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white">
              Manage Restaurants
            </div>
          </Link>

          {/* ORDERS */}

          <Link
            to="/admin/orders"
            className="rounded-2xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="text-4xl">
              📦
            </div>

            <h2 className="mt-4 text-xl font-bold text-gray-800">
              Orders
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              View all customer orders and update status.
            </p>

            <div className="mt-5 inline-block rounded-lg bg-green-500 px-4 py-2 font-semibold text-white">
              Manage Orders
            </div>
          </Link>

          {/* REVIEWS */}

          <Link
            to="/admin/reviews"
            className="rounded-2xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="text-4xl">
              ⭐
            </div>

            <h2 className="mt-4 text-xl font-bold text-gray-800">
              Reviews
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Manage and moderate customer reviews.
            </p>

            <div className="mt-5 inline-block rounded-lg bg-yellow-500 px-4 py-2 font-semibold text-white">
              Manage Reviews
            </div>
          </Link>

        </div>

        {/* ================= ORDER STATUS ================= */}

        <div className="mt-10 rounded-2xl bg-white p-6 shadow-md">

          <h2 className="text-2xl font-bold text-gray-800">
            Order Status
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-4">

            <div className="rounded-xl bg-gray-100 p-5 text-center">
              <div className="text-3xl">
                🕐
              </div>

              <p className="mt-2 font-bold text-gray-800">
                Pending
              </p>
            </div>

            <div className="rounded-xl bg-yellow-50 p-5 text-center">
              <div className="text-3xl">
                👨‍🍳
              </div>

              <p className="mt-2 font-bold text-yellow-700">
                Preparing
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-5 text-center">
              <div className="text-3xl">
                🛵
              </div>

              <p className="mt-2 font-bold text-blue-700">
                Out for Delivery
              </p>
            </div>

            <div className="rounded-xl bg-green-50 p-5 text-center">
              <div className="text-3xl">
                ✅
              </div>

              <p className="mt-2 font-bold text-green-700">
                Delivered
              </p>
            </div>

          </div>
        </div>

        {/* ================= QUICK ACTION ================= */}

        <div className="mt-8">
          <Link
            to="/admin/orders"
            className="inline-block rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
          >
            View All Orders
          </Link>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;