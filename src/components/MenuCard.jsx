import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

import {
  addMenuFavorite,
  removeMenuFavorite,
  checkMenuFavorite,
} from "../services/favoriteServices";

const MenuCard = ({ menu, onCustomize }) => {
  const navigate = useNavigate();

  // ================= AUTH =================

  const { isAuthenticated } = useSelector((state) => state.auth);

  // ================= FAVORITE STATE =================

  const [isFavorite, setIsFavorite] = useState(false);

  const [favoriteLoading, setFavoriteLoading] = useState(false);

  // ================= CHECK FAVORITE =================

  useEffect(() => {
    const checkFavorite = async () => {
      if (!isAuthenticated || !menu?._id) {
        setIsFavorite(false);
        return;
      }

      try {
        const response = await checkMenuFavorite(menu._id);

        setIsFavorite(response.isFavorite || false);
      } catch (error) {
        console.log(
          "CHECK MENU FAVORITE ERROR:",
          error.response?.data?.message || error.message,
        );

        setIsFavorite(false);
      }
    };

    checkFavorite();
  }, [isAuthenticated, menu?._id]);

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
        await removeMenuFavorite(menu._id);
        setIsFavorite(false);
      } else {
        await addMenuFavorite(menu._id);
        setIsFavorite(true);
      }
    } catch (error) {
      console.log(
        "MENU FAVORITE ERROR:",
        error.response?.data?.message || error.message,
      );
    } finally {
      setFavoriteLoading(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* ================= MENU IMAGE ================= */}

      <div className="relative h-48 w-full overflow-hidden bg-gray-200">
        {menu.image ? (
          <img
             src={`${import.meta.env.VITE_API_URL.replace("/api/v1", "")}${menu.image}`}
            alt={menu.name}
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
          aria-label={
            isFavorite
              ? "Remove menu item from favorites"
              : "Add menu item to favorites"
          }
          className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition ${
            favoriteLoading
              ? "cursor-not-allowed opacity-50"
              : "hover:scale-110"
          }`}
        >
          <span
            className={`text-2xl leading-none ${
              isFavorite ? "text-red-500" : "text-gray-400"
            }`}
          >
            {isFavorite ? "♥" : "♡"}
          </span>
        </button>
      </div>

      {/* ================= MENU DETAILS ================= */}

      <div className="p-5">
        {/* Name + Price */}

        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-bold text-gray-900">{menu.name}</h3>

          <span className="whitespace-nowrap text-lg font-bold text-orange-500">
            ₹{menu.price}
          </span>
        </div>

        {/* Category */}

        <p className="mt-2 text-sm font-semibold text-gray-500">
          {menu.category}
        </p>

        {/* Description */}

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
          {menu.description || "No description available."}
        </p>

        {/* ================= NUTRITION ================= */}

        {menu.nutrition && (
          <div className="mt-4 rounded-lg bg-gray-50 p-3">
            <p className="text-sm font-bold text-gray-800">
              Nutritional Information
            </p>

            <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600">
              <span>Calories: {menu.nutrition.calories ?? 0} kcal</span>

              <span>Protein: {menu.nutrition.protein ?? 0} g</span>

              <span>Carbs: {menu.nutrition.carbohydrates ?? 0} g</span>

              <span>Fat: {menu.nutrition.fat ?? 0} g</span>
            </div>
          </div>
        )}

        {/* ================= AVAILABILITY ================= */}

        <div className="mt-4">
          <span
            className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${
              menu.isAvailable
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {menu.isAvailable ? "Available" : "Not Available"}
          </span>
        </div>

        {/* ================= CUSTOMIZE BUTTON ================= */}

        <button
          type="button"
          disabled={!menu.isAvailable}
          onClick={() => onCustomize(menu)}
          className={`mt-5 w-full rounded-lg px-4 py-3 font-semibold text-white transition ${
            menu.isAvailable
              ? "bg-orange-500 hover:bg-orange-600"
              : "cursor-not-allowed bg-gray-400"
          }`}
        >
          {menu.isAvailable ? "Customize & Add" : "Not Available"}
        </button>
      </div>
    </div>
  );
};

export default MenuCard;
