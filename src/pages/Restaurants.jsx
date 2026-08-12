import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

import { getAllRestaurants } from "../services/restaurantServices";
import RestaurantCard from "../components/RestaurantCart";
// import RestaurantCard from "../components/RestaurantCard";

const Restaurants = () => {
  // ================= URL SEARCH =================

  const [searchParams, setSearchParams] =
    useSearchParams();

  const urlSearch =
    searchParams.get("search") || "";

  // ================= STATE =================

  const [restaurants, setRestaurants] = useState([]);

  const [search, setSearch] = useState(urlSearch);

  const [cuisineFilter, setCuisineFilter] =
    useState("");

  const [locationFilter, setLocationFilter] =
    useState("");

  const [ratingFilter, setRatingFilter] =
    useState("");

  const [priceFilter, setPriceFilter] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= FETCH RESTAURANTS =================

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAllRestaurants();

        console.log("RESTAURANTS:", response);

        setRestaurants(response.restaurants || []);
      } catch (error) {
        console.log(
          "RESTAURANT ERROR:",
          error.response?.data?.message ||
            error.message
        );

        setError("Failed to load restaurants");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // ================= SYNC URL SEARCH =================

  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  // ================= SEARCH =================

  const handleSearch = (e) => {
    const value = e.target.value;

    setSearch(value);

    const trimmedValue = value.trim();

    if (trimmedValue) {
      setSearchParams({
        search: trimmedValue,
      });
    } else {
      setSearchParams({});
    }
  };

  // ================= FILTER =================

  const filteredRestaurants = restaurants.filter(
    (restaurant) => {
      const searchText = search
        .toLowerCase()
        .trim();

      const restaurantName =
        restaurant.name?.toLowerCase() || "";

      const cuisine =
        restaurant.cuisine?.toLowerCase() || "";

      const city =
        restaurant.location?.city?.toLowerCase() || "";

      // Search
      const matchesSearch =
        restaurantName.includes(searchText) ||
        cuisine.includes(searchText) ||
        city.includes(searchText);

      // Cuisine
      const matchesCuisine =
        cuisineFilter === "" ||
        cuisine === cuisineFilter.toLowerCase();

      // Location
      const matchesLocation =
        locationFilter === "" ||
        city === locationFilter.toLowerCase();

      // Rating
      const matchesRating =
        ratingFilter === "" ||
        Number(restaurant.rating || 0) >=
          Number(ratingFilter);

      // Price
      const matchesPrice =
        priceFilter === "" ||
        restaurant.priceRange === priceFilter;

      return (
        matchesSearch &&
        matchesCuisine &&
        matchesLocation &&
        matchesRating &&
        matchesPrice
      );
    }
  );

  // ================= CLEAR FILTERS =================

  const clearFilters = () => {
    setSearch("");
    setCuisineFilter("");
    setLocationFilter("");
    setRatingFilter("");
    setPriceFilter("");

    setSearchParams({});
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-50">
        <p className="text-lg font-semibold text-gray-600">
          Loading restaurants...
        </p>
      </div>
    );
  }

  // ================= ERROR =================

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="font-semibold text-red-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-orange-500 px-5 py-2 font-semibold text-white hover:bg-orange-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 md:px-10">

      <div className="mx-auto max-w-7xl">

        {/* ================= HEADER ================= */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Restaurants
          </h1>

          <p className="mt-2 text-gray-600">
            Discover the best restaurants near you
          </p>
        </div>

        {/* ================= SEARCH ================= */}

        <div className="mb-5">
          <input
            type="text"
            placeholder="Search restaurant, cuisine or city..."
            value={search}
            onChange={handleSearch}
            className="w-full rounded-xl border border-gray-300 bg-white px-5 py-4 text-gray-800 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          />
        </div>

        {/* ================= FILTERS ================= */}

        <div className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* Cuisine */}
          <select
            value={cuisineFilter}
            onChange={(e) =>
              setCuisineFilter(e.target.value)
            }
            className="rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          >
            <option value="">
              All Cuisines
            </option>

            <option value="Indian">
              Indian
            </option>

            <option value="Fast Food">
              Fast Food
            </option>

            <option value="Chinese">
              Chinese
            </option>

            <option value="Italian">
              Italian
            </option>
          </select>

          {/* Location */}
          <select
            value={locationFilter}
            onChange={(e) =>
              setLocationFilter(e.target.value)
            }
            className="rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          >
            <option value="">
              All Locations
            </option>

            <option value="Pune">
              Pune
            </option>

            <option value="Mumbai">
              Mumbai
            </option>

            <option value="Nashik">
              Nashik
            </option>
          </select>

          {/* Rating */}
          <select
            value={ratingFilter}
            onChange={(e) =>
              setRatingFilter(e.target.value)
            }
            className="rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          >
            <option value="">
              All Ratings
            </option>

            <option value="4">
              4★ & above
            </option>

            <option value="3">
              3★ & above
            </option>

            <option value="2">
              2★ & above
            </option>
          </select>

          {/* Price */}
          <select
            value={priceFilter}
            onChange={(e) =>
              setPriceFilter(e.target.value)
            }
            className="rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          >
            <option value="">
              All Prices
            </option>

            <option value="₹">
              ₹
            </option>

            <option value="₹₹">
              ₹₹
            </option>

            <option value="₹₹₹">
              ₹₹₹
            </option>

            <option value="₹₹₹₹">
              ₹₹₹₹
            </option>
          </select>

        </div>

        {/* ================= CLEAR FILTERS ================= */}

        <div className="mb-6 flex justify-end">
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-lg bg-gray-800 px-5 py-2.5 font-semibold text-white transition hover:bg-gray-900"
          >
            Clear Filters
          </button>
        </div>

        {/* ================= RESULT COUNT ================= */}

        <div className="mb-5">
          <p className="font-medium text-gray-600">
            {search ? (
              <>
                Search results for{" "}
                <span className="font-bold text-orange-500">
                  "{search}"
                </span>
                {" "}— {filteredRestaurants.length} found
              </>
            ) : (
              <>
                {filteredRestaurants.length} restaurants found
              </>
            )}
          </p>
        </div>

        {/* ================= RESTAURANT CARDS ================= */}

        {filteredRestaurants.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant._id}
                restaurant={restaurant}
              />
            ))}

          </div>
        ) : (
          <div className="rounded-2xl bg-white px-6 py-20 text-center shadow-md">

            <div className="text-6xl">
              🔍
            </div>

            <h2 className="mt-5 text-2xl font-bold text-gray-800">
              No restaurants found
            </h2>

            <p className="mt-2 text-gray-500">
              Try another restaurant name, cuisine,
              city or change the filters.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
            >
              Show All Restaurants
            </button>

          </div>
        )}

      </div>
    </div>
  );
};

export default Restaurants;