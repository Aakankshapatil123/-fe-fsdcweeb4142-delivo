import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";

import {
  getRestaurantProfile,
} from "../services/restaurantOwnerServices";

const RestaurantOwner = () => {
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [restaurant, setRestaurant] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= FETCH RESTAURANT =================

  useEffect(() => {
    const fetchRestaurantProfile = async () => {
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await getRestaurantProfile();

        setRestaurant(response.result);
      } catch (error) {
        console.log(
          "RESTAURANT PROFILE ERROR:",
          error.response?.data?.message ||
            error.message
        );

        setError(
          error.response?.data?.message ||
            "Failed to load restaurant profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantProfile();
  }, [isAuthenticated, navigate]);

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-50">
        <p className="text-lg font-semibold text-gray-600">
          Loading restaurant...
        </p>
      </div>
    );
  }

  // ================= ERROR =================

  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-6">
        <div className="text-center">

          <p className="font-semibold text-red-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="mt-4 rounded-lg bg-orange-500 px-5 py-2 font-semibold text-white hover:bg-orange-600"
          >
            Try Again
          </button>

        </div>
      </div>
    );
  }

  // ================= NO RESTAURANT =================

  if (!restaurant) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-50">
        <div className="text-center">

          <p className="text-lg font-semibold text-gray-600">
            Restaurant not found
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 md:px-10">

      <div className="mx-auto max-w-7xl">

        {/* ================= HEADER ================= */}

        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">

          <div>

            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Restaurant Owner
            </h1>

            <p className="mt-2 text-gray-600">
              Manage your restaurant and orders
            </p>

          </div>

          <Link
            to="/restaurant/dashboard"
            className="rounded-lg bg-orange-500 px-5 py-3 text-center font-semibold text-white hover:bg-orange-600"
          >
            Dashboard
          </Link>

        </div>

        {/* ================= RESTAURANT PROFILE ================= */}

        <div className="overflow-hidden rounded-2xl bg-white shadow-md">

          {/* IMAGE */}

          <div className="h-64 w-full bg-gray-200">

            {restaurant.image ? (
              <img
                src={`http://localhost:3001${restaurant.image}`}
                alt={restaurant.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                No Restaurant Image
              </div>
            )}

          </div>

          {/* DETAILS */}

          <div className="p-6 md:p-8">

            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">

              <div>

                <h2 className="text-3xl font-bold text-gray-900">
                  {restaurant.name}
                </h2>

                <p className="mt-2 text-gray-500">
                  {restaurant.cuisine ||
                    "Cuisine not available"}
                </p>

              </div>

              <span
                className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${
                  restaurant.isOpen
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {restaurant.isOpen
                  ? "Open"
                  : "Closed"}
              </span>

            </div>

            {/* DESCRIPTION */}

            <p className="mt-5 leading-7 text-gray-600">
              {restaurant.description ||
                "No restaurant description available."}
            </p>

            {/* INFO */}

            <div className="mt-6 grid gap-4 md:grid-cols-2">

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">
                  Location
                </p>

                <p className="mt-1 font-semibold text-gray-800">
                  {restaurant.location?.address ||
                    "N/A"}

                  {restaurant.location?.city
                    ? `, ${restaurant.location.city}`
                    : ""}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">
                  Opening Hours
                </p>

                <p className="mt-1 font-semibold text-gray-800">
                  {restaurant.openingHours ||
                    "N/A"}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">
                  Price Range
                </p>

                <p className="mt-1 font-semibold text-gray-800">
                  {restaurant.priceRange ||
                    "₹"}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">
                  Rating
                </p>

                <p className="mt-1 font-semibold text-gray-800">
                  ★ {restaurant.rating ?? 0}
                </p>
              </div>

            </div>

            {/* ================= ACTIONS ================= */}

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              <Link
                to={`/restaurant/dashboard`}
                className="rounded-xl bg-orange-500 px-5 py-4 text-center font-semibold text-white transition hover:bg-orange-600"
              >
                Manage Restaurant
              </Link>

              <Link
                to="/restaurant/orders"
                className="rounded-xl bg-blue-500 px-5 py-4 text-center font-semibold text-white transition hover:bg-blue-600"
              >
                Manage Orders
              </Link>

              <Link
                to="/restaurant/dashboard"
                className="rounded-xl bg-green-500 px-5 py-4 text-center font-semibold text-white transition hover:bg-green-600"
              >
                Manage Menu
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default RestaurantOwner;