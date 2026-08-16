import { useEffect, useState } from "react";
import { Link } from "react-router";

import {
  getAllOrders,
  getAdminOrderById,
  updateAdminOrderStatus,
} from "../services/adminOrderService";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  // =========================================================
  // GET ALL ORDERS
  // =========================================================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllOrders();

      console.log("ORDERS RESPONSE:", response);

      setOrders(response.orders || []);
    } catch (error) {
      console.log(
        "GET ORDERS ERROR:",
        error.response?.data?.message || error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // =========================================================
  // VIEW ORDER
  // =========================================================

  const handleViewOrder = async (id) => {
    try {
      const response = await getAdminOrderById(id);

      console.log("ORDER DETAILS:", response);

      setSelectedOrder(response.result);

      setSelectedStatus(
        response.result?.orderStatus || "Pending"
      );
    } catch (error) {
      console.log(
        "GET ORDER DETAILS ERROR:",
        error.response?.data?.message ||
          error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to load order details"
      );
    }
  };

  // =========================================================
  // UPDATE ORDER STATUS
  // =========================================================

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    try {
      const response = await updateAdminOrderStatus(
        selectedOrder._id,
        selectedStatus
      );

      console.log("STATUS UPDATE:", response);

      // Update order in list
      setOrders((prev) =>
        prev.map((order) =>
          order._id === selectedOrder._id
            ? {
                ...order,
                orderStatus: selectedStatus,
              }
            : order
        )
      );

      // Update selected order
      setSelectedOrder((prev) => ({
        ...prev,
        orderStatus: selectedStatus,
      }));

      alert("Order status updated successfully");
    } catch (error) {
      console.log(
        "UPDATE ORDER STATUS ERROR:",
        error.response?.data?.message ||
          error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to update order status"
      );
    }
  };

  // =========================================================
  // ORDER STATUS STYLE
  // =========================================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-gray-100 text-gray-700";

      case "Preparing":
        return "bg-yellow-100 text-yellow-700";

      case "Out for Delivery":
        return "bg-blue-100 text-blue-700";

      case "Delivered":
        return "bg-green-100 text-green-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =========================================================
  // PAYMENT STATUS STYLE
  // =========================================================

  const getPaymentStatusClass = (status) => {
    switch (status) {
      case "Paid":
        return "text-green-600";

      case "Failed":
        return "text-red-600";

      case "Pending":
        return "text-yellow-600";

      default:
        return "text-gray-600";
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg font-semibold text-gray-600">
          Loading orders...
        </p>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="font-semibold text-red-500">
            {error}
          </p>

          <button
            onClick={fetchOrders}
            className="mt-4 rounded-lg bg-orange-500 px-5 py-2 font-semibold text-white hover:bg-orange-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 md:px-10">

      <div className="mx-auto max-w-7xl">

        {/* ===================================================
            HEADER
        ==================================================== */}

        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Manage Orders
            </h1>

            <p className="mt-2 text-gray-600">
              View and manage customer orders
            </p>
          </div>

          <Link
            to="/admin/dashboard"
            className="rounded-lg bg-gray-700 px-5 py-3 text-center font-semibold text-white hover:bg-gray-800"
          >
            ← Dashboard
          </Link>

        </div>

        {/* ===================================================
            NO ORDERS
        ==================================================== */}

        {orders.length === 0 ? (

          <div className="rounded-2xl bg-white p-10 text-center shadow-md">

            <div className="text-5xl">
              📦
            </div>

            <h2 className="mt-4 text-xl font-bold text-gray-800">
              No orders found
            </h2>

            <p className="mt-2 text-gray-500">
              There are no customer orders available.
            </p>

          </div>

        ) : (

          /* =================================================
             ORDERS LIST
          ================================================== */

          <div className="space-y-5">

            {orders.map((order) => (

              <div
                key={order._id}
                className="rounded-2xl bg-white p-6 shadow-md"
              >

                {/* =================================================
                    TOP
                ================================================== */}

                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

                  <div>

                    <p className="text-sm text-gray-500">
                      Order ID
                    </p>

                    <p className="break-all font-mono text-sm font-semibold text-gray-800">
                      {order._id}
                    </p>

                  </div>

                  <span
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusClass(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus || "Pending"}
                  </span>

                </div>

                {/* =================================================
                    ORDER INFORMATION
                ================================================== */}

                <div className="mt-5 grid gap-4 md:grid-cols-3">

                  {/* =================================================
                      CUSTOMER
                  ================================================== */}

                  <div className="rounded-xl bg-gray-50 p-4">

                    <p className="text-sm text-gray-500">
                      Customer
                    </p>

                    <p className="mt-1 font-semibold text-gray-800">
                      {order.user?.name || "N/A"}
                    </p>

                    <p className="text-sm text-gray-600">
                      {order.user?.email || ""}
                    </p>

                  </div>

                  {/* =================================================
                      RESTAURANT
                  ================================================== */}

                  <div className="rounded-xl bg-gray-50 p-4">

                    <p className="text-sm text-gray-500">
                      Restaurant
                    </p>

                    <p className="mt-1 font-semibold text-gray-800">
                      {order.restaurant?.name || "N/A"}
                    </p>

                    <p className="text-sm text-gray-600">
                      {order.restaurant?.cuisine || ""}
                    </p>

                  </div>

                  {/* =================================================
                      PAYMENT SUMMARY
                  ================================================== */}

                  <div className="rounded-xl bg-gray-50 p-4">

                    <p className="text-sm text-gray-500">
                      Payment
                    </p>

                    <p className="mt-1 text-xl font-bold text-orange-600">
                      ₹{order.totalAmount || 0}
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      Method:{" "}
                      <span className="font-semibold">
                        {order.paymentMethod || "N/A"}
                      </span>
                    </p>

                    <p className="text-sm text-gray-600">
                      Status:{" "}
                      <span
                        className={`font-semibold ${getPaymentStatusClass(
                          order.paymentStatus
                        )}`}
                      >
                        {order.paymentStatus || "N/A"}
                      </span>
                    </p>

                  </div>

                </div>

                {/* =================================================
                    DATE + BUTTON
                ================================================== */}

                <div className="mt-5 flex flex-col justify-between gap-4 border-t pt-5 md:flex-row md:items-center">

                  <p className="text-sm text-gray-500">
                    Ordered on:{" "}
                    {order.createdAt
                      ? new Date(
                          order.createdAt
                        ).toLocaleString()
                      : "N/A"}
                  </p>

                  <button
                    onClick={() =>
                      handleViewOrder(order._id)
                    }
                    className="rounded-lg bg-orange-500 px-5 py-2 font-semibold text-white hover:bg-orange-600"
                  >
                    View Details
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* =====================================================
          ORDER DETAILS MODAL
      ====================================================== */}

      {selectedOrder && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">

            {/* =================================================
                HEADER
            ================================================== */}

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-bold text-gray-800">
                  Order Details
                </h2>

                <p className="mt-1 break-all font-mono text-xs text-gray-500">
                  {selectedOrder._id}
                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedOrder(null)
                }
                className="text-2xl font-bold text-gray-500 hover:text-red-500"
              >
                ✕
              </button>

            </div>

            {/* =================================================
                CUSTOMER
            ================================================== */}

            <div className="mt-6 rounded-xl bg-gray-50 p-5">

              <h3 className="font-bold text-gray-800">
                Customer
              </h3>

              <p className="mt-2 font-semibold">
                {selectedOrder.user?.name || "N/A"}
              </p>

              <p className="text-sm text-gray-600">
                {selectedOrder.user?.email || ""}
              </p>

            </div>

            {/* =================================================
                RESTAURANT
            ================================================== */}

            <div className="mt-4 rounded-xl bg-gray-50 p-5">

              <h3 className="font-bold text-gray-800">
                Restaurant
              </h3>

              <p className="mt-2 font-semibold">
                {selectedOrder.restaurant?.name ||
                  "N/A"}
              </p>

              <p className="text-sm text-gray-600">
                {selectedOrder.restaurant?.cuisine ||
                  ""}
              </p>

            </div>

            {/* =================================================
                DELIVERY ADDRESS
            ================================================== */}

            <div className="mt-4 rounded-xl bg-gray-50 p-5">

              <h3 className="font-bold text-gray-800">
                Delivery Address
              </h3>

              <p className="mt-2 text-gray-700">
                {selectedOrder.deliveryAddress?.address ||
                  "N/A"}
              </p>

              <p className="text-sm text-gray-600">
                {selectedOrder.deliveryAddress?.city ||
                  ""}
                {selectedOrder.deliveryAddress?.state
                  ? `, ${selectedOrder.deliveryAddress.state}`
                  : ""}
              </p>

              <p className="text-sm text-gray-600">
                Pincode:{" "}
                {selectedOrder.deliveryAddress?.pincode ||
                  "N/A"}
              </p>

            </div>

            {/* =================================================
                ORDER ITEMS
            ================================================== */}

            <div className="mt-4 rounded-xl bg-gray-50 p-5">

              <h3 className="font-bold text-gray-800">
                Order Items
              </h3>

              {selectedOrder.items?.length > 0 ? (

                <div className="mt-3 space-y-3">

                  {selectedOrder.items.map(
                    (item, index) => (

                      <div
                        key={item._id || index}
                        className="flex justify-between border-b pb-3"
                      >

                        <div>

                          <p className="font-semibold">
                            {item.name ||
                              item.menuItem?.name ||
                              "Menu Item"}
                          </p>

                          <p className="text-sm text-gray-500">
                            Quantity:{" "}
                            {item.quantity || 1}
                          </p>

                          {/* EXTRAS */}

                          {item.extras?.length > 0 && (

                            <div className="mt-1">

                              <p className="text-xs font-semibold text-gray-500">
                                Extras:
                              </p>

                              {item.extras.map(
                                (extra, extraIndex) => (

                                  <p
                                    key={
                                      extra._id ||
                                      extraIndex
                                    }
                                    className="text-xs text-gray-500"
                                  >
                                    {extra.name} - ₹
                                    {extra.price || 0}
                                  </p>

                                )
                              )}

                            </div>

                          )}

                          {/* SPECIAL INSTRUCTIONS */}

                          {item.specialInstructions && (

                            <p className="mt-1 text-xs text-gray-500">
                              Note:{" "}
                              {item.specialInstructions}
                            </p>

                          )}

                        </div>

                        <p className="font-semibold">
                          ₹{item.price || 0}
                        </p>

                      </div>

                    )
                  )}

                </div>

              ) : (

                <p className="mt-2 text-gray-500">
                  No item details available.
                </p>

              )}

            </div>

            {/* =================================================
                PAYMENT DETAILS
            ================================================== */}

            <div className="mt-4 rounded-xl bg-orange-50 p-5">

              <h3 className="font-bold text-gray-800">
                Payment Details
              </h3>

              {/* TOTAL AMOUNT */}

              <div className="mt-4 flex justify-between border-b pb-3">

                <span className="text-gray-600">
                  Total Amount
                </span>

                <span className="text-xl font-bold text-orange-600">
                  ₹{selectedOrder.totalAmount || 0}
                </span>

              </div>

              {/* PAYMENT METHOD */}

              <div className="mt-3 flex justify-between border-b pb-3">

                <span className="text-gray-600">
                  Payment Method
                </span>

                <span className="font-semibold text-gray-800">
                  {selectedOrder.paymentMethod ||
                    "N/A"}
                </span>

              </div>

              {/* PAYMENT STATUS */}

              <div className="mt-3 flex justify-between border-b pb-3">

                <span className="text-gray-600">
                  Payment Status
                </span>

                <span
                  className={`font-semibold ${getPaymentStatusClass(
                    selectedOrder.paymentStatus
                  )}`}
                >
                  {selectedOrder.paymentStatus ||
                    "N/A"}
                </span>

              </div>

              {/* PAYMENT ID */}

              <div className="mt-3">

                <p className="text-sm text-gray-600">
                  Razorpay Payment ID
                </p>

                <p className="mt-1 break-all rounded-lg bg-white p-3 font-mono text-xs text-gray-800">
                  {selectedOrder.paymentId ||
                    "N/A"}
                </p>

              </div>

              {/* RAZORPAY ORDER ID */}

              <div className="mt-3">

                <p className="text-sm text-gray-600">
                  Razorpay Order ID
                </p>

                <p className="mt-1 break-all rounded-lg bg-white p-3 font-mono text-xs text-gray-800">
                  {selectedOrder.paymentOrderId ||
                    "N/A"}
                </p>

              </div>

            </div>

            {/* =================================================
                DELIVERY TYPE
            ================================================== */}

            <div className="mt-4 rounded-xl bg-gray-50 p-5">

              <h3 className="font-bold text-gray-800">
                Delivery Information
              </h3>

              <div className="mt-3 space-y-2 text-sm">

                <p>
                  <span className="font-semibold">
                    Delivery Type:
                  </span>{" "}
                  {selectedOrder.deliveryType ||
                    "Immediate"}
                </p>

                {selectedOrder.scheduledDeliveryTime && (

                  <p>
                    <span className="font-semibold">
                      Scheduled Time:
                    </span>{" "}
                    {new Date(
                      selectedOrder.scheduledDeliveryTime
                    ).toLocaleString()}
                  </p>

                )}

              </div>

            </div>

            {/* =================================================
                ORDER STATUS
            ================================================== */}

            <div className="mt-6">

              <label className="font-semibold text-gray-700">
                Update Order Status
              </label>

              <select
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(e.target.value)
                }
                className="mt-2 w-full rounded-lg border px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
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

            </div>

            {/* =================================================
                BUTTONS
            ================================================== */}

            <div className="mt-5 flex gap-3">

              <button
                onClick={() =>
                  setSelectedOrder(null)
                }
                className="flex-1 rounded-lg bg-gray-500 px-5 py-3 font-semibold text-white hover:bg-gray-600"
              >
                Close
              </button>

              <button
                onClick={handleUpdateStatus}
                className="flex-1 rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
              >
                Update Status
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminOrders;