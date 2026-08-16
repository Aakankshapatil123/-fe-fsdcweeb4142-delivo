import intance from "../intances/intance";

// Create Razorpay Order
export const createPaymentOrder = async (orderId) => {
  const response = await intance.post(
    `/payment/create-order/${orderId}`
  );

  return response.data;
};

// Verify Razorpay Payment
export const verifyPayment = async (paymentData) => {
  const response = await intance.post(
    "/payment/verify",
    paymentData
  );

  return response.data;
};