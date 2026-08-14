import { useEffect, useState } from "react";
import { Link } from "react-router";

import {
  getAllRestaurants,
  deleteRestaurant,
  updateRestaurant,
} from "../services/adminService";

const AdminRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= EDIT STATES =================

  const [editingRestaurant, setEditingRestaurant] = useState(null);

  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    cuisine: "",
    priceRange: "",
    location: "",
    openingHours: "",
  });

  // ================= GET ALL RESTAURANTS =================

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllRestaurants();

      console.log("RESTAURANTS RESPONSE:", response);

      setRestaurants(response.restaurants || []);
    } catch (error) {
      console.log(
        "GET RESTAURANTS ERROR:",
        error.response?.data?.message || error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to load restaurants"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // ================= EDIT CLICK =================

  const handleEditClick = (restaurant) => {
    setEditingRestaurant(restaurant);

    setEditForm({
      name: restaurant.name || "",
      description: restaurant.description || "",
      cuisine: restaurant.cuisine || "",
      priceRange: restaurant.priceRange || "",
      location: restaurant.location?.city || "",
      openingHours:
        typeof restaurant.openingHours === "string"
          ? restaurant.openingHours
          : "",
    });
  };

  // ================= EDIT INPUT =================

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= UPDATE RESTAURANT =================

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const updateData = {
        name: editForm.name,
        description: editForm.description,
        cuisine: editForm.cuisine,
        priceRange: editForm.priceRange,

        location: {
          city: editForm.location,
        },

        openingHours: editForm.openingHours,
      };

      const response = await updateRestaurant(
        editingRestaurant._id,
        updateData
      );

      console.log("UPDATE RESTAURANT RESPONSE:", response);

      // Update restaurant in frontend
      setRestaurants((prev) =>
        prev.map((restaurant) =>
          restaurant._id === editingRestaurant._id
            ? response.result
            : restaurant
        )
      );

      // Close edit modal
      setEditingRestaurant(null);

      alert("Restaurant updated successfully");
    } catch (error) {
      console.log(
        "UPDATE RESTAURANT ERROR:",
        error.response?.data?.message ||
          error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to update restaurant"
      );
    }
  };

  // ================= DELETE RESTAURANT =================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this restaurant?"
    );

    if (!confirmDelete) return;

    try {
      await deleteRestaurant(id);

      setRestaurants((prev) =>
        prev.filter(
          (restaurant) => restaurant._id !== id
        )
      );

      alert("Restaurant deleted successfully");
    } catch (error) {
      console.log(
        "DELETE RESTAURANT ERROR:",
        error.response?.data?.message ||
          error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete restaurant"
      );
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg font-semibold text-gray-600">
          Loading restaurants...
        </p>
      </div>
    );
  }

  // ================= ERROR =================

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="font-semibold text-red-500">
            {error}
          </p>

          <button
            onClick={fetchRestaurants}
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

        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Manage Restaurants
            </h1>

            <p className="mt-2 text-gray-600">
              View and manage all restaurants
            </p>
          </div>

          <Link
            to="/admin/dashboard"
            className="rounded-lg bg-gray-700 px-5 py-3 text-center font-semibold text-white hover:bg-gray-800"
          >
            ← Dashboard
          </Link>

        </div>

        {/* ================= NO RESTAURANTS ================= */}

        {restaurants.length === 0 ? (

          <div className="rounded-2xl bg-white p-10 text-center shadow-md">

            <div className="text-5xl">
              🏪
            </div>

            <h2 className="mt-4 text-xl font-bold text-gray-800">
              No restaurants found
            </h2>

            <p className="mt-2 text-gray-500">
              There are no restaurants available.
            </p>

          </div>

        ) : (

          /* ================= RESTAURANT CARDS ================= */

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {restaurants.map((restaurant) => (

              <div
                key={restaurant._id}
                className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:shadow-xl"
              >

                {/* ================= IMAGE ================= */}

                {restaurant.image ? (

                  <img
                    src={`http://localhost:3001${restaurant.image}`}
                    alt={restaurant.name}
                    className="h-52 w-full object-cover"
                  />

                ) : (

                  <div className="flex h-52 items-center justify-center bg-gray-100 text-6xl">
                    🏪
                  </div>

                )}

                {/* ================= DETAILS ================= */}

                <div className="p-5">

                  <h2 className="text-xl font-bold text-gray-800">
                    {restaurant.name}
                  </h2>

                  <p className="mt-2 text-sm font-semibold text-orange-600">
                    {restaurant.cuisine ||
                      "Cuisine not available"}
                  </p>

                  <p className="mt-3 text-sm text-gray-600">
                    {restaurant.description ||
                      "No description available"}
                  </p>

                  {/* ================= RESTAURANT INFO ================= */}

                  <div className="mt-4 space-y-2 text-sm">

                    <p>
                      <span className="font-semibold">
                        Location:
                      </span>{" "}
                      {restaurant.location?.city ||
                        "N/A"}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Price:
                      </span>{" "}
                      {restaurant.priceRange ||
                        "₹"}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Rating:
                      </span>{" "}
                      ⭐ {restaurant.rating || 0}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Reviews:
                      </span>{" "}
                      {restaurant.totalReviews || 0}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Status:
                      </span>{" "}

                      <span
                        className={
                          restaurant.isOpen
                            ? "font-semibold text-green-600"
                            : "font-semibold text-red-500"
                        }
                      >
                        {restaurant.isOpen
                          ? "Open"
                          : "Closed"}
                      </span>

                    </p>

                  </div>

                  {/* ================= ACTIONS ================= */}

                  <div className="mt-5 flex gap-3">

                    {/* EDIT */}

                    <button
                      onClick={() =>
                        handleEditClick(restaurant)
                      }
                      className="flex-1 rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
                    >
                      Edit
                    </button>

                    {/* DELETE */}

                    <button
                      onClick={() =>
                        handleDelete(
                          restaurant._id
                        )
                      }
                      className="flex-1 rounded-lg bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* ================================================= */}
      {/* ================= EDIT MODAL ==================== */}
      {/* ================================================= */}

      {editingRestaurant && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">

            {/* ================= MODAL HEADER ================= */}

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Edit Restaurant
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Update restaurant information
                </p>
              </div>

              <button
                onClick={() =>
                  setEditingRestaurant(null)
                }
                className="text-2xl font-bold text-gray-500 hover:text-red-500"
              >
                ✕
              </button>

            </div>

            {/* ================= FORM ================= */}

            <form
              onSubmit={handleUpdate}
              className="mt-6 space-y-5"
            >

              {/* NAME */}

              <div>

                <label className="font-semibold text-gray-700">
                  Restaurant Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  required
                  className="mt-2 w-full rounded-lg border px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="font-semibold text-gray-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  rows="3"
                  className="mt-2 w-full rounded-lg border px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />

              </div>

              {/* CUISINE */}

              <div>

                <label className="font-semibold text-gray-700">
                  Cuisine
                </label>

                <input
                  type="text"
                  name="cuisine"
                  value={editForm.cuisine}
                  onChange={handleEditChange}
                  required
                  className="mt-2 w-full rounded-lg border px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />

              </div>

              {/* PRICE RANGE */}

              <div>

                <label className="font-semibold text-gray-700">
                  Price Range
                </label>

                <select
                  name="priceRange"
                  value={editForm.priceRange}
                  onChange={handleEditChange}
                  className="mt-2 w-full rounded-lg border px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                >

                  <option value="">
                    Select Price Range
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

              {/* LOCATION */}

              <div>

                <label className="font-semibold text-gray-700">
                  City
                </label>

                <input
                  type="text"
                  name="location"
                  value={editForm.location}
                  onChange={handleEditChange}
                  className="mt-2 w-full rounded-lg border px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />

              </div>

              {/* OPENING HOURS */}

              <div>

                <label className="font-semibold text-gray-700">
                  Opening Hours
                </label>

                <input
                  type="text"
                  name="openingHours"
                  value={editForm.openingHours}
                  onChange={handleEditChange}
                  placeholder="10:00 AM - 10:00 PM"
                  className="mt-2 w-full rounded-lg border px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />

              </div>

              {/* ================= BUTTONS ================= */}

              <div className="flex gap-3 pt-3">

                <button
                  type="button"
                  onClick={() =>
                    setEditingRestaurant(null)
                  }
                  className="flex-1 rounded-lg bg-gray-500 px-5 py-3 font-semibold text-white hover:bg-gray-600"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
                >
                  Update Restaurant
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminRestaurants;