import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";

import {
  getMyFavorites,
  removeRestaurantFavorite,
  removeMenuFavorite,
} from "../services/favoriteServices";

const Favorites = () => {
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= FETCH FAVORITES =================

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await getMyFavorites();

        console.log(
          "MY FAVORITES:",
          response
        );

        setFavorites(
          response.favorites || []
        );
      } catch (error) {
        console.log(
          "FAVORITES ERROR:",
          error.response?.data?.message ||
            error.message
        );

        setError(
          "Failed to load favorites"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [isAuthenticated, navigate]);

  // ================= REMOVE FAVORITE =================

  const handleRemoveRestaurant = async (
    restaurantId
  ) => {
    try {
      await removeRestaurantFavorite(
        restaurantId
      );

      setFavorites((prev) =>
        prev.filter(
          (favorite) =>
            !(
              favorite.restaurant &&
              favorite.restaurant._id === restaurantId
            )
        )
      );
    } catch (error) {
      console.log(
        "REMOVE RESTAURANT FAVORITE ERROR:",
        error.response?.data?.message ||
          error.message
      );
    }
  };

  const handleRemoveMenu = async (menuId) => {
    try {
      await removeMenuFavorite(menuId);

      setFavorites((prev) =>
        prev.filter(
          (favorite) =>
            !(
              favorite.menu &&
              favorite.menu._id === menuId
            )
        )
      );
    } catch (error) {
      console.log(
        "REMOVE MENU FAVORITE ERROR:",
        error.response?.data?.message ||
          error.message
      );
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-50">
        <p className="text-lg font-semibold text-gray-600">
          Loading favorites...
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

  // ================= SPLIT FAVORITES =================

  const restaurantFavorites =
    favorites.filter(
      (favorite) =>
        favorite.restaurant
    );

  const menuFavorites =
    favorites.filter(
      (favorite) =>
        favorite.menu
    );

  // ================= EMPTY =================

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10 md:px-10">

        <div className="mx-auto max-w-7xl">

          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            My Favorites
          </h1>

          <div className="mt-10 rounded-2xl bg-white px-6 py-20 text-center shadow-md">

            <div className="text-6xl">
              ♡
            </div>

            <h2 className="mt-5 text-2xl font-bold text-gray-800">
              No Favorites Yet
            </h2>

            <p className="mt-2 text-gray-500">
              Save your favorite restaurants
              and menu items for quick access.
            </p>

            <Link
              to="/restaurants"
              className="mt-6 inline-block rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
            >
              Browse Restaurants
            </Link>

          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 md:px-10">

      <div className="mx-auto max-w-7xl">

        {/* ================= HEADER ================= */}

        <div className="mb-10">

          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            My Favorites
          </h1>

          <p className="mt-2 text-gray-600">
            Your saved restaurants and menu items
          </p>

        </div>

        {/* ================= FAVORITE RESTAURANTS ================= */}

        {restaurantFavorites.length > 0 && (
          <section className="mb-12">

            <div className="mb-6 flex items-center justify-between">

              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Favorite Restaurants
                </h2>

                <p className="mt-1 text-gray-500">
                  {restaurantFavorites.length} saved restaurant
                  {restaurantFavorites.length !== 1
                    ? "s"
                    : ""}
                </p>
              </div>

            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              {restaurantFavorites.map(
                (favorite) => {

                  const restaurant =
                    favorite.restaurant;

                  return (
                    <div
                      key={favorite._id}
                      className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
                    >

                      {/* IMAGE */}

                      <div className="relative h-48 overflow-hidden bg-gray-200">

                        {restaurant.image ? (
                          <img
                            src={`${import.meta.env.VITE_API_URL.replace("/api/v1", "")}${restaurant.image}`}
                            alt={restaurant.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}

                        {/* Favorite */}

                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveRestaurant(
                              restaurant._id
                            )
                          }
                          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl text-red-500 shadow-md transition hover:scale-110"
                        >
                          ♥
                        </button>

                      </div>

                      {/* DETAILS */}

                      <div className="p-5">

                        <div className="flex items-start justify-between gap-3">

                          <h3 className="text-xl font-bold text-gray-900">
                            {restaurant.name}
                          </h3>

                          <span className="rounded-md bg-green-100 px-2 py-1 text-sm font-semibold text-green-700">
                            ★{" "}
                            {restaurant.rating ?? 0}
                          </span>

                        </div>

                        <p className="mt-2 text-sm font-medium text-gray-500">
                          {restaurant.cuisine}
                        </p>

                        <p className="mt-2 text-sm text-gray-600">
                          📍{" "}
                          {restaurant.location?.city ||
                            "Location not available"}
                        </p>

                        <div className="mt-4 flex items-center justify-between">

                          <span className="font-semibold text-gray-700">
                            {restaurant.priceRange ||
                              "₹"}
                          </span>

                          <span
                            className={`text-sm font-semibold ${
                              restaurant.isOpen
                                ? "text-green-600"
                                : "text-red-500"
                            }`}
                          >
                            {restaurant.isOpen
                              ? "Open"
                              : "Closed"}
                          </span>

                        </div>

                        <Link
                          to={`/restaurants/${restaurant._id}`}
                          className="mt-4 block w-full rounded-lg bg-orange-500 px-4 py-3 text-center font-semibold text-white hover:bg-orange-600"
                        >
                          View Restaurant
                        </Link>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          </section>
        )}

        {/* ================= FAVORITE MENU ITEMS ================= */}

        {menuFavorites.length > 0 && (
          <section>

            <div className="mb-6">

              <h2 className="text-2xl font-bold text-gray-900">
                Favorite Menu Items
              </h2>

              <p className="mt-1 text-gray-500">
                {menuFavorites.length} saved menu item
                {menuFavorites.length !== 1
                  ? "s"
                  : ""}
              </p>

            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              {menuFavorites.map(
                (favorite) => {

                  const menu = favorite.menu;

                  return (
                    <div
                      key={favorite._id}
                      className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
                    >

                      {/* IMAGE */}

                      <div className="relative h-48 overflow-hidden bg-gray-200">

                        {menu.image ? (
                          <img
                            src={`${import.meta.env.VITE_API_URL.replace("/api/v1", "")}${menu.image}`}
                            alt={menu.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}

                        {/* Favorite */}

                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveMenu(
                              menu._id
                            )
                          }
                          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl text-red-500 shadow-md transition hover:scale-110"
                        >
                          ♥
                        </button>

                      </div>

                      {/* DETAILS */}

                      <div className="p-5">

                        <div className="flex items-start justify-between gap-3">

                          <h3 className="text-xl font-bold text-gray-900">
                            {menu.name}
                          </h3>

                          <span className="whitespace-nowrap text-lg font-bold text-orange-500">
                            ₹{menu.price}
                          </span>

                        </div>

                        <p className="mt-2 text-sm font-semibold text-gray-500">
                          {menu.category}
                        </p>

                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
                          {menu.description ||
                            "No description available."}
                        </p>

                        {menu.nutrition && (
                          <div className="mt-4 rounded-lg bg-gray-50 p-3">

                            <p className="text-sm font-bold text-gray-800">
                              Nutrition
                            </p>

                            <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600">

                              <span>
                                Calories:{" "}
                                {menu.nutrition
                                  .calories ?? 0}{" "}
                                kcal
                              </span>

                              <span>
                                Protein:{" "}
                                {menu.nutrition
                                  .protein ?? 0}{" "}
                                g
                              </span>

                              <span>
                                Carbs:{" "}
                                {menu.nutrition
                                  .carbohydrates ?? 0}{" "}
                                g
                              </span>

                              <span>
                                Fat:{" "}
                                {menu.nutrition
                                  .fat ?? 0}{" "}
                                g
                              </span>

                            </div>

                          </div>
                        )}

                        <div className="mt-4">

                          <span
                            className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${
                              menu.isAvailable
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {menu.isAvailable
                              ? "Available"
                              : "Not Available"}
                          </span>

                        </div>

                        {menu.restaurant && (
                          <Link
                            to={`/restaurants/${menu.restaurant}`}
                            className="mt-4 block w-full rounded-lg bg-orange-500 px-4 py-3 text-center font-semibold text-white hover:bg-orange-600"
                          >
                            View Restaurant
                          </Link>
                        )}

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          </section>
        )}

      </div>

    </div>
  );
};

export default Favorites;