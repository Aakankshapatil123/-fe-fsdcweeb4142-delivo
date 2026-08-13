import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";

import {
  getOrderById,
  cancelOrder,
} from "../services/orderServices";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= FETCH ORDER =================

  useEffect(() => {
    const fetchOrder = async () => {
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await getOrderById(id);

        setOrder(response.result);
      } catch (error) {
        console.log(
          "ORDER DETAILS ERROR:",
          error.response?.data?.message ||
            error.message
        );

        setError(
          error.response?.data?.message ||
            "Failed to load order details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, isAuthenticated, navigate]);

  // ================= CANCEL ORDER =================

  const handleCancelOrder = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await cancelOrder(order._id);

      setOrder((prev) => ({
        ...prev,
        orderStatus: "Cancelled",
      }));
    } catch (error) {
      console.log(
        "CANCEL ORDER ERROR:",
        error.response?.data?.message ||
          error.message
      );

      alert(
        error.response?.data?.message ||
          "Unable to cancel order."
      );
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-50">
        <p className="text-lg font-semibold text-gray-600">
          Loading order details...
        </p>
      </div>
    );
  }

  // ================= ERROR =================

  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-6">
        <div className="text-center">
          <p className="font-semibold text-red-500">
            {error}
          </p>

          <Link
            to="/orders"
            className="mt-4 inline-block rounded-lg bg-orange-500 px-5 py-2 font-semibold text-white hover:bg-orange-600"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  // ================= ORDER NOT FOUND =================

  if (!order) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-600">
            Order not found
          </p>

          <Link
            to="/orders"
            className="mt-4 inline-block rounded-lg bg-orange-500 px-5 py-2 font-semibold text-white hover:bg-orange-600"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  // ================= ORDER TRACKING DATA =================

  const statusOrder = [
    "Pending",
    "Preparing",
    "Out for Delivery",
    "Delivered",
  ];

  const currentStatusIndex =
    statusOrder.indexOf(order.orderStatus);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 md:px-10">
      <div className="mx-auto max-w-5xl">

        {/* ================= BACK ================= */}

        <Link
          to="/orders"
          className="inline-block rounded-lg bg-white px-4 py-2 font-medium text-gray-700 shadow-sm hover:bg-gray-100"
        >
          ← Back to Orders
        </Link>

        {/* ================= HEADER ================= */}

        <div className="mt-6 rounded-2xl bg-white p-6 shadow-md md:p-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

            <div>
              <p className="text-sm text-gray-500">
                Order ID
              </p>

              <h1 className="mt-1 break-all text-xl font-bold text-gray-900">
                {order._id}
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                {order.createdAt
                  ? new Date(
                      order.createdAt
                    ).toLocaleString()
                  : "Date not available"}
              </p>
            </div>

            {/* STATUS */}

            <span
              className={`w-fit rounded-full px-4 py-2 font-semibold ${
                order.orderStatus ===
                "Delivered"
                  ? "bg-green-100 text-green-700"
                  : order.orderStatus ===
                    "Cancelled"
                  ? "bg-red-100 text-red-600"
                  : order.orderStatus ===
                    "Out for Delivery"
                  ? "bg-blue-100 text-blue-700"
                  : order.orderStatus ===
                    "Preparing"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {order.orderStatus}
            </span>

          </div>
        </div>

        {/* ================= ORDER TRACKING ================= */}

        <div className="mt-6 rounded-2xl bg-white p-6 shadow-md md:p-8">

          <h2 className="text-2xl font-bold text-gray-900">
            Order Tracking
          </h2>

          {order.orderStatus === "Cancelled" ? (
            <div className="mt-5 rounded-xl bg-red-50 p-4 text-center">
              <p className="font-semibold text-red-600">
                This order has been cancelled.
              </p>
            </div>
          ) : (
            <div className="mt-6">

              {statusOrder.map(
                (status, index) => {

                  const isCompleted =
                    index <= currentStatusIndex;

                  const isCurrent =
                    index === currentStatusIndex;

                  return (
                    <div
                      key={status}
                      className="flex items-start"
                    >

                      {/* ICON + LINE */}

                      <div className="flex flex-col items-center">

                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                            isCompleted
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {isCompleted
                            ? "✓"
                            : index + 1}
                        </div>

                        {index <
                          statusOrder.length -
                            1 && (
                          <div
                            className={`h-12 w-1 ${
                              index <
                              currentStatusIndex
                                ? "bg-green-500"
                                : "bg-gray-200"
                            }`}
                          />
                        )}

                      </div>

                      {/* STATUS TEXT */}

                      <div className="ml-4 pb-8">

                        <p
                          className={`font-semibold ${
                            isCompleted
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        >
                          {status}
                        </p>

                        {isCurrent && (
                          <p className="mt-1 text-sm text-gray-500">
                            Current order status
                          </p>
                        )}

                      </div>

                    </div>
                  );
                }
              )}

            </div>
          )}
        </div>

        {/* ================= RESTAURANT ================= */}

        <div className="mt-6 rounded-2xl bg-white p-6 shadow-md">

          <h2 className="text-2xl font-bold text-gray-900">
            Restaurant
          </h2>

          <div className="mt-4 rounded-xl bg-gray-50 p-4">

            <h3 className="text-xl font-bold text-gray-800">
              {order.restaurant?.name ||
                "Restaurant"}
            </h3>

            <p className="mt-1 text-gray-500">
              {order.restaurant?.cuisine ||
                "Cuisine not available"}
            </p>

            {order.restaurant?.location && (
              <p className="mt-2 text-sm text-gray-600">
                📍{" "}
                {order.restaurant.location
                  .address || ""}

                {order.restaurant.location.city
                  ? `, ${order.restaurant.location.city}`
                  : ""}
              </p>
            )}

          </div>
        </div>

        {/* ================= ORDER ITEMS ================= */}

        <div className="mt-6 rounded-2xl bg-white p-6 shadow-md">

          <h2 className="text-2xl font-bold text-gray-900">
            Order Items
          </h2>

          <div className="mt-5 space-y-5">

            {order.items?.map(
              (item, index) => {

                const itemBaseTotal =
                  Number(item.price || 0) *
                  Number(item.quantity || 0);

                const extrasTotal =
                  Array.isArray(item.extras)
                    ? item.extras.reduce(
                        (total, extra) =>
                          total +
                          Number(
                            extra.price || 0
                          ) *
                            Number(
                              item.quantity || 1
                            ),
                        0
                      )
                    : 0;

                const itemTotal =
                  itemBaseTotal +
                  extrasTotal;

                return (
                  <div
                    key={
                      item._id || index
                    }
                    className="rounded-xl border border-gray-200 p-4"
                  >

                    {/* ITEM HEADER */}

                    <div className="flex flex-col justify-between gap-2 sm:flex-row">

                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          ₹{item.price} ×{" "}
                          {item.quantity}
                        </p>
                      </div>

                      <p className="text-lg font-bold text-orange-500">
                        ₹{itemTotal}
                      </p>

                    </div>

                    {/* EXTRAS */}

                    {item.extras &&
                      item.extras.length > 0 && (
                        <div className="mt-4 rounded-lg bg-orange-50 p-3">

                          <p className="font-semibold text-gray-800">
                            Extras
                          </p>

                          <div className="mt-2 space-y-1">

                            {item.extras.map(
                              (
                                extra,
                                extraIndex
                              ) => (
                                <div
                                  key={
                                    extra._id ||
                                    extraIndex
                                  }
                                  className="flex justify-between text-sm text-gray-600"
                                >
                                  <span>
                                    +{" "}
                                    {extra.name}
                                  </span>

                                  <span>
                                    ₹
                                    {
                                      extra.price
                                    }
                                  </span>
                                </div>
                              )
                            )}

                          </div>
                        </div>
                      )}

                    {/* SPECIAL INSTRUCTIONS */}

                    {item.specialInstructions && (
                      <div className="mt-4 rounded-lg bg-gray-50 p-3">

                        <p className="font-semibold text-gray-800">
                          Special Instructions
                        </p>

                        <p className="mt-1 text-sm text-gray-600">
                          {
                            item.specialInstructions
                          }
                        </p>

                      </div>
                    )}

                  </div>
                );
              }
            )}

          </div>
        </div>

        {/* ================= DELIVERY DETAILS ================= */}

        <div className="mt-6 grid gap-6 md:grid-cols-2">

          <div className="rounded-2xl bg-white p-6 shadow-md">

            <h2 className="text-2xl font-bold text-gray-900">
              Delivery Details
            </h2>

            <div className="mt-4 space-y-2 text-gray-600">

              <p>
                <span className="font-semibold text-gray-800">
                  Address:
                </span>{" "}
                {order.deliveryAddress
                  ?.address || "N/A"}
              </p>

              <p>
                <span className="font-semibold text-gray-800">
                  City:
                </span>{" "}
                {order.deliveryAddress
                  ?.city || "N/A"}
              </p>

              <p>
                <span className="font-semibold text-gray-800">
                  State:
                </span>{" "}
                {order.deliveryAddress
                  ?.state || "N/A"}
              </p>

              <p>
                <span className="font-semibold text-gray-800">
                  Pincode:
                </span>{" "}
                {order.deliveryAddress
                  ?.pincode || "N/A"}
              </p>

            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">

            <h2 className="text-2xl font-bold text-gray-900">
              Delivery Type
            </h2>

            <p className="mt-4 font-semibold text-gray-800">
              {order.deliveryType}
            </p>

            {order.deliveryType ===
              "Scheduled" &&
              order.scheduledDeliveryTime && (
                <p className="mt-2 text-sm text-gray-600">
                  Scheduled for:{" "}
                  {new Date(
                    order.scheduledDeliveryTime
                  ).toLocaleString()}
                </p>
              )}

          </div>

        </div>

        {/* ================= PAYMENT ================= */}

        <div className="mt-6 rounded-2xl bg-white p-6 shadow-md">

          <h2 className="text-2xl font-bold text-gray-900">
            Payment Details
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">

            <div className="rounded-xl bg-gray-50 p-4">

              <p className="text-sm text-gray-500">
                Payment Method
              </p>

              <p className="mt-1 font-semibold text-gray-800">
                {order.paymentMethod}
              </p>

            </div>

            <div className="rounded-xl bg-gray-50 p-4">

              <p className="text-sm text-gray-500">
                Payment Status
              </p>

              <p
                className={`mt-1 font-semibold ${
                  order.paymentStatus ===
                  "Paid"
                    ? "text-green-600"
                    : order.paymentStatus ===
                      "Failed"
                    ? "text-red-500"
                    : "text-yellow-600"
                }`}
              >
                {order.paymentStatus}
              </p>

            </div>

          </div>
        </div>

        {/* ================= TOTAL ================= */}

        <div className="mt-6 rounded-2xl bg-white p-6 shadow-md">

          <div className="flex items-center justify-between">

            <span className="text-xl font-bold text-gray-900">
              Total Amount
            </span>

            <span className="text-2xl font-bold text-orange-500">
              ₹{order.totalAmount}
            </span>

          </div>

        </div>

        {/* ================= CANCEL ================= */}

        {order.orderStatus !== "Delivered" &&
          order.orderStatus !== "Cancelled" && (
            <div className="mt-6">

              <button
                type="button"
                onClick={handleCancelOrder}
                className="w-full rounded-lg border border-red-500 px-5 py-3 font-semibold text-red-500 transition hover:bg-red-50"
              >
                Cancel Order
              </button>

            </div>
          )}

      </div>
    </div>
  );
};

export default OrderDetails;