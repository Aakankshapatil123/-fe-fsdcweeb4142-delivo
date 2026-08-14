import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";

import {
  createPaymentOrder,
  verifyPayment,
} from "../services/paymentServices";

const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const paymentMethod = searchParams.get("method");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= OPEN RAZORPAY =================

  const openRazorpay = async () => {
    try {
      setLoading(true);
      setError("");

      // ================= CREATE RAZORPAY ORDER =================

      const response = await createPaymentOrder(orderId);

      console.log("PAYMENT ORDER RESPONSE:", response);

      const razorpayOrder = response?.result;

      if (!razorpayOrder) {
        throw new Error("Razorpay order was not created.");
      }

      console.log("SELECTED PAYMENT METHOD:", paymentMethod);

      // ================= RAZORPAY OPTIONS =================

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: razorpayOrder.amount,

        currency: razorpayOrder.currency,

        name: "Delivo",

        description: "Food Order Payment",

        order_id: razorpayOrder.id,

        // ================= PREFILL =================

        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999",
        },

        // ================= RAZORPAY DISPLAY =================
        // Keep default Razorpay payment methods available.
        // User can choose UPI, Card, Netbanking, etc.

        config: {
          display: {
            preferences: {
              show_default_blocks: true,
            },
          },
        },

        // ================= PAYMENT SUCCESS =================

        handler: async function (paymentResponse) {
          try {
            setLoading(true);
            setError("");

            console.log(
              "PAYMENT RESPONSE:",
              paymentResponse
            );

            // ================= VERIFY PAYMENT =================

            const verifyResponse = await verifyPayment({
              orderId,

              razorpay_order_id:
                paymentResponse.razorpay_order_id,

              razorpay_payment_id:
                paymentResponse.razorpay_payment_id,

              razorpay_signature:
                paymentResponse.razorpay_signature,
            });

            console.log(
              "VERIFY RESPONSE:",
              verifyResponse
            );

            // ================= SUCCESS =================

            navigate("/orders");

          } catch (error) {
            console.log(
              "VERIFY PAYMENT ERROR:",
              error.response?.data?.message ||
                error.message
            );

            setError(
              error.response?.data?.message ||
                "Payment verification failed."
            );

            setLoading(false);
          }
        },

        // ================= THEME =================

        theme: {
          color: "#ea580c",
        },

        // ================= MODAL =================

        modal: {
          ondismiss: function () {
            setLoading(false);

            setError("Payment was cancelled.");
          },
        },
      };

      // ================= CHECK RAZORPAY SDK =================

      if (!window.Razorpay) {
        throw new Error(
          "Razorpay SDK is not loaded."
        );
      }

      // ================= CREATE RAZORPAY INSTANCE =================

      const razorpay =
        new window.Razorpay(options);

      // ================= PAYMENT FAILED =================

      razorpay.on(
        "payment.failed",
        function (response) {
          console.log(
            "PAYMENT FAILED:",
            response
          );

          setLoading(false);

          setError(
            response.error?.description ||
              "Payment failed."
          );
        }
      );

      // ================= OPEN RAZORPAY =================

      razorpay.open();

    } catch (error) {
      console.log(
        "RAZORPAY ERROR:",
        error.response?.data?.message ||
          error.message
      );

      setError(
        error.response?.data?.message ||
          "Unable to start payment."
      );

      setLoading(false);
    }
  };

  // ================= START PAYMENT =================

  useEffect(() => {
    if (orderId) {
      openRazorpay();
    }
  }, [orderId]);

  // ================= UI =================

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-6">

      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-md">

        {/* ================= LOADING ================= */}

        {loading && !error && (
          <>
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-orange-600"></div>

            <h2 className="mt-5 text-xl font-bold text-gray-900">
              Opening Payment
            </h2>

            <p className="mt-2 text-gray-500">
              Please wait while we prepare your payment.
            </p>
          </>
        )}

        {/* ================= ERROR ================= */}

        {error && (
          <>
            <h2 className="text-xl font-bold text-red-600">
              Payment Failed
            </h2>

            <p className="mt-3 text-gray-600">
              {error}
            </p>

            <button
              onClick={openRazorpay}
              className="mt-6 rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700"
            >
              Try Again
            </button>

            <button
              onClick={() => navigate("/orders")}
              className="mt-3 block w-full text-orange-600 hover:text-orange-700"
            >
              Go to Orders
            </button>
          </>
        )}

      </div>

    </div>
  );
};

export default Payment;