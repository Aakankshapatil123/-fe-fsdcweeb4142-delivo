import { useEffect, useState } from "react";

import {
  getRestaurantMenu,
  createMenu,
  updateMenu,
  deleteMenu,
} from "../services/restaurantOwnerServices";

const initialFormData = {
  name: "",
  description: "",
  category: "",
  foodType: "veg",
  price: "",
  isAvailable: true,
  extras: "",
  nutrition: "",
  image: null,
};

const RestaurantMenu = () => {
  // =====================================================
  // STATES
  // =====================================================

  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);

  const [formData, setFormData] = useState(initialFormData);
  const [saving, setSaving] = useState(false);

  // =====================================================
  // FETCH MENUS
  // =====================================================

  const fetchMenus = async () => {
    try {
      setLoading(true);

      const response = await getRestaurantMenu();

      console.log("MENU RESPONSE:", response);

      if (Array.isArray(response?.result)) {
        setMenus(response.result);
      } else if (Array.isArray(response?.menus)) {
        setMenus(response.menus);
      } else if (Array.isArray(response?.data)) {
        setMenus(response.data);
      } else {
        setMenus([]);
      }
    } catch (error) {
      console.error(
        "GET MENU ERROR:",
        error.response?.data?.message || error.message
      );

      setMenus([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD MENUS
  // =====================================================

  useEffect(() => {
    fetchMenus();
  }, []);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
      files,
    } = event.target;

    // File
    if (type === "file") {
      setFormData((previous) => ({
        ...previous,
        image: files?.[0] || null,
      }));

      return;
    }

    // Checkbox
    if (type === "checkbox") {
      setFormData((previous) => ({
        ...previous,
        [name]: checked,
      }));

      return;
    }

    // Normal input/select
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setFormData({
      ...initialFormData,
      image: null,
    });

    setEditingMenu(null);
    setShowForm(false);
  };

  // =====================================================
  // ADD MENU
  // =====================================================

  const handleAddMenu = () => {
    setEditingMenu(null);

    setFormData({
      ...initialFormData,
      image: null,
    });

    setShowForm(true);
  };

  // =====================================================
  // EDIT MENU
  // =====================================================

  const handleEdit = (menu) => {
    setEditingMenu(menu);

    setFormData({
      name: menu.name || "",
      description: menu.description || "",
      category: menu.category || "",

      foodType:
        String(menu.foodType || "veg")
          .trim()
          .toLowerCase() === "non-veg"
          ? "non-veg"
          : "veg",

      price: menu.price ?? "",

      isAvailable:
        menu.isAvailable ?? true,

      extras: Array.isArray(menu.extras)
        ? JSON.stringify(menu.extras)
        : menu.extras || "",

      nutrition:
        menu.nutrition &&
        typeof menu.nutrition === "object"
          ? JSON.stringify(menu.nutrition)
          : menu.nutrition || "",

      image: null,
    });

    setShowForm(true);
  };

  // =====================================================
  // VALIDATE JSON
  // =====================================================

  const validateJSON = (value, fieldName) => {
    if (!value.trim()) {
      return true;
    }

    try {
      JSON.parse(value);
      return true;
    } catch (error) {
      alert(`${fieldName} must contain valid JSON.`);
      return false;
    }
  };

  // =====================================================
  // SUBMIT FORM
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate Extras
    if (!validateJSON(formData.extras, "Extras")) {
      return;
    }

    // Validate Nutrition
    if (!validateJSON(formData.nutrition, "Nutrition")) {
      return;
    }

    try {
      setSaving(true);

      const data = new FormData();

      // Basic fields
      data.append("name", formData.name.trim());

      data.append(
        "description",
        formData.description.trim()
      );

      data.append(
        "category",
        formData.category.trim()
      );

      data.append(
        "foodType",
        formData.foodType
      );

      data.append(
        "price",
        formData.price
      );

      data.append(
        "isAvailable",
        String(formData.isAvailable)
      );

      // Extras
      if (formData.extras.trim()) {
        data.append(
          "extras",
          formData.extras.trim()
        );
      }

      // Nutrition
      if (formData.nutrition.trim()) {
        data.append(
          "nutrition",
          formData.nutrition.trim()
        );
      }

      // Image
      if (formData.image) {
        data.append(
          "menuImage",
          formData.image
        );
      }

      // =================================================
      // UPDATE MENU
      // =================================================

      if (editingMenu) {
        const response = await updateMenu(
          editingMenu._id,
          data
        );

        console.log(
          "UPDATE MENU RESPONSE:",
          response
        );

        alert("Menu updated successfully");
      }

      // =================================================
      // CREATE MENU
      // =================================================

      else {
        const response = await createMenu(data);

        console.log(
          "CREATE MENU RESPONSE:",
          response
        );

        alert("Menu created successfully");
      }

      resetForm();

      await fetchMenus();
    } catch (error) {
      console.error(
        "MENU SAVE ERROR:",
        error.response?.data?.message ||
          error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to save menu"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE MENU
  // =====================================================

  const handleDelete = async (menuId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this menu?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteMenu(menuId);

      alert("Menu deleted successfully");

      await fetchMenus();
    } catch (error) {
      console.error(
        "DELETE MENU ERROR:",
        error.response?.data?.message ||
          error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete menu"
      );
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg font-semibold text-gray-600">
          Loading menus...
        </p>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

          <div>
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Menu Management
            </h1>

            <p className="mt-2 text-gray-600">
              Manage all menu items of your restaurant
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddMenu}
            className="rounded-lg bg-green-500 px-6 py-3 font-semibold text-white transition hover:bg-green-600"
          >
            + Add Menu
          </button>
        </div>

        {/* =================================================
            ADD / EDIT FORM
        ================================================= */}

        {showForm && (
          <div className="mt-8 rounded-2xl bg-white p-6 shadow-md">

            {/* FORM HEADER */}

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingMenu
                    ? "Edit Menu"
                    : "Add New Menu"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Enter menu item details below
                </p>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="text-2xl font-bold text-gray-400 hover:text-red-500"
              >
                ✕
              </button>

            </div>

            {/* =================================================
                FORM
            ================================================= */}

            <form
              onSubmit={handleSubmit}
              className="mt-6 grid gap-5 md:grid-cols-2"
            >

              {/* NAME */}

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Menu Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Chicken Biryani"
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-green-500"
                />
              </div>

              {/* CATEGORY */}

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Biryani"
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-green-500"
                />
              </div>

              {/* =================================================
                  FOOD TYPE
              ================================================= */}

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Food Type
                </label>

                <select
                  name="foodType"
                  value={formData.foodType}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white p-3 outline-none focus:border-green-500"
                >
                  <option value="veg">
                    Veg
                  </option>

                  <option value="non-veg">
                    Non-Veg
                  </option>
                </select>
              </div>

              {/* PRICE */}

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="250"
                  min="0"
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-green-500"
                />
              </div>

              {/* IMAGE */}

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Menu Image
                </label>

                <input
                  type="file"
                  name="menuImage"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 p-3"
                />

                {editingMenu?.image && (
                  <p className="mt-2 text-sm text-gray-500">
                    Current image will remain if no new image is selected.
                  </p>
                )}
              </div>

              {/* DESCRIPTION */}

              <div className="md:col-span-2">

                <label className="mb-2 block font-semibold text-gray-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Delicious chicken biryani with basmati rice..."
                  rows="4"
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-green-500"
                />

              </div>

              {/* EXTRAS */}

              <div>

                <label className="mb-2 block font-semibold text-gray-700">
                  Extras
                </label>

                <textarea
                  name="extras"
                  value={formData.extras}
                  onChange={handleChange}
                  placeholder='[{"name":"Extra Cheese","price":30}]'
                  rows="4"
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-green-500"
                />

                <p className="mt-1 text-xs text-gray-500">
                  Example: [{"{"}"name":"Extra Cheese","price":30{"}"}]
                </p>

              </div>

              {/* NUTRITION */}

              <div>

                <label className="mb-2 block font-semibold text-gray-700">
                  Nutrition
                </label>

                <textarea
                  name="nutrition"
                  value={formData.nutrition}
                  onChange={handleChange}
                  placeholder='{"calories":450,"protein":"20g"}'
                  rows="4"
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-green-500"
                />

                <p className="mt-1 text-xs text-gray-500">
                  Example: {"{"}"calories":450,"protein":"20g"{"}"}
                </p>

              </div>

              {/* AVAILABLE */}

              <div className="flex items-center gap-3 md:col-span-2">

                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleChange}
                  className="h-5 w-5"
                />

                <label className="font-semibold text-gray-700">
                  Menu Available
                </label>

              </div>

              {/* BUTTONS */}

              <div className="flex flex-wrap gap-4 md:col-span-2">

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-green-500 px-7 py-3 font-semibold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingMenu
                    ? "Update Menu"
                    : "Add Menu"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                  className="rounded-lg bg-gray-500 px-7 py-3 font-semibold text-white transition hover:bg-gray-600 disabled:opacity-60"
                >
                  Cancel
                </button>

              </div>

            </form>
          </div>
        )}

        {/* =================================================
            MENU COUNT
        ================================================= */}

        <div className="mt-8">
          <p className="font-semibold text-gray-700">
            Total Menu Items:{" "}
            <span className="text-green-600">
              {menus.length}
            </span>
          </p>
        </div>

        {/* =================================================
            NO MENU
        ================================================= */}

        {menus.length === 0 ? (

          <div className="mt-6 rounded-2xl bg-white p-12 text-center shadow-md">

            <div className="text-6xl">
              🍽️
            </div>

            <h2 className="mt-5 text-2xl font-bold text-gray-800">
              No Menu Items Found
            </h2>

            <p className="mt-2 text-gray-500">
              Add your first menu item.
            </p>

            <button
              type="button"
              onClick={handleAddMenu}
              className="mt-6 rounded-lg bg-green-500 px-6 py-3 font-semibold text-white hover:bg-green-600"
            >
              + Add First Menu
            </button>

          </div>

        ) : (

          /* =================================================
             MENU GRID
          ================================================= */

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {menus.map((menu) => (

              <div
                key={menu._id}
                className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
              >

                {/* IMAGE */}

                {menu.image ? (

                  <img
                    src={`http://localhost:3001${menu.image}`}
                    alt={menu.name}
                    className="h-52 w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />

                ) : (

                  <div className="flex h-52 items-center justify-center bg-gray-100 text-6xl">
                    🍽️
                  </div>

                )}

                {/* DETAILS */}

                <div className="p-5">

                  {/* NAME + STATUS */}

                  <div className="flex items-start justify-between gap-3">

                    <h2 className="text-xl font-bold text-gray-900">
                      {menu.name}
                    </h2>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                        menu.isAvailable
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {menu.isAvailable
                        ? "Available"
                        : "Unavailable"}
                    </span>

                  </div>

                  {/* FOOD TYPE */}

                  <div className="mt-3">

                    <span
                      className={`rounded-md px-2 py-1 text-xs font-semibold ${
                        String(menu.foodType || "")
                          .trim()
                          .toLowerCase() === "veg"
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {String(menu.foodType || "Food")
                        .trim()
                        .toLowerCase() === "non-veg"
                        ? "Non-Veg"
                        : "Veg"}
                    </span>

                  </div>

                  {/* DESCRIPTION */}

                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
                    {menu.description ||
                      "No description available."}
                  </p>

                  {/* PRICE */}

                  <p className="mt-4 text-xl font-bold text-orange-500">
                    ₹{menu.price}
                  </p>

                  {/* CATEGORY */}

                  <p className="mt-2 text-sm text-gray-500">
                    Category:{" "}
                    <span className="font-semibold text-gray-700">
                      {menu.category || "N/A"}
                    </span>
                  </p>

                  {/* RESTAURANT */}

                  {menu.restaurant?.name && (
                    <p className="mt-2 text-sm text-gray-500">
                      Restaurant:{" "}
                      <span className="font-semibold text-gray-700">
                        {menu.restaurant.name}
                      </span>
                    </p>
                  )}

                  {/* ACTION BUTTONS */}

                  <div className="mt-5 grid grid-cols-2 gap-3">

                    <button
                      type="button"
                      onClick={() => handleEdit(menu)}
                      className="rounded-lg bg-blue-500 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(menu._id)
                      }
                      className="rounded-lg bg-red-500 px-4 py-2.5 font-semibold text-white transition hover:bg-red-600"
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
    </div>
  );
};

export default RestaurantMenu;