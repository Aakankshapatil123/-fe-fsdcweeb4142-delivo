import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

import {
  getRestaurantOrders,
  updateRestaurantOrderStatus,
} from "../services/restaurantOrderServices";

const RestaurantOrders = () => {
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] =
    useState(null);

  // ================= GET RESTAURANT ORDERS =================

  useEffect(() => {
    const fetchRestaurantOrders = async () => {
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await getRestaurantOrders();

        setOrders(response.result || []);
      } catch (error) {
        console.log(
          "RESTAURANT ORDERS ERROR:",
          error.response?.data?.message ||
            error.message
        );

        setError(
          error.response?.data?.message ||
            "Failed to load restaurant orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantOrders();
  }, [isAuthenticated, navigate]);

  // ================= UPDATE ORDER STATUS =================

  const handleStatusChange = async (
    orderId,
    orderStatus
  ) => {
    try {
      setUpdatingOrderId(orderId);

      const response =
        await updateRestaurantOrderStatus(
          orderId,
          orderStatus
        );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                orderStatus:
                  response.result?.orderStatus ||
                  orderStatus,
              }
            : order
        )
      );
    } catch (error) {
      console.log(
        "UPDATE ORDER STATUS ERROR:",
        error.response?.data?.message ||
          error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to update order status."
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // ================= STATUS COLOR =================

  const getStatusClass = (status) => {
    switch (status) {
      case "Preparing":
        return "bg-yellow-100 text-yellow-700";

      case "Out for Delivery":
        return "bg-blue-100 text-blue-700";

      case "Delivered":
        return "bg-green-100 text-green-700";

      case "Cancelled":
        return "bg-red-100 text-red-600";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-50">
        <p className="text-lg font-semibold text-gray-600">
          Loading restaurant orders...
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

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
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

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Restaurant Orders
          </h1>

          <p className="mt-2 text-gray-600">
            Manage customer orders and update order status.
          </p>
        </div>

        {/* ================= NO ORDERS ================= */}

        {orders.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-md">

            <div className="text-6xl">
              📦
            </div>

            <h2 className="mt-5 text-2xl font-bold text-gray-800">
              No Orders Yet
            </h2>

            <p className="mt-2 text-gray-500">
              Customer orders will appear here.
            </p>

          </div>
        ) : (
          <div className="space-y-6">

            {orders.map((order) => {

              const itemCount =
                order.items?.reduce(
                  (total, item) =>
                    total +
                    Number(
                      item.quantity || 0
                    ),
                  0
                );

              return (
                <div
                  key={order._id}
                  className="rounded-2xl bg-white p-6 shadow-md"
                >

                  {/* ================= ORDER HEADER ================= */}

                  <div className="flex flex-col justify-between gap-4 border-b pb-5 md:flex-row md:items-center">

                    <div>
                      <p className="text-sm text-gray-500">
                        Order ID
                      </p>

                      <p className="mt-1 break-all font-semibold text-gray-800">
                        {order._id}
                      </p>

                      <p className="mt-2 text-sm text-gray-500">
                        {order.createdAt
                          ? new Date(
                              order.createdAt
                            ).toLocaleString()
                          : "Date not available"}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${getStatusClass(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>

                  </div>

                  {/* ================= CUSTOMER ================= */}

                  <div className="mt-5">

                    <h2 className="text-xl font-bold text-gray-900">
                      Customer Order
                    </h2>

                    <p className="mt-2 text-sm text-gray-600">
                      User ID: {order.user}
                    </p>

                  </div>

                  {/* ================= ITEMS ================= */}

                  <div className="mt-5">

                    <h3 className="text-lg font-bold text-gray-900">
                      Items
                    </h3>

                    <div className="mt-3 space-y-3">

                      {order.items?.map(
                        (item, index) => {

                          const itemBaseTotal =
                            Number(
                              item.price || 0
                            ) *
                            Number(
                              item.quantity || 0
                            );

                          const extrasTotal =
                            Array.isArray(
                              item.extras
                            )
                              ? item.extras.reduce(
                                  (
                                    total,
                                    extra
                                  ) =>
                                    total +
                                    Number(
                                      extra.price ||
                                        0
                                    ) *
                                      Number(
                                        item.quantity ||
                                          1
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
                                item._id ||
                                index
                              }
                              className="rounded-xl bg-gray-50 p-4"
                            >

                              <div className="flex flex-col justify-between gap-3 sm:flex-row">

                                <div>

                                  <p className="font-semibold text-gray-800">
                                    {item.name}
                                  </p>

                                  <p className="mt-1 text-sm text-gray-500">
                                    ₹{item.price} ×{" "}
                                    {item.quantity}
                                  </p>

                                </div>

                                <p className="font-semibold text-orange-500">
                                  ₹{itemTotal}
                                </p>

                              </div>

                              {/* EXTRAS */}

                              {item.extras &&
                                item.extras.length >
                                  0 && (
                                  <div className="mt-3 rounded-lg bg-orange-50 p-3">

                                    <p className="font-semibold text-gray-800">
                                      Extras
                                    </p>

                                    <div className="mt-2 space-y-1 text-sm text-gray-600">

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
                                            {
                                              extra.name
                                            }{" "}
                                            ₹
                                            {
                                              extra.price
                                            }
                                          </p>
                                        )
                                      )}

                                    </div>

                                  </div>
                                )}

                              {/* SPECIAL INSTRUCTIONS */}

                              {item.specialInstructions && (
                                <div className="mt-3 rounded-lg bg-white p-3">

                                  <p className="text-sm font-semibold text-gray-700">
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

                  {/* ================= ORDER SUMMARY ================= */}

                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    <div className="rounded-xl bg-gray-50 p-4">

                      <p className="text-sm text-gray-500">
                        Items
                      </p>

                      <p className="mt-1 font-semibold text-gray-800">
                        {itemCount}
                      </p>

                    </div>

                    <div className="rounded-xl bg-gray-50 p-4">

                      <p className="text-sm text-gray-500">
                        Total
                      </p>

                      <p className="mt-1 font-semibold text-orange-500">
                        ₹{order.totalAmount}
                      </p>

                    </div>

                    <div className="rounded-xl bg-gray-50 p-4">

                      <p className="text-sm text-gray-500">
                        Payment
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

                  {/* ================= DELIVERY ================= */}

                  <div className="mt-6 rounded-xl bg-gray-50 p-4">

                    <h3 className="font-bold text-gray-800">
                      Delivery Details
                    </h3>

                    <p className="mt-2 text-sm text-gray-600">
                      {order.deliveryAddress?.address ||
                        "N/A"}
                    </p>

                    <p className="text-sm text-gray-600">
                      {order.deliveryAddress?.city ||
                        ""}
                      {order.deliveryAddress?.state
                        ? `, ${order.deliveryAddress.state}`
                        : ""}
                      {order.deliveryAddress?.pincode
                        ? ` - ${order.deliveryAddress.pincode}`
                        : ""}
                    </p>

                    <p className="mt-2 text-sm font-medium text-gray-700">
                      Delivery Type:{" "}
                      {order.deliveryType}
                    </p>

                    {order.deliveryType ===
                      "Scheduled" &&
                      order.scheduledDeliveryTime && (
                        <p className="mt-1 text-sm text-gray-600">
                          Scheduled:{" "}
                          {new Date(
                            order.scheduledDeliveryTime
                          ).toLocaleString()}
                        </p>
                      )}

                  </div>

                  {/* ================= STATUS UPDATE ================= */}

                  <div className="mt-6 border-t pt-5">

                    <label className="mb-2 block font-semibold text-gray-800">
                      Update Order Status
                    </label>

                    <select
                      value={
                        order.orderStatus
                      }
                      onChange={(event) =>
                        handleStatusChange(
                          order._id,
                          event.target.value
                        )
                      }
                      disabled={
                        updatingOrderId ===
                        order._id
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-orange-500 md:w-80"
                    >
                      <option value="Pending">
                        Pending
                      </option>

                      <option value="Preparing">
                        Preparing
                      </option>

                      <option value="Out for Delivery">
                        Out for Delivery
                      </option>

                      <option value="Delivered">
                        Delivered
                      </option>

                      <option value="Cancelled">
                        Cancelled
                      </option>
                    </select>

                    {updatingOrderId ===
                      order._id && (
                      <p className="mt-2 text-sm text-gray-500">
                        Updating status...
                      </p>
                    )}

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
};

export default RestaurantOrders;