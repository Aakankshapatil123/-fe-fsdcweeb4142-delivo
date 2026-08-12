import { useSelector } from "react-redux";
import { Link } from "react-router";

const Checkout = () => {
  const cartItems = useSelector((state) => state.cart.items);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const deliveryFee = cartItems.length > 0 ? 40 : 0;

  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 md:px-10">
      <div className="mx-auto max-w-6xl">

        <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
          Checkout
        </h1>

        <p className="mt-2 text-gray-600">
          Complete your order
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">

          {/* ================= DELIVERY DETAILS ================= */}

          <div className="rounded-2xl bg-white p-6 shadow-md lg:col-span-2">

            <h2 className="text-2xl font-bold text-gray-900">
              Delivery Details
            </h2>

            <div className="mt-6 space-y-4">

              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Phone Number
                </label>

                <input
                  type="text"
                  placeholder="Enter phone number"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Address
                </label>

                <textarea
                  rows="4"
                  placeholder="Enter delivery address"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">

                <div>
                  <label className="mb-2 block font-medium text-gray-700">
                    City
                  </label>

                  <input
                    type="text"
                    placeholder="City"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-medium text-gray-700">
                    Pincode
                  </label>

                  <input
                    type="text"
                    placeholder="Pincode"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                  />
                </div>

              </div>

            </div>

          </div>

          {/* ================= ORDER SUMMARY ================= */}

          <div className="h-fit rounded-2xl bg-white p-6 shadow-md">

            <h2 className="text-2xl font-bold text-gray-900">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">

              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between gap-4"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {item.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {item.quantity} × ₹{item.price}
                    </p>
                  </div>

                  <p className="font-semibold">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              ))}

              <div className="border-t pt-4">

                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>

                <div className="mt-3 flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee}</span>
                </div>

              </div>

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

            <button
              className="mt-6 w-full rounded-lg bg-orange-600 px-5 py-3 font-semibold text-white hover:bg-orange-700"
            >
              Place Order
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