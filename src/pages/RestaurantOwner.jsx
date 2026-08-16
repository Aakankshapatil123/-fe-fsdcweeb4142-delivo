import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

import {
  getRestaurantProfile,
} from "../services/restaurantOwnerServices";

const RestaurantOwner = () => {
  const navigate = useNavigate();

  const { isAuthenticated, user, loading: authLoading } = useSelector(
    (state) => state.auth
  );

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH RESTAURANT
  // =====================================================

  useEffect(() => {
    const fetchRestaurants = async () => {
      // Wait until authentication check is completed
      if (authLoading) {
        return;
      }

      // User is not logged in
      if (!isAuthenticated || !user) {
        navigate("/login", { replace: true });
        return;
      }

      // Only restaurant owner can access this page
      if (user.role !== "restaurant") {
        navigate("/", { replace: true });
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await getRestaurantProfile();

        console.log("RESTAURANT PROFILE:", response);

        setRestaurants(response?.result || []);
      } catch (error) {
        console.error(
          "GET RESTAURANTS ERROR:",
          error.response?.data?.message || error.message
        );

        setError(
          error.response?.data?.message ||
            "Failed to load restaurant."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [authLoading, isAuthenticated, user, navigate]);

  // =====================================================
  // LOADING
  // =====================================================

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-50">
        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500"></div>

          <p className="mt-4 font-semibold text-gray-600">
            Loading restaurant...
          </p>

        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-6">
        <div className="rounded-2xl bg-white p-8 text-center shadow-md">

          <p className="font-semibold text-red-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 rounded-lg bg-orange-500 px-5 py-2 font-semibold text-white transition hover:bg-orange-600"
          >
            Try Again
          </button>

        </div>
      </div>
    );
  }

  // =====================================================
  // NO RESTAURANT
  // =====================================================

  if (!restaurants.length) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-6">
        <div className="text-center">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-4xl">
            🍽️
          </div>

          <h2 className="mt-5 text-2xl font-bold text-gray-800">
            No Restaurant Found
          </h2>

          <p className="mt-2 text-gray-500">
            You don't have any restaurant yet.
          </p>

        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 md:px-10">

      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            My Restaurant
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your restaurant details
          </p>

        </div>

        {/* =================================================
            RESTAURANT COUNT
        ================================================= */}

        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">

          <p className="text-sm font-medium text-gray-500">
            Total Restaurant
          </p>

          <p className="mt-1 text-3xl font-bold text-orange-500">
            {restaurants.length}
          </p>

        </div>

        {/* =================================================
            RESTAURANT
        ================================================= */}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {restaurants.map((restaurant) => (

            <div
              key={restaurant._id}
              className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:shadow-lg"
            >

              {/* =================================================
                  IMAGE
              ================================================= */}

              <div className="h-52 w-full bg-gray-200">

                {restaurant.image ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL.replace("/api/v1", "")}${restaurant.image}`}
                    alt={restaurant.name || "Restaurant"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">
                    No Restaurant Image
                  </div>
                )}

              </div>

              {/* =================================================
                  DETAILS
              ================================================= */}

              <div className="p-6">

                {/* NAME + STATUS */}

                <div className="flex items-start justify-between gap-3">

                  <div className="min-w-0">

                    <h2 className="truncate text-2xl font-bold text-gray-900">
                      {restaurant.name}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {restaurant.cuisine ||
                        "Cuisine not available"}
                    </p>

                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
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

                {/* =================================================
                    DESCRIPTION
                ================================================= */}

                <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">
                  {restaurant.description ||
                    "No description available."}
                </p>

                {/* =================================================
                    LOCATION
                ================================================= */}

                <div className="mt-5 rounded-xl bg-gray-50 p-4">

                  <p className="text-xs text-gray-500">
                    Location
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {restaurant.location?.address ||
                      "N/A"}

                    {restaurant.location?.city
                      ? `, ${restaurant.location.city}`
                      : ""}
                  </p>

                </div>

                {/* =================================================
                    RESTAURANT INFO
                ================================================= */}

                <div className="mt-4 grid grid-cols-2 gap-3">

                  {/* PRICE */}

                  <div className="rounded-xl bg-gray-50 p-4">

                    <p className="text-xs text-gray-500">
                      Price Range
                    </p>

                    <p className="mt-1 font-semibold text-gray-800">
                      {restaurant.priceRange || "₹"}
                    </p>

                  </div>

                  {/* RATING */}

                  <div className="rounded-xl bg-gray-50 p-4">

                    <p className="text-xs text-gray-500">
                      Rating
                    </p>

                    <p className="mt-1 font-semibold text-gray-800">
                      ★ {restaurant.rating ?? 0}
                    </p>

                  </div>

                </div>

                {/* =================================================
                    OPENING HOURS
                ================================================= */}

                <div className="mt-4 rounded-xl bg-gray-50 p-4">

                  <p className="text-xs text-gray-500">
                    Opening Hours
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {restaurant.openingHours || "N/A"}
                  </p>

                </div>

                {/* =================================================
                    EDIT RESTAURANT BUTTON
                ================================================= */}

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/restaurant/owner/edit/${restaurant._id}`
                    )
                  }
                  className="mt-6 w-full rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white transition hover:bg-orange-600"
                >
                  ✏️ Edit Restaurant
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
};

export default RestaurantOwner;