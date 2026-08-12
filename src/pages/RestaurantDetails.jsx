import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";

import { getRestaurantById } from "../services/restaurantServices";
import { getRestaurantMenu } from "../services/menuServices";
import { addToCart } from "../redux/cartSlice";

import MenuCard from "../components/MenuCard";

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ================= AUTH =================

  const { isAuthenticated } = useSelector(
    (state) => state.auth
  );

  // ================= STATE =================

  const [restaurant, setRestaurant] = useState(null);
  const [menus, setMenus] = useState([]);

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  // Selected menu for customization
  const [selectedMenu, setSelectedMenu] =
    useState(null);

  // Selected extras
  const [selectedExtras, setSelectedExtras] =
    useState([]);

  // Special instructions
  const [specialInstructions, setSpecialInstructions] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= FETCH RESTAURANT + MENU =================

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        // Restaurant details
        const restaurantResponse =
          await getRestaurantById(id);

        console.log(
          "RESTAURANT DETAILS:",
          restaurantResponse
        );

        setRestaurant(
          restaurantResponse.restaurant
        );

        // Restaurant menu
        const menuResponse =
          await getRestaurantMenu(id);

        console.log(
          "RESTAURANT MENU:",
          menuResponse
        );

        setMenus(menuResponse.menus || []);
      } catch (error) {
        console.log(
          "RESTAURANT DETAILS ERROR:",
          error.response?.data?.message ||
            error.message
        );

        setError(
          "Failed to load restaurant details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, [id]);

  // ================= MENU CATEGORIES =================

  const categories = [
    "All",
    ...new Set(
      menus
        .map((menu) => menu.category)
        .filter(Boolean)
    ),
  ];

  // ================= FILTER MENU =================

  const filteredMenus =
    selectedCategory === "All"
      ? menus
      : menus.filter(
          (menu) =>
            menu.category === selectedCategory
        );

  // ================= OPEN CUSTOMIZATION =================

  const openCustomization = (menu) => {
    // Login required for Add to Cart
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setSelectedMenu(menu);
    setSelectedExtras([]);
    setSpecialInstructions("");
  };

  // ================= CLOSE CUSTOMIZATION =================

  const closeCustomization = () => {
    setSelectedMenu(null);
    setSelectedExtras([]);
    setSpecialInstructions("");
  };

  // ================= EXTRA SELECT =================

  const handleExtraChange = (extra) => {
    const extraPrice = Number(
      extra.price || 0
    );

    const exists = selectedExtras.some(
      (item) =>
        item.name === extra.name &&
        Number(item.price) === extraPrice
    );

    if (exists) {
      setSelectedExtras((prev) =>
        prev.filter(
          (item) =>
            !(
              item.name === extra.name &&
              Number(item.price) === extraPrice
            )
        )
      );
    } else {
      setSelectedExtras((prev) => [
        ...prev,
        {
          name: extra.name,
          price: extraPrice,
        },
      ]);
    }
  };

  // ================= ADD TO CART =================

  const handleAddToCart = () => {
    if (!selectedMenu || !restaurant) {
      return;
    }

    // Extra total
    const extrasTotal = selectedExtras.reduce(
      (total, extra) =>
        total + Number(extra.price || 0),
      0
    );

    // Final price
    const finalPrice =
      Number(selectedMenu.price || 0) +
      extrasTotal;

    // Unique cart item ID
    const cartItemId = [
      selectedMenu._id,

      ...selectedExtras
        .map(
          (extra) =>
            `${extra.name}-${extra.price}`
        )
        .sort(),

      specialInstructions.trim(),
    ].join("__");

    // Add to Redux cart
    dispatch(
      addToCart({
        cartItemId,

        // Menu
        _id: selectedMenu._id,
        name: selectedMenu.name,
        price: Number(
          selectedMenu.price || 0
        ),
        image: selectedMenu.image,

        // Restaurant
        restaurantId: restaurant._id,
        restaurantName: restaurant.name,

        // Extras
        extras: selectedExtras,
        extrasTotal,

        // Special instructions
        specialInstructions:
          specialInstructions.trim(),

        // Final price
        finalPrice,
      })
    );

    closeCustomization();
  };

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
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-50">
        <div className="text-center">

          <p className="font-semibold text-red-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/restaurants")
            }
            className="mt-4 rounded-lg bg-orange-500 px-5 py-2 font-semibold text-white transition hover:bg-orange-600"
          >
            ← Back to Restaurants
          </button>

        </div>
      </div>
    );
  }

  // ================= RESTAURANT NOT FOUND =================

  if (!restaurant) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-50">
        <p className="text-lg font-semibold text-gray-600">
          Restaurant not found
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================= BACK BUTTON ================= */}

      <div className="mx-auto max-w-7xl px-6 pt-6 md:px-10">

        <button
          type="button"
          onClick={() =>
            navigate("/restaurants")
          }
          className="rounded-lg bg-white px-4 py-2 font-medium text-gray-700 shadow-sm transition hover:bg-gray-100"
        >
          ← Back to Restaurants
        </button>

      </div>

      {/* ================= RESTAURANT IMAGE ================= */}

      <div className="mx-auto mt-6 max-w-7xl px-6 md:px-10">

        <div className="h-72 overflow-hidden rounded-2xl bg-gray-200 md:h-96">

          {restaurant.image ? (
            <img
              src={`http://localhost:3001${restaurant.image}`}
              alt={restaurant.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              No Image
            </div>
          )}

        </div>

      </div>

      {/* ================= RESTAURANT INFORMATION ================= */}

      <div className="mx-auto max-w-7xl px-6 py-8 md:px-10">

        <div className="rounded-2xl bg-white p-6 shadow-md md:p-8">

          {/* Name + Cuisine + Rating + Status */}

          <div className="flex flex-col justify-between gap-4 md:flex-row">

            <div>

              <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                {restaurant.name}
              </h1>

              <p className="mt-2 text-lg font-medium text-gray-500">
                {restaurant.cuisine}
              </p>

            </div>

            <div className="flex items-center gap-3">

              {/* Rating */}

              <span className="rounded-lg bg-green-100 px-4 py-2 font-semibold text-green-700">
                ★ {restaurant.rating ?? 0}
              </span>

              {/* Open / Closed */}

              <span
                className={`rounded-lg px-4 py-2 font-semibold ${
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

          </div>

          {/* Description */}

          <p className="mt-6 leading-7 text-gray-600">
            {restaurant.description ||
              "No description available."}
          </p>

          {/* Restaurant Details */}

          <div className="mt-6 grid gap-4 md:grid-cols-3">

            {/* Location */}

            <div className="rounded-xl bg-gray-50 p-4">

              <p className="text-sm text-gray-500">
                Location
              </p>

              <p className="mt-1 font-semibold text-gray-800">
                📍{" "}
                {restaurant.location?.address ||
                  "Address not available"}
              </p>

              <p className="text-sm text-gray-600">
                {restaurant.location?.city || ""}
                {restaurant.location?.state
                  ? `, ${restaurant.location.state}`
                  : ""}
              </p>

            </div>

            {/* Opening Hours */}

            <div className="rounded-xl bg-gray-50 p-4">

              <p className="text-sm text-gray-500">
                Opening Hours
              </p>

              <p className="mt-1 font-semibold text-gray-800">
                🕒{" "}
                {restaurant.openingHours ||
                  "Not available"}
              </p>

            </div>

            {/* Price Range */}

            <div className="rounded-xl bg-gray-50 p-4">

              <p className="text-sm text-gray-500">
                Price Range
              </p>

              <p className="mt-1 font-semibold text-gray-800">
                {restaurant.priceRange || "₹"}
              </p>

            </div>

          </div>

        </div>

        {/* ================= MENU SECTION ================= */}

        <div className="mt-10">

          {/* Menu Header */}

          <div className="mb-6">

            <h2 className="text-3xl font-bold text-gray-900">
              Menu
            </h2>

            <p className="mt-2 text-gray-600">
              Explore delicious food from{" "}
              {restaurant.name}
            </p>

          </div>

          {/* ================= CATEGORIES ================= */}

          {menus.length > 0 && (
            <div className="mb-8 flex gap-3 overflow-x-auto pb-2">

              {categories.map((category) => (

                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setSelectedCategory(
                      category
                    )
                  }
                  className={`whitespace-nowrap rounded-full px-5 py-2.5 font-semibold transition ${
                    selectedCategory === category
                      ? "bg-orange-500 text-white shadow-md"
                      : "bg-white text-gray-700 shadow-sm hover:bg-orange-50"
                  }`}
                >
                  {category}
                </button>

              ))}

            </div>
          )}

          {/* ================= MENU ITEMS ================= */}

          {menus.length === 0 ? (

            <div className="rounded-2xl bg-white p-12 text-center shadow-md">

              <div className="text-5xl">
                🍽️
              </div>

              <h3 className="mt-4 text-xl font-bold text-gray-800">
                No Menu Available
              </h3>

              <p className="mt-2 text-gray-500">
                This restaurant has not added any menu items yet.
              </p>

            </div>

          ) : filteredMenus.length === 0 ? (

            <div className="rounded-2xl bg-white p-12 text-center shadow-md">

              <div className="text-5xl">
                🍽️
              </div>

              <h3 className="mt-4 text-xl font-bold text-gray-800">
                No Items in This Category
              </h3>

              <p className="mt-2 text-gray-500">
                Try another menu category.
              </p>

              <button
                type="button"
                onClick={() =>
                  setSelectedCategory("All")
                }
                className="mt-5 rounded-lg bg-orange-500 px-5 py-2.5 font-semibold text-white transition hover:bg-orange-600"
              >
                Show All Items
              </button>

            </div>

          ) : (

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {filteredMenus.map((menu) => (

                <MenuCard
                  key={menu._id}
                  menu={menu}
                  onCustomize={openCustomization}
                />

              ))}

            </div>

          )}

        </div>

      </div>

      {/* =====================================================
          CUSTOMIZATION MODAL
      ===================================================== */}

      {selectedMenu && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">

            {/* Modal Header */}

            <div className="flex items-start justify-between gap-4">

              <div>

                <h2 className="text-2xl font-bold text-gray-900">
                  Customize {selectedMenu.name}
                </h2>

                <p className="mt-1 text-gray-500">
                  Base Price: ₹
                  {selectedMenu.price}
                </p>

              </div>

              <button
                type="button"
                onClick={closeCustomization}
                className="text-2xl text-gray-400 transition hover:text-gray-700"
              >
                ✕
              </button>

            </div>

            {/* ================= EXTRAS ================= */}

            <div className="mt-6">

              <h3 className="text-lg font-bold text-gray-900">
                Add Extras
              </h3>

              {selectedMenu.extras &&
              selectedMenu.extras.length > 0 ? (

                <div className="mt-3 space-y-3">

                  {selectedMenu.extras.map(
                    (extra, index) => {

                      const isSelected =
                        selectedExtras.some(
                          (item) =>
                            item.name ===
                              extra.name &&
                            Number(item.price) ===
                              Number(extra.price)
                        );

                      return (
                        <label
                          key={
                            extra._id ||
                            `${extra.name}-${index}`
                          }
                          className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-3 transition hover:bg-orange-50"
                        >

                          <div className="flex items-center gap-3">

                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() =>
                                handleExtraChange(
                                  extra
                                )
                              }
                              className="h-4 w-4 accent-orange-500"
                            />

                            <span className="font-medium text-gray-800">
                              {extra.name}
                            </span>

                          </div>

                          <span className="font-semibold text-orange-500">
                            + ₹{extra.price}
                          </span>

                        </label>
                      );
                    }
                  )}

                </div>

              ) : (

                <p className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-500">
                  No extras available for this item.
                </p>

              )}

            </div>

            {/* ================= SPECIAL INSTRUCTIONS ================= */}

            <div className="mt-6">

              <label className="text-lg font-bold text-gray-900">
                Special Instructions
              </label>

              <textarea
                value={specialInstructions}
                onChange={(e) =>
                  setSpecialInstructions(
                    e.target.value
                  )
                }
                rows="4"
                placeholder="Example: No onion, less spicy..."
                className="mt-3 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />

            </div>

            {/* ================= FINAL PRICE ================= */}

            <div className="mt-6 flex items-center justify-between border-t pt-4">

              <span className="text-lg font-bold text-gray-900">
                Final Price
              </span>

              <span className="text-xl font-bold text-orange-500">
                ₹
                {Number(
                  selectedMenu.price || 0
                ) +
                  selectedExtras.reduce(
                    (total, extra) =>
                      total +
                      Number(extra.price || 0),
                    0
                  )}
              </span>

            </div>

            {/* ================= ADD TO CART ================= */}

            <button
              type="button"
              onClick={handleAddToCart}
              className="mt-5 w-full rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
            >
              Add to Cart
            </button>

          </div>

        </div>
      )}

    </div>
  );
};

export default RestaurantDetails;