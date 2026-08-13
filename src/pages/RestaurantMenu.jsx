import { useEffect, useState } from "react";
import {
  getRestaurantMenu,
  createMenu,
  updateMenu,
  deleteMenu,
} from "../services/restaurantOwnerServices";

const RestaurantMenu = () => {
  // ================= STATES =================

  const [menus, setMenus] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [editingMenu, setEditingMenu] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    isAvailable: true,
    extras: "",
    nutrition: "",
    image: null,
  });

  // ================= FETCH MENU =================

  const fetchMenus = async () => {
    try {
      setLoading(true);

      const response = await getRestaurantMenu();

      setMenus(response.menus || []);
    } catch (error) {
      console.log(
        "GET MENU ERROR:",
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  // ================= HANDLE INPUT =================

  const handleChange = (event) => {
    const { name, value, type, checked, files } = event.target;

    if (type === "file") {
      setFormData((previous) => ({
        ...previous,
        image: files[0] || null,
      }));
    } else if (type === "checkbox") {
      setFormData((previous) => ({
        ...previous,
        [name]: checked,
      }));
    } else {
      setFormData((previous) => ({
        ...previous,
        [name]: value,
      }));
    }
  };

  // ================= RESET FORM =================

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      price: "",
      isAvailable: true,
      extras: "",
      nutrition: "",
      image: null,
    });

    setEditingMenu(null);
    setShowForm(false);
  };

  // ================= ADD MENU =================

  const handleAddMenu = () => {
    setEditingMenu(null);

    setFormData({
      name: "",
      description: "",
      category: "",
      price: "",
      isAvailable: true,
      extras: "",
      nutrition: "",
      image: null,
    });

    setShowForm(true);
  };

  // ================= EDIT MENU =================

  const handleEdit = (menu) => {
    setEditingMenu(menu);

    setFormData({
      name: menu.name || "",
      description: menu.description || "",
      category: menu.category || "",
      price: menu.price || "",
      isAvailable: menu.isAvailable ?? true,
      extras: menu.extras
        ? JSON.stringify(menu.extras)
        : "",
      nutrition: menu.nutrition
        ? JSON.stringify(menu.nutrition)
        : "",
      image: null,
    });

    setShowForm(true);
  };

  // ================= SUBMIT FORM =================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("price", formData.price);
      data.append(
        "isAvailable",
        formData.isAvailable
      );

      if (formData.extras) {
        data.append("extras", formData.extras);
      }

      if (formData.nutrition) {
        data.append(
          "nutrition",
          formData.nutrition
        );
      }

      if (formData.image) {
        data.append(
          "menuImage",
          formData.image
        );
      }

      // ================= UPDATE =================

      if (editingMenu) {
        await updateMenu(
          editingMenu._id,
          data
        );

        alert("Menu updated successfully");
      }

      // ================= CREATE =================

      else {
        await createMenu(data);

        alert("Menu created successfully");
      }

      resetForm();

      await fetchMenus();

    } catch (error) {
      console.log(
        "MENU SAVE ERROR:",
        error.response?.data?.message ||
          error.message
      );

      alert(
        error.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  // ================= DELETE MENU =================

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
      console.log(
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

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg font-semibold text-gray-600">
          Loading menu...
        </p>
      </div>
    );
  }

  // ================= UI =================

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 md:px-10">

      <div className="mx-auto max-w-7xl">

        {/* ================= HEADER ================= */}

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

          <div>
            <h1 className="text-3xl font-bold text-gray-800 md:text-4xl">
              Menu Management
            </h1>

            <p className="mt-2 text-gray-600">
              Manage your restaurant menu
            </p>
          </div>

          <button
            onClick={handleAddMenu}
            className="rounded-lg bg-green-500 px-5 py-3 font-semibold text-white hover:bg-green-600"
          >
            + Add Menu
          </button>

        </div>

        {/* ================= ADD / EDIT FORM ================= */}

        {showForm && (
          <div className="mt-8 rounded-2xl bg-white p-6 shadow-md">

            <div className="flex items-center justify-between">

              <h2 className="text-2xl font-bold text-gray-800">
                {editingMenu
                  ? "Edit Menu"
                  : "Add New Menu"}
              </h2>

              <button
                type="button"
                onClick={resetForm}
                className="text-2xl text-gray-500 hover:text-red-500"
              >
                ✕
              </button>

            </div>

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
                  placeholder="Cheese Burger"
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
                  placeholder="Burger"
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-green-500"
                />
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
                  placeholder="150"
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
                  placeholder="Delicious cheese burger..."
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
                  placeholder='Example: [{"name":"Extra Cheese","price":30}]'
                  rows="3"
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-green-500"
                />

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
                  placeholder='Example: {"calories":450,"protein":"20g"}'
                  rows="3"
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-green-500"
                />

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

              <div className="flex gap-4 md:col-span-2">

                <button
                  type="submit"
                  className="rounded-lg bg-green-500 px-6 py-3 font-semibold text-white hover:bg-green-600"
                >
                  {editingMenu
                    ? "Update Menu"
                    : "Add Menu"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg bg-gray-500 px-6 py-3 font-semibold text-white hover:bg-gray-600"
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>
        )}

        {/* ================= MENU LIST ================= */}

        {menus.length === 0 ? (

          <div className="mt-10 rounded-2xl bg-white p-10 text-center shadow-md">

            <div className="text-5xl">
              🍽️
            </div>

            <h2 className="mt-4 text-xl font-bold text-gray-800">
              No menu items found
            </h2>

            <p className="mt-2 text-gray-600">
              Start adding items to your restaurant menu.
            </p>

          </div>

        ) : (

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

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
                    className="h-48 w-full object-cover"
                  />

                ) : (

                  <div className="flex h-48 items-center justify-center bg-gray-100 text-5xl">
                    🍽️
                  </div>

                )}

                {/* DETAILS */}

                <div className="p-5">

                  <div className="flex items-start justify-between gap-3">

                    <h2 className="text-xl font-bold text-gray-800">
                      {menu.name}
                    </h2>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
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

                  <p className="mt-2 text-sm text-gray-600">
                    {menu.description ||
                      "No description"}
                  </p>

                  <p className="mt-3 font-bold text-orange-500">
                    ₹{menu.price}
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    Category: {menu.category}
                  </p>

                  {/* ACTIONS */}

                  <div className="mt-5 flex gap-3">

                    <button
                      onClick={() =>
                        handleEdit(menu)
                      }
                      className="flex-1 rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(menu._id)
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

    </div>
  );
};

export default RestaurantMenu;