import intance from "../intances/intance";

// ================= CREATE ORDER =================

export const createOrder = async (orderData) => {
  const response = await intance.post(
    "/user/orders",
    orderData
  );

  return response.data;
};

// ================= GET MY ORDERS =================

export const getMyOrders = async () => {
  const response = await intance.get(
    "/user/orders"
  );

  return response.data;
};

// ================= GET ORDER BY ID =================

export const getOrderById = async (orderId) => {
  const response = await intance.get(
    `/user/orders/${orderId}`
  );

  return response.data;
};

// ================= CANCEL ORDER =================

export const cancelOrder = async (orderId) => {
  const response = await intance.delete(
    `/user/orders/${orderId}`
  );

  return response.data;
};