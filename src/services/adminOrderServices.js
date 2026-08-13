import intance from "../intances/intance";

// ================= GET ALL ORDERS =================

export const getAllOrders = async () => {
  const response = await intance.get(
    "/restaurant/orders"
  );

  return response.data;
};

// ================= GET ORDER BY ID =================

export const getAdminOrderById = async (orderId) => {
  const response = await intance.get(
    `/restaurant/orders/${orderId}`
  );

  return response.data;
};

// ================= UPDATE ORDER STATUS =================

export const updateAdminOrderStatus = async (
  orderId,
  orderStatus
) => {
  const response = await intance.put(
    `/restaurant/orders/${orderId}`,
    {
      orderStatus,
    }
  );

  return response.data;
};