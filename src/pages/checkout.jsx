import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";

import { createOrder } from "../services/orderServices";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector(
    (state) => state.cart.items
  );

  // ================= DELIVERY DETAILS =================

  const [deliveryDetails, setDeliveryDetails] =
    useState({
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    });

  // ================= DELIVERY TYPE =================

  const [deliveryType, setDeliveryType] =
    useState("Immediate");

  const [scheduledDeliveryTime, setScheduledDeliveryTime] =
    useState("");

  // ================= PAYMENT METHOD =================

  const [paymentMethod, setPaymentMethod] =
    useState("Cash on Delivery");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // ================= HANDLE INPUT =================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setDeliveryDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= CART TOTAL =================

  const subtotal = cartItems.reduce(
    (total, item) => {
      const itemPrice = Number(
        item.finalPrice ?? item.price ?? 0
      );

      return (
        total +
        itemPrice * Number(item.quantity || 0)
      );
    },
    0
  );

  const deliveryFee =
    cartItems.length > 0 ? 40 : 0;

  const total = subtotal + deliveryFee;

  // ================= PLACE ORDER =================

  const handlePlaceOrder = async () => {
    try {
      setError("");

      // Empty cart check
      if (cartItems.length === 0) {
        setError("Your cart is empty.");
        return;
      }

      // Delivery validation
      if (
        !deliveryDetails.address.trim() ||
        !deliveryDetails.city.trim() ||
        !deliveryDetails.state.trim() ||
        !deliveryDetails.pincode.trim()
      ) {
        setError(
          "Please fill all delivery address details."
        );
        return;
      }

      // Scheduled validation
      if (
        deliveryType === "Scheduled" &&
        !scheduledDeliveryTime
      ) {
        setError(
          "Please select a scheduled delivery time."
        );
        return;
      }

      setLoading(true);

      // ================= RESTAURANT =================

      const restaurantId =
        cartItems[0]?.restaurantId;

      if (!restaurantId) {
        setError(
          "Restaurant information is missing from cart."
        );
        setLoading(false);
        return;
      }

      // ================= ORDER ITEMS =================

      const orderItems = cartItems.map((item) => ({
        name: item.name,

        quantity: Number(
          item.quantity || 1
        ),

        price: Number(
          item.price || 0
        ),

        extras: Array.isArray(item.extras)
          ? item.extras.map((extra) => ({
              name: extra.name,
              price: Number(
                extra.price || 0
              ),
            }))
          : [],

        specialInstructions:
          item.specialInstructions || "",
      }));

      // ================= ORDER DATA =================

      const orderData = {
        restaurant: restaurantId,

        items: orderItems,

        totalAmount: Number(total),

        paymentMethod,

        deliveryType,

        scheduledDeliveryTime:
          deliveryType === "Scheduled"
            ? scheduledDeliveryTime
            : undefined,

        deliveryAddress: {
          address:
            deliveryDetails.address.trim(),

          city:
            deliveryDetails.city.trim(),

          state:
            deliveryDetails.state.trim(),

          pincode:
            deliveryDetails.pincode.trim(),
        },
      };

      console.log(
        "ORDER DATA:",
        orderData
      );

      // ================= CREATE ORDER =================

      const response =
        await createOrder(orderData);

      console.log(
        "ORDER CREATED:",
        response
      );

      // ================= SUCCESS =================

      navigate("/orders");

    } catch (error) {
      console.log(
        "CREATE ORDER ERROR:",
        error.response?.data?.message ||
          error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to place order."
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= EMPTY CART =================

  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-6">

        <div className="rounded-2xl bg-white p-10 text-center shadow-md">

          <h2 className="text-2xl font-bold text-gray-800">
            Your Cart is Empty
          </h2>

          <p className="mt-2 text-gray-500">
            Add some food items before checkout.
          </p>

          <Link
            to="/restaurants"
            className="mt-6 inline-block rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
          >
            Browse Restaurants
          </Link>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 md:px-10">

      <div className="mx-auto max-w-6xl">

        {/* ================= HEADER ================= */}

        <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
          Checkout
        </h1>

        <p className="mt-2 text-gray-600">
          Complete your order
        </p>

        {/* ERROR */}

        {error && (
          <div className="mt-6 rounded-lg bg-red-100 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-3">

          {/* =====================================================
              DELIVERY DETAILS
          ===================================================== */}

          <div className="rounded-2xl bg-white p-6 shadow-md lg:col-span-2">

            <h2 className="text-2xl font-bold text-gray-900">
              Delivery Details
            </h2>

            <div className="mt-6 space-y-4">

              {/* Name */}

              <div>

                <label className="mb-2 block font-medium text-gray-700">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={deliveryDetails.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                />

              </div>

              {/* Phone */}

              <div>

                <label className="mb-2 block font-medium text-gray-700">
                  Phone Number
                </label>

                <input
                  type="text"
                  name="phone"
                  value={deliveryDetails.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                />

              </div>

              {/* Address */}

              <div>

                <label className="mb-2 block font-medium text-gray-700">
                  Address
                </label>

                <textarea
                  name="address"
                  value={deliveryDetails.address}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Enter delivery address"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                />

              </div>

              {/* City + State */}

              <div className="grid gap-4 md:grid-cols-2">

                <div>

                  <label className="mb-2 block font-medium text-gray-700">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={deliveryDetails.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                  />

                </div>

                <div>

                  <label className="mb-2 block font-medium text-gray-700">
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={deliveryDetails.state}
                    onChange={handleChange}
                    placeholder="State"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                  />

                </div>

              </div>

              {/* Pincode */}

              <div>

                <label className="mb-2 block font-medium text-gray-700">
                  Pincode
                </label>

                <input
                  type="text"
                  name="pincode"
                  value={deliveryDetails.pincode}
                  onChange={handleChange}
                  placeholder="Pincode"
                  maxLength="6"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                />

              </div>

              {/* =================================================
                  DELIVERY TYPE
              ================================================= */}

              <div className="border-t pt-5">

                <h3 className="text-lg font-bold text-gray-900">
                  Delivery Type
                </h3>

                <div className="mt-3 space-y-3">

                  <label className="flex cursor-pointer items-center gap-3">

                    <input
                      type="radio"
                      name="deliveryType"
                      value="Immediate"
                      checked={
                        deliveryType ===
                        "Immediate"
                      }
                      onChange={(event) =>
                        setDeliveryType(
                          event.target.value
                        )
                      }
                      className="h-4 w-4 accent-orange-500"
                    />

                    <span className="font-medium text-gray-700">
                      Immediate Delivery
                    </span>

                  </label>

                  <label className="flex cursor-pointer items-center gap-3">

                    <input
                      type="radio"
                      name="deliveryType"
                      value="Scheduled"
                      checked={
                        deliveryType ===
                        "Scheduled"
                      }
                      onChange={(event) =>
                        setDeliveryType(
                          event.target.value
                        )
                      }
                      className="h-4 w-4 accent-orange-500"
                    />

                    <span className="font-medium text-gray-700">
                      Scheduled Delivery
                    </span>

                  </label>

                </div>

                {/* Scheduled Date/Time */}

                {deliveryType ===
                  "Scheduled" && (
                  <div className="mt-4">

                    <label className="mb-2 block font-medium text-gray-700">
                      Select Delivery Date & Time
                    </label>

                    <input
                      type="datetime-local"
                      value={
                        scheduledDeliveryTime
                      }
                      onChange={(event) =>
                        setScheduledDeliveryTime(
                          event.target.value
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                    />

                  </div>
                )}

              </div>

              {/* =================================================
                  PAYMENT METHOD
              ================================================= */}

              <div className="border-t pt-5">

                <h3 className="text-lg font-bold text-gray-900">
                  Payment Method
                </h3>

                <div className="mt-3 space-y-3">

                  <label className="flex cursor-pointer items-center gap-3">

                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash on Delivery"
                      checked={
                        paymentMethod ===
                        "Cash on Delivery"
                      }
                      onChange={(event) =>
                        setPaymentMethod(
                          event.target.value
                        )
                      }
                      className="h-4 w-4 accent-orange-500"
                    />

                    <span className="font-medium text-gray-700">
                      Cash on Delivery
                    </span>

                  </label>

                  <label className="flex cursor-pointer items-center gap-3">

                    <input
                      type="radio"
                      name="paymentMethod"
                      value="UPI"
                      checked={
                        paymentMethod === "UPI"
                      }
                      onChange={(event) =>
                        setPaymentMethod(
                          event.target.value
                        )
                      }
                      className="h-4 w-4 accent-orange-500"
                    />

                    <span className="font-medium text-gray-700">
                      UPI
                    </span>

                  </label>

                  <label className="flex cursor-pointer items-center gap-3">

                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Card"
                      checked={
                        paymentMethod === "Card"
                      }
                      onChange={(event) =>
                        setPaymentMethod(
                          event.target.value
                        )
                      }
                      className="h-4 w-4 accent-orange-500"
                    />

                    <span className="font-medium text-gray-700">
                      Card
                    </span>

                  </label>

                </div>

              </div>

            </div>

          </div>

          {/* =====================================================
              ORDER SUMMARY
          ===================================================== */}

          <div className="h-fit rounded-2xl bg-white p-6 shadow-md">

            <h2 className="text-2xl font-bold text-gray-900">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">

              {cartItems.map((item, index) => {

                const itemPrice = Number(
                  item.finalPrice ??
                    item.price ??
                    0
                );

                const itemTotal =
                  itemPrice *
                  Number(item.quantity || 0);

                return (
                  <div
                    key={
                      item.cartItemId ||
                      `${item._id}-${index}`
                    }
                    className="border-b pb-4"
                  >

                    <div className="flex justify-between gap-4">

                      <div>

                        <p className="font-medium text-gray-800">
                          {item.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {item.quantity} × ₹
                          {itemPrice}
                        </p>

                        {/* Extras */}

                        {item.extras &&
                          item.extras.length >
                            0 && (
                            <div className="mt-2 text-xs text-gray-500">

                              {item.extras.map(
                                (
                                  extra,
                                  extraIndex
                                ) => (
                                  <p
                                    key={
                                      extra._id ||
                                      extraIndex
                                    }
                                  >
                                    +{" "}
                                    {extra.name}{" "}
                                    ₹
                                    {
                                      extra.price
                                    }
                                  </p>
                                )
                              )}

                            </div>
                          )}

                        {/* Instructions */}

                        {item.specialInstructions && (
                          <p className="mt-2 text-xs text-gray-500">
                            Note:{" "}
                            {
                              item.specialInstructions
                            }
                          </p>
                        )}

                      </div>

                      <p className="font-semibold">
                        ₹{itemTotal}
                      </p>

                    </div>

                  </div>
                );
              })}

              {/* Subtotal */}

              <div className="flex justify-between text-gray-600">

                <span>
                  Subtotal
                </span>

                <span>
                  ₹{subtotal}
                </span>

              </div>

              {/* Delivery Fee */}

              <div className="flex justify-between text-gray-600">

                <span>
                  Delivery Fee
                </span>

                <span>
                  ₹{deliveryFee}
                </span>

              </div>

              {/* Total */}

              <div className="border-t pt-4">

                <div className="flex justify-between">

                  <span className="text-lg font-bold">
                    Total
                  </span>

                  <span className="text-xl font-bold text-green-600">
                    ₹{total}
                  </span>

                </div>

              </div>

            </div>

            {/* ================= PLACE ORDER ================= */}

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={loading}
              className={`mt-6 w-full rounded-lg px-5 py-3 font-semibold text-white ${
                loading
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-orange-600 hover:bg-orange-700"
              }`}
            >
              {loading
                ? "Placing Order..."
                : "Place Order"}
            </button>

            <Link
              to="/cart"
              className="mt-3 block text-center font-medium text-orange-600 hover:text-orange-700"
            >
              ← Back to Cart
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Checkout;