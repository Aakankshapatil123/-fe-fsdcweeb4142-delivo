import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";

import { getMyOrders, cancelOrder } from "../services/orderServices";

const Orders = () => {
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= FETCH MY ORDERS =================

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await getMyOrders();

        setOrders(response.result || []);
      } catch (error) {
        console.log(
          "GET ORDERS ERROR:",
          error.response?.data?.message || error.message,
        );

        setError("Failed to load your orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, navigate]);

  // ================= CANCEL ORDER =================

  const handleCancelOrder = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await cancelOrder(orderId);

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? {
                ...order,
                orderStatus: "Cancelled",
              }
            : order,
        ),
      );
    } catch (error) {
      console.log(
        "CANCEL ORDER ERROR:",
        error.response?.data?.message || error.message,
      );

      alert(error.response?.data?.message || "Unable to cancel order.");
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-50">
        <p className="text-lg font-semibold text-gray-600">
          Loading your orders...
        </p>
      </div>
    );
  }

  // ================= ERROR =================

  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-6">
        <div className="text-center">
          <p className="font-semibold text-red-500">{error}</p>

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

  // ================= NO ORDERS =================

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10 md:px-10">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            My Orders
          </h1>

          <div className="mt-10 rounded-2xl bg-white p-12 text-center shadow-md">
            <div className="text-6xl">📦</div>

            <h2 className="mt-5 text-2xl font-bold text-gray-800">
              No Orders Yet
            </h2>

            <p className="mt-2 text-gray-500">
              You haven't placed any orders yet.
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

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            My Orders
          </h1>

          <p className="mt-2 text-gray-600">View and manage your orders</p>
        </div>

        {/* ================= ORDER LIST ================= */}

        <div className="space-y-6">
          {orders.map((order) => {
            const itemCount = order.items?.reduce(
              (total, item) => total + Number(item.quantity || 0),
              0,
            );

            const orderTime = new Date(order.createdAt).getTime();
            const currentTime = Date.now();

            const differenceInMinutes = (currentTime - orderTime) / (1000 * 60);

            const canCancel =
              differenceInMinutes < 30 &&
              order.orderStatus !== "Delivered" &&
              order.orderStatus !== "Cancelled";

            return (
              <div
                key={order._id}
                className="rounded-2xl bg-white p-6 shadow-md"
              >
                {/* ================= TOP ================= */}

                <div className="flex flex-col justify-between gap-4 border-b pb-5 md:flex-row md:items-center">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>

                    <p className="mt-1 break-all font-semibold text-gray-800">
                      {order._id}
                    </p>
                  </div>

                  {/* STATUS */}

                  <span
                    className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${
                      order.orderStatus === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.orderStatus === "Cancelled"
                          ? "bg-red-100 text-red-600"
                          : order.orderStatus === "Out for Delivery"
                            ? "bg-blue-100 text-blue-700"
                            : order.orderStatus === "Preparing"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>

                {/* ================= RESTAURANT ================= */}

                <div className="mt-5">
                  <h2 className="text-xl font-bold text-gray-900">
                    {order.restaurant?.name || "Restaurant"}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {order.restaurant?.cuisine || "Cuisine not available"}
                  </p>
                </div>

                {/* ================= ORDER INFO ================= */}

                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Items</p>

                    <p className="mt-1 font-semibold text-gray-800">
                      {itemCount}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Total</p>

                    <p className="mt-1 font-semibold text-orange-500">
                      ₹{order.totalAmount}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Payment</p>

                    <p className="mt-1 font-semibold text-gray-800">
                      {order.paymentMethod}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Delivery</p>

                    <p className="mt-1 font-semibold text-gray-800">
                      {order.deliveryType}
                    </p>
                  </div>
                </div>

                {/* ================= DATE ================= */}

                <div className="mt-5 text-sm text-gray-500">
                  Ordered on{" "}
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString()
                    : "N/A"}
                </div>

                {/* ================= ACTIONS ================= */}

                <div className="mt-6 flex flex-col gap-3 border-t pt-5 sm:flex-row">
                  <Link
                    to={`/orders/${order._id}`}
                    className="rounded-lg bg-orange-500 px-5 py-3 text-center font-semibold text-white transition hover:bg-orange-600"
                  >
                    View Details
                  </Link>

                  {canCancel && (
                    <button
                      type="button"
                      onClick={() => handleCancelOrder(order._id)}
                      className="rounded-lg border border-red-500 px-5 py-3 font-semibold text-red-500 transition hover:bg-red-50"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Orders;
