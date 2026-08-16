import { useState } from "react";
import { useNavigate, useParams } from "react-router";

import intance from "../intances/intance";

const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");

  // =========================================================
  // CREATE RAZORPAY PAYMENT
  // =========================================================

  const createPaymentOrder = async (method) => {
    try {
      setLoading(true);
      setError("");
      setSelectedMethod(method);

      if (!orderId) {
        throw new Error("Order ID is missing.");
      }

      console.log("================================");
      console.log("START PAYMENT");
      console.log("Payment Method:", method);
      console.log("MongoDB Order ID:", orderId);
      console.log("================================");

      // -------------------------------------------------------
      // CREATE RAZORPAY ORDER
      // -------------------------------------------------------

      const response = await intance.post(
        `/payment/create-order/${orderId}`
      );

      console.log(
        "CREATE ORDER RESPONSE:",
        response.data
      );

      const razorpayOrder = response.data?.result;

      if (!razorpayOrder?.id) {
        throw new Error(
          "Razorpay order was not created."
        );
      }

      console.log(
        "Razorpay Order ID:",
        razorpayOrder.id
      );

      // -------------------------------------------------------
      // RAZORPAY KEY
      // -------------------------------------------------------

      const razorpayKey =
        import.meta.env.VITE_RAZORPAY_KEY_ID;

      if (!razorpayKey) {
        throw new Error(
          "Razorpay Key ID is missing. Check your .env file."
        );
      }

      // -------------------------------------------------------
      // CHECK RAZORPAY SDK
      // -------------------------------------------------------

      if (!window.Razorpay) {
        throw new Error(
          "Razorpay SDK is not loaded."
        );
      }

      // -------------------------------------------------------
      // RAZORPAY OPTIONS
      // -------------------------------------------------------

      const options = {
        key: razorpayKey,

        amount: razorpayOrder.amount,

        currency: razorpayOrder.currency,

        name: "Delivo",

        description:
          method === "debit"
            ? "Debit Card Payment"
            : "Credit Card Payment",

        order_id: razorpayOrder.id,

        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999",
        },

        theme: {
          color: "#ea580c",
        },

        // -----------------------------------------------------
        // PAYMENT SUCCESS
        // -----------------------------------------------------

        handler: async (paymentResponse) => {
          try {
            console.log(
              "================================"
            );

            console.log("PAYMENT SUCCESS");

            console.log(
              "Payment Method:",
              method
            );

            console.log(
              "Payment ID:",
              paymentResponse.razorpay_payment_id
            );

            console.log(
              "Razorpay Order ID:",
              paymentResponse.razorpay_order_id
            );

            console.log(
              "Signature:",
              paymentResponse.razorpay_signature
            );

            console.log(
              "================================"
            );

            setLoading(true);
            setError("");

            // -------------------------------------------------
            // VERIFY PAYMENT
            // -------------------------------------------------

            const verifyResponse =
              await intance.post(
                "/payment/verify",
                {
                  orderId: orderId,

                  razorpay_order_id:
                    paymentResponse.razorpay_order_id,

                  razorpay_payment_id:
                    paymentResponse.razorpay_payment_id,

                  razorpay_signature:
                    paymentResponse.razorpay_signature,
                }
              );

            console.log(
              "VERIFY RESPONSE:",
              verifyResponse.data
            );

            // -------------------------------------------------
            // PAYMENT VERIFIED
            // -------------------------------------------------

            if (
              verifyResponse.data?.message ===
                "Payment verified successfully" ||
              verifyResponse.data?.success === true
            ) {
              alert("Payment successful!");

              navigate("/orders");
            } else {
              throw new Error(
                verifyResponse.data?.message ||
                  "Payment verification failed."
              );
            }
          } catch (err) {
            console.error(
              "VERIFY PAYMENT ERROR:",
              err.response?.data || err
            );

            setError(
              err.response?.data?.message ||
                err.message ||
                "Payment verification failed."
            );

            setLoading(false);
          }
        },

        // -----------------------------------------------------
        // MODAL CLOSED
        // -----------------------------------------------------

        modal: {
          ondismiss: () => {
            console.log(
              "Payment modal closed"
            );

            setLoading(false);
            setSelectedMethod("");
          },
        },
      };

      // -------------------------------------------------------
      // OPEN RAZORPAY
      // -------------------------------------------------------

      const razorpay =
        new window.Razorpay(options);

      // -------------------------------------------------------
      // PAYMENT FAILED
      // -------------------------------------------------------

      razorpay.on(
        "payment.failed",
        (response) => {
          console.error(
            "================================"
          );

          console.error(
            "PAYMENT FAILED"
          );

          console.error(
            "Code:",
            response.error?.code
          );

          console.error(
            "Description:",
            response.error?.description
          );

          console.error(
            "Reason:",
            response.error?.reason
          );

          console.error(
            "================================"
          );

          setLoading(false);

          setError(
            response.error?.description ||
              "Payment failed."
          );

          setSelectedMethod("");
        }
      );

      razorpay.open();
    } catch (err) {
      console.error(
        "CREATE PAYMENT ERROR:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to start payment."
      );

      setLoading(false);
      setSelectedMethod("");
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4 py-10">

      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-md sm:p-8">

        {/* ===================================================
            TITLE
        ==================================================== */}

        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Choose Payment Method
          </h1>

          <p className="mt-2 text-gray-500">
            Select your card type to continue
          </p>
        </div>

        {/* ===================================================
            ERROR
        ==================================================== */}

        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-center">

            <div className="text-3xl">
              ❌
            </div>

            <h2 className="mt-2 font-bold text-red-600">
              Payment Failed
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() => {
                setError("");
                setSelectedMethod("");
              }}
              className="mt-4 rounded-lg bg-orange-600 px-5 py-2 font-semibold text-white transition hover:bg-orange-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ===================================================
            PAYMENT CARDS
        ==================================================== */}

        {!error && !loading && (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">

            {/* =================================================
                DEBIT CARD
            ================================================== */}

            <button
              type="button"
              onClick={() =>
                createPaymentOrder("debit")
              }
              className="group rounded-2xl border-2 border-gray-200 bg-white p-6 text-left transition duration-200 hover:-translate-y-1 hover:border-orange-500 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">

                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-100 text-3xl">
                  💳
                </div>

                <span className="text-2xl text-gray-400 transition group-hover:text-orange-500">
                  →
                </span>
              </div>

              <h2 className="mt-5 text-xl font-bold text-gray-900">
                Debit Card
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Pay securely using your debit card
              </p>
            </button>

            {/* =================================================
                CREDIT CARD
            ================================================== */}

            <button
              type="button"
              onClick={() =>
                createPaymentOrder("credit")
              }
              className="group rounded-2xl border-2 border-gray-200 bg-white p-6 text-left transition duration-200 hover:-translate-y-1 hover:border-orange-500 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">

                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-100 text-3xl">
                  💳
                </div>

                <span className="text-2xl text-gray-400 transition group-hover:text-orange-500">
                  →
                </span>
              </div>

              <h2 className="mt-5 text-xl font-bold text-gray-900">
                Credit Card
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Pay securely using your credit card
              </p>
            </button>

          </div>
        )}

        {/* ===================================================
            LOADING
        ==================================================== */}

        {loading && (
          <div className="mt-8 text-center">

            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-orange-600"></div>

            <h2 className="mt-5 text-xl font-bold text-gray-900">
              Opening Payment
            </h2>

            <p className="mt-2 text-gray-500">
              Preparing your{" "}
              {selectedMethod === "debit"
                ? "Debit Card"
                : "Credit Card"}{" "}
              payment...
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Please wait.
            </p>
          </div>
        )}

        {/* ===================================================
            BACK TO ORDERS
        ==================================================== */}

        {!loading && (
          <button
            type="button"
            onClick={() => navigate("/orders")}
            className="mt-8 block w-full text-center text-sm font-medium text-orange-600 transition hover:text-orange-700"
          >
            ← Back to Orders
          </button>
        )}

      </div>
    </div>
  );
};

export default Payment;



