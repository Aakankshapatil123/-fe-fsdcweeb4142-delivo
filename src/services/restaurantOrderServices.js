import intance from "../intances/intance";

// ================= GET RESTAURANT ORDERS =================

export const getRestaurantOrders = async () => {
  const response = await intance.get(
    "/restaurantOwner/orders"
  );

  return response.data;
};

// ================= UPDATE ORDER STATUS =================

export const updateRestaurantOrderStatus = async (
  orderId,
  orderStatus
) => {
  const response = await intance.put(
    `/restaurantOwner/orders/${orderId}`,
    {
      orderStatus,
    }
  );

  return response.data;
};