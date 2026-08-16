import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";

import {
  getRestaurantProfile,
  updateRestaurantProfile,
} from "../services/restaurantOwnerServices";

const RestaurantEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
  const [image, setImage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    cuisine: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    openingHours: "",
    priceRange: "₹",
    isOpen: true,
  });

  // =====================================================
  // GET RESTAURANT
  // =====================================================

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);

        const response = await getRestaurantProfile();

        console.log("RESTAURANT RESPONSE:", response);

        const restaurants = response?.result || [];

        const foundRestaurant = restaurants.find(
          (item) => String(item._id) === String(id)
        );

        if (!foundRestaurant) {
          toast.error("Restaurant not found");
          navigate("/restaurant/owner");
          return;
        }

        console.log(
          "FOUND RESTAURANT:",
          foundRestaurant
        );

        setRestaurant(foundRestaurant);

        setFormData({
          name: foundRestaurant.name || "",
          description: foundRestaurant.description || "",
          cuisine: foundRestaurant.cuisine || "",

          address:
            foundRestaurant.location?.address || "",

          city:
            foundRestaurant.location?.city || "",

          state:
            foundRestaurant.location?.state || "",

          pincode:
            foundRestaurant.location?.pincode || "",

          openingHours:
            foundRestaurant.openingHours || "",

          priceRange:
            foundRestaurant.priceRange || "₹",

          isOpen:
            foundRestaurant.isOpen ?? true,
        });
      } catch (error) {
        console.error(
          "GET RESTAURANT ERROR:",
          error.response?.data?.message ||
            error.message
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to load restaurant"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id, navigate]);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // IMAGE CHANGE
  // =====================================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ---------------------------------------------------
    // BASIC VALIDATION
    // ---------------------------------------------------

    if (!formData.name.trim()) {
      toast.error("Restaurant name is required");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }

    if (!formData.cuisine.trim()) {
      toast.error("Cuisine is required");
      return;
    }

    // ---------------------------------------------------
    // LOCATION VALIDATION
    // ---------------------------------------------------

    if (!formData.address.trim()) {
      toast.error("Address is required");
      return;
    }

    if (!formData.city.trim()) {
      toast.error("City is required");
      return;
    }

    if (!formData.state.trim()) {
      toast.error("State is required");
      return;
    }

    if (!formData.pincode.trim()) {
      toast.error("Pincode is required");
      return;
    }

    // ---------------------------------------------------
    // PINCODE VALIDATION
    // ---------------------------------------------------

    if (!/^\d{6}$/.test(formData.pincode.trim())) {
      toast.error("Pincode must contain 6 digits");
      return;
    }

    try {
      setSaving(true);

      const data = new FormData();

      // -------------------------------------------------
      // RESTAURANT DETAILS
      // -------------------------------------------------

      data.append(
        "name",
        formData.name.trim()
      );

      data.append(
        "description",
        formData.description.trim()
      );

      data.append(
        "cuisine",
        formData.cuisine.trim()
      );

      // -------------------------------------------------
      // LOCATION
      // IMPORTANT: send complete location object
      // -------------------------------------------------

      const locationData = {
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
      };

      console.log(
        "LOCATION SENT:",
        locationData
      );

      data.append(
        "location",
        JSON.stringify(locationData)
      );

      // -------------------------------------------------
      // OTHER DETAILS
      // -------------------------------------------------

      data.append(
        "openingHours",
        formData.openingHours.trim()
      );

      data.append(
        "priceRange",
        formData.priceRange
      );

      data.append(
        "isOpen",
        String(formData.isOpen)
      );

      // -------------------------------------------------
      // IMAGE
      // -------------------------------------------------

      if (image) {
        data.append(
          "restaurantImage",
          image
        );
      }

      // -------------------------------------------------
      // DEBUG FORMDATA
      // -------------------------------------------------

      console.log(
        "UPDATE RESTAURANT DATA:"
      );

      for (const [key, value] of data.entries()) {
        console.log(key, value);
      }

      // -------------------------------------------------
      // API CALL
      // -------------------------------------------------

      const response =
        await updateRestaurantProfile(
          id,
          data
        );

      console.log(
        "UPDATED RESTAURANT:",
        response
      );

      toast.success(
        response?.message ||
          "Restaurant updated successfully"
      );

      // -------------------------------------------------
      // BACK
      // -------------------------------------------------

      navigate("/restaurant/owner");

    } catch (error) {
      console.error(
        "UPDATE RESTAURANT ERROR:",
        error.response?.data?.message ||
          error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update restaurant"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
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
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50 px-5 py-10 md:px-10">

      <div className="mx-auto max-w-4xl">

        {/* HEADER */}

        <div className="mb-8">

          <button
            type="button"
            onClick={() =>
              navigate("/restaurant/owner")
            }
            className="mb-4 text-sm font-semibold text-orange-500 hover:text-orange-600"
          >
            ← Back to My Restaurant
          </button>

          <h1 className="text-3xl font-bold text-gray-900">
            Edit Restaurant
          </h1>

          <p className="mt-2 text-gray-600">
            Update your restaurant information
          </p>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-6 shadow-md md:p-8"
        >

          {/* RESTAURANT NAME */}

          <div className="mb-6">

            <label className="mb-2 block font-semibold text-gray-700">
              Restaurant Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter restaurant name"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />

          </div>

          {/* DESCRIPTION */}

          <div className="mb-6">

            <label className="mb-2 block font-semibold text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Enter restaurant description"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />

          </div>

          {/* CUISINE */}

          <div className="mb-6">

            <label className="mb-2 block font-semibold text-gray-700">
              Cuisine
            </label>

            <input
              type="text"
              name="cuisine"
              value={formData.cuisine}
              onChange={handleChange}
              placeholder="Example: Indian, Chinese, Italian"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />

          </div>

          {/* LOCATION */}

          <div className="mb-6">

            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Location
            </h2>

            <div className="space-y-4">

              {/* ADDRESS */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Address
                </label>

                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter full address"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                />

              </div>

              <div className="grid gap-4 md:grid-cols-2">

                {/* CITY */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                  />

                </div>

                {/* STATE */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                  />

                </div>

              </div>

              {/* PINCODE */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Pincode
                </label>

                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  maxLength={6}
                  placeholder="Enter 6 digit pincode"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                />

              </div>

            </div>

          </div>

          {/* OPENING HOURS */}

          <div className="mb-6">

            <label className="mb-2 block font-semibold text-gray-700">
              Opening Hours
            </label>

            <input
              type="text"
              name="openingHours"
              value={formData.openingHours}
              onChange={handleChange}
              placeholder="Example: 10:00 AM - 11:00 PM"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
            />

          </div>

          {/* PRICE RANGE */}

          <div className="mb-6">

            <label className="mb-2 block font-semibold text-gray-700">
              Price Range
            </label>

            <select
              name="priceRange"
              value={formData.priceRange}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-orange-500"
            >

              <option value="₹">₹</option>
              <option value="₹₹">₹₹</option>
              <option value="₹₹₹">₹₹₹</option>
              <option value="₹₹₹₹">₹₹₹₹</option>

            </select>

          </div>

          {/* RESTAURANT STATUS */}

          <div className="mb-6">

            <label className="mb-2 block font-semibold text-gray-700">
              Restaurant Status
            </label>

            <select
              name="isOpen"
              value={
                formData.isOpen
                  ? "true"
                  : "false"
              }
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isOpen:
                    e.target.value ===
                    "true",
                }))
              }
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-orange-500"
            >

              <option value="true">
                Open
              </option>

              <option value="false">
                Closed
              </option>

            </select>

          </div>

          {/* CURRENT IMAGE */}

          {restaurant?.image && (
            <div className="mb-6">

              <label className="mb-2 block font-semibold text-gray-700">
                Current Restaurant Image
              </label>

              <img
                src={`http://localhost:3001${restaurant.image}`}
                alt={
                  restaurant.name ||
                  "Restaurant"
                }
                className="h-48 w-full rounded-xl object-cover md:w-80"
              />

            </div>
          )}

          {/* NEW IMAGE */}

          <div className="mb-8">

            <label className="mb-2 block font-semibold text-gray-700">
              Change Restaurant Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full rounded-xl border border-gray-300 p-3"
            />

            {image && (
              <p className="mt-2 text-sm text-gray-500">
                Selected: {image.name}
              </p>
            )}

          </div>

          {/* BUTTONS */}

          <div className="flex flex-col gap-3 sm:flex-row">

            <button
              type="button"
              onClick={() =>
                navigate("/restaurant/owner")
              }
              className="w-full rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Updating..."
                : "Update Restaurant"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default RestaurantEdit;