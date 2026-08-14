import intance from "../intances/intance";

export const createPaymentOrder = async (orderId) => {
  const response = await intance.post(
    "/payment",
    { orderId }
  );

  return response.data;
};

export const verifyPayment = async (paymentData) => {
  const response = await intance.post(
    "/payment/verify",
    paymentData
  );

  return response.data;
};