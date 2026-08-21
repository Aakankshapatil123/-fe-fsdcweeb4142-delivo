import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";

import {
  addRestaurantFavorite,
  removeRestaurantFavorite,
  checkRestaurantFavorite,
} from "../services/favoriteServices";

const RestaurantCard = ({ restaurant }) => {
  const navigate = useNavigate();

  // ================= AUTH =================

  const { isAuthenticated } = useSelector((state) => state.auth);

  // ================= FAVORITE STATE =================

  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  // ================= CHECK FAVORITE =================

  useEffect(() => {
    const checkFavorite = async () => {
      if (!isAuthenticated || !restaurant?._id) {
        setIsFavorite(false);
        return;
      }

      try {
        const response = await checkRestaurantFavorite(restaurant._id);

        setIsFavorite(response.isFavorite || false);
      } catch (error) {
        console.log(
          "CHECK FAVORITE ERROR:",
          error.response?.data?.message || error.message,
        );

        setIsFavorite(false);
      }
    };

    checkFavorite();
  }, [isAuthenticated, restaurant?._id]);

  // ================= TOGGLE FAVORITE =================

  const handleFavorite = async () => {
    // Login required
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (favoriteLoading) {
      return;
    }

    try {
      setFavoriteLoading(true);

      if (isFavorite) {
        await removeRestaurantFavorite(restaurant._id);

        setIsFavorite(false);
      } else {
        await addRestaurantFavorite(restaurant._id);

        setIsFavorite(true);
      }
    } catch (error) {
      console.log(
        "FAVORITE ERROR:",
        error.response?.data?.message || error.message,
      );
    } finally {
      setFavoriteLoading(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* ================= IMAGE ================= */}

      <div className="relative h-48 w-full overflow-hidden bg-gray-200">
        {restaurant.image ? (
          <img
            // src={`${import.meta.env.VITE_API_URL.replace("/api/v1", "")}${restaurant.image}`}
            // src={restaurant.image}
            src={
              restaurant.image?.startsWith("http")
                ? restaurant.image
                : `${import.meta.env.VITE_API_URL.replace("/api/v1", "")}${restaurant.image}`
            }
            alt={restaurant.name}
            className="h-full w-full object-cover transition duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            No Image
          </div>
        )}

        {/* ================= FAVORITE BUTTON ================= */}

        <button
          type="button"
          onClick={handleFavorite}
          disabled={favoriteLoading}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full text-2xl shadow-md transition ${
            favoriteLoading
              ? "cursor-not-allowed opacity-50"
              : "hover:scale-110"
          }`}
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>
      </div>

      {/* ================= DETAILS ================= */}

      <div className="p-5">
        {/* Name + Rating */}

        <div className="flex items-start justify-between gap-3">
          <h2 className="text-xl font-bold text-gray-900">{restaurant.name}</h2>

          <span className="whitespace-nowrap rounded-md bg-green-100 px-2 py-1 text-sm font-semibold text-green-700">
            ★ {restaurant.rating ?? 0}
          </span>
        </div>

        {/* Cuisine */}

        <p className="mt-2 text-sm font-medium text-gray-500">
          {restaurant.cuisine}
        </p>

        {/* Location */}

        <p className="mt-2 text-sm text-gray-600">
          📍 {restaurant.location?.address || ""}
          {restaurant.location?.city ? `, ${restaurant.location.city}` : ""}
        </p>

        {/* Opening Hours */}

        <p className="mt-2 text-sm text-gray-500">
          🕒 {restaurant.openingHours || "Not available"}
        </p>

        {/* Description */}

        <p className="mt-2 line-clamp-2 text-sm text-gray-600">
          {restaurant.description || "No description available."}
        </p>

        {/* Price + Open Status */}

        <div className="mt-4 flex items-center justify-between">
          <span className="font-semibold text-gray-700">
            {restaurant.priceRange || "₹"}
          </span>

          <span
            className={`text-sm font-semibold ${
              restaurant.isOpen ? "text-green-600" : "text-red-500"
            }`}
          >
            {restaurant.isOpen ? "Open" : "Closed"}
          </span>
        </div>

        {/* View Details */}

        <Link
          to={`/restaurants/${restaurant._id}`}
          className="mt-4 block w-full rounded-lg bg-orange-500 px-4 py-3 text-center font-semibold text-white transition hover:bg-orange-600"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default RestaurantCard;
