import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";

import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from "../redux/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector(
    (state) => state.cart.items 
  );

  // ================= TOTAL ITEMS =================

  const totalItems = cartItems.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  // ================= SUBTOTAL =================

  const subtotal = cartItems.reduce(
    (total, item) => {
      const itemPrice = Number(
        item.finalPrice ?? item.price ?? 0
      );

      return (
        total +
        itemPrice *
          Number(item.quantity || 0)
      );
    },
    0
  );

  // ================= DELIVERY FEE =================

  const deliveryFee =
    cartItems.length > 0 ? 40 : 0;

  // ================= FINAL TOTAL =================

  const total = subtotal + deliveryFee;

  // ================= EMPTY CART =================

  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-6">

        <div className="text-center">

          <div className="text-6xl">
            🛒
          </div>

          <h1 className="mt-5 text-3xl font-bold text-gray-800">
            Your Cart is Empty
          </h1>

          <p className="mt-2 text-gray-500">
            Add some delicious food to your cart.
          </p>

          <Link
            to="/restaurants"
            className="mt-6 inline-block rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
          >
            Browse Restaurants
          </Link>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 md:px-10">

      <div className="mx-auto max-w-7xl">

        {/* ================= HEADER ================= */}

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>

            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Your Cart
            </h1>

            <p className="mt-2 text-gray-600">
              {totalItems} item
              {totalItems !== 1 ? "s" : ""} in your cart
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              dispatch(clearCart())
            }
            className="rounded-lg border border-red-300 px-4 py-2 font-semibold text-red-500 transition hover:bg-red-50"
          >
            Clear Cart
          </button>

        </div>

        {/* ================= CONTENT ================= */}

        <div className="grid gap-8 lg:grid-cols-3">

          {/* ================= CART ITEMS ================= */}

          <div className="space-y-5 lg:col-span-2">

            {cartItems.map((item) => {

              const itemPrice = Number(
                item.finalPrice ?? item.price ?? 0
              );

              const itemTotal =
                itemPrice *
                Number(item.quantity || 0);

              return (
                <div
                  key={item.cartItemId}
                  className="rounded-2xl bg-white p-5 shadow-md"
                >

                  <div className="flex flex-col gap-5 sm:flex-row">

                    {/* IMAGE */}

                    <div className="h-32 w-full overflow-hidden rounded-xl bg-gray-200 sm:h-32 sm:w-32">

                      {item.image ? (

                        <img
                          src={`http://localhost:3001${item.image}`}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />

                      ) : (

                        <div className="flex h-full items-center justify-center text-gray-400">
                          No Image
                        </div>

                      )}

                    </div>

                    {/* DETAILS */}

                    <div className="flex flex-1 flex-col justify-between">

                      {/* Name */}

                      <div>

                        <div className="flex items-start justify-between gap-4">

                          <div>

                            <h2 className="text-xl font-bold text-gray-900">
                              {item.name}
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                              {item.restaurantName}
                            </p>

                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              dispatch(
                                removeFromCart(
                                  item.cartItemId
                                )
                              )
                            }
                            className="text-sm font-semibold text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>

                        </div>

                        {/* Base Price */}

                        <p className="mt-3 font-semibold text-gray-700">
                          Base Price: ₹{item.price}
                        </p>

                        {/* Extras */}

                        {item.extras &&
                        item.extras.length > 0 ? (

                          <div className="mt-4 rounded-lg bg-orange-50 p-3">

                            <p className="text-sm font-bold text-gray-800">
                              Extras
                            </p>

                            <div className="mt-2 space-y-1">

                              {item.extras.map(
                                (
                                  extra,
                                  index
                                ) => (

                                  <div
                                    key={
                                      extra._id ||
                                      `${extra.name}-${index}`
                                    }
                                    className="flex justify-between text-sm text-gray-600"
                                  >

                                    <span>
                                      + {extra.name}
                                    </span>

                                    <span>
                                      ₹{extra.price}
                                    </span>

                                  </div>

                                )
                              )}

                            </div>

                            <div className="mt-2 border-t border-orange-200 pt-2">

                              <div className="flex justify-between text-sm font-semibold">

                                <span>
                                  Extras Total
                                </span>

                                <span className="text-orange-500">
                                  ₹
                                  {item.extrasTotal ||
                                    0}
                                </span>

                              </div>

                            </div>

                          </div>

                        ) : null}

                        {/* Special Instructions */}

                        {item.specialInstructions ? (

                          <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3">

                            <p className="text-sm font-bold text-gray-800">
                              Special Instructions
                            </p>

                            <p className="mt-1 text-sm leading-6 text-gray-600">
                              {
                                item.specialInstructions
                              }
                            </p>

                          </div>

                        ) : null}

                      </div>

                      {/* QUANTITY */}

                      <div className="mt-5 flex items-center justify-between">

                        <div className="flex items-center overflow-hidden rounded-lg border border-gray-300">

                          <button
                            type="button"
                            onClick={() =>
                              dispatch(
                                decreaseQuantity(
                                  item.cartItemId
                                )
                              )
                            }
                            className="px-4 py-2 text-lg font-bold hover:bg-gray-100"
                          >
                            −
                          </button>

                          <span className="min-w-10 px-3 text-center font-semibold">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              dispatch(
                                increaseQuantity(
                                  item.cartItemId
                                )
                              )
                            }
                            className="px-4 py-2 text-lg font-bold hover:bg-gray-100"
                          >
                            +
                          </button>

                        </div>

                        {/* ITEM TOTAL */}

                        <div className="text-right">

                          <p className="text-sm text-gray-500">
                            Item Total
                          </p>

                          <p className="text-lg font-bold text-gray-900">
                            ₹{itemTotal}
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

          {/* ================= ORDER SUMMARY ================= */}

          <div className="h-fit rounded-2xl bg-white p-6 shadow-md">

            <h2 className="text-2xl font-bold text-gray-900">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">

              <div className="flex justify-between text-gray-600">
                <span>Items</span>

                <span className="font-semibold">
                  {totalItems}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>

                <span className="font-semibold">
                  ₹{subtotal}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>

                <span className="font-semibold">
                  ₹{deliveryFee}
                </span>
              </div>

              <div className="border-t pt-4">

                <div className="flex justify-between">

                  <span className="text-lg font-bold text-gray-900">
                    Total
                  </span>

                  <span className="text-xl font-bold text-orange-500">
                    ₹{total}
                  </span>

                </div>

              </div>

            </div>

            {/* CHECKOUT */}

            <button
              type="button"
              onClick={() =>
                navigate("/checkout")
              }
              className="mt-6 w-full rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
            >
              Proceed to Checkout
            </button>

            {/* CONTINUE SHOPPING */}

            <Link
              to="/restaurants"
              className="mt-3 block text-center font-medium text-orange-500 hover:text-orange-600"
            >
              ← Continue Shopping
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Cart;