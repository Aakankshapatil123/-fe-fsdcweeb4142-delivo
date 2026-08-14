import { useEffect, useState } from "react";
import { Link } from "react-router";

import {
  getAllReviews,
  deleteReview,
} from "../services/adminReviewService";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= FETCH REVIEWS =================

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllReviews();

      console.log("ADMIN REVIEWS RESPONSE:", response);

      setReviews(response.result || []);
    } catch (error) {
      console.log(
        "GET REVIEWS ERROR:",
        error.response?.data?.message || error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to load reviews"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // ================= DELETE REVIEW =================

  const handleDelete = async (reviewId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteReview(reviewId);

      setReviews((previousReviews) =>
        previousReviews.filter(
          (review) => review._id !== reviewId
        )
      );

      alert("Review deleted successfully");
    } catch (error) {
      console.log(
        "DELETE REVIEW ERROR:",
        error.response?.data?.message || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete review"
      );
    }
  };

  // ================= RATING =================

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={
              star <= rating
                ? "text-yellow-500"
                : "text-gray-300"
            }
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg font-semibold text-gray-600">
          Loading reviews...
        </p>
      </div>
    );
  }

  // ================= ERROR =================

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="text-center">
          <p className="font-semibold text-red-500">
            {error}
          </p>

          <button
            onClick={fetchReviews}
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

        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Manage Reviews
            </h1>

            <p className="mt-2 text-gray-600">
              View and moderate customer reviews
            </p>
          </div>

          <Link
            to="/admin/dashboard"
            className="rounded-lg bg-gray-700 px-5 py-3 text-center font-semibold text-white hover:bg-gray-800"
          >
            ← Dashboard
          </Link>

        </div>

        {/* ================= REVIEW COUNT ================= */}

        <div className="mb-6 rounded-2xl bg-white p-6 shadow-md">

          <p className="text-sm text-gray-500">
            Total Reviews
          </p>

          <p className="mt-1 text-3xl font-bold text-gray-800">
            {reviews.length}
          </p>

        </div>

        {/* ================= NO REVIEWS ================= */}

        {reviews.length === 0 ? (

          <div className="rounded-2xl bg-white p-10 text-center shadow-md">

            <div className="text-5xl">
              ⭐
            </div>

            <h2 className="mt-4 text-xl font-bold text-gray-800">
              No reviews found
            </h2>

            <p className="mt-2 text-gray-600">
              There are no customer reviews available.
            </p>

          </div>

        ) : (

          /* ================= REVIEWS ================= */

          <div className="space-y-5">

            {reviews.map((review) => (

              <div
                key={review._id}
                className="rounded-2xl bg-white p-6 shadow-md"
              >

                {/* TOP */}

                <div className="flex flex-col justify-between gap-4 md:flex-row">

                  {/* USER */}

                  <div>

                    <p className="text-sm text-gray-500">
                      Customer
                    </p>

                    <h2 className="text-lg font-bold text-gray-800">
                      {review.user?.name || "Unknown User"}
                    </h2>

                    <p className="text-sm text-gray-500">
                      {review.user?.email || ""}
                    </p>

                  </div>

                  {/* RATING */}

                  <div>
                    {renderStars(review.rating)}

                    <p className="mt-1 text-sm font-semibold text-gray-600">
                      {review.rating || 0}/5
                    </p>
                  </div>

                </div>

                {/* RESTAURANT */}

                <div className="mt-5 rounded-xl bg-gray-50 p-4">

                  <p className="text-sm text-gray-500">
                    Restaurant
                  </p>

                  <p className="mt-1 font-bold text-gray-800">
                    {review.restaurant?.name ||
                      "Unknown Restaurant"}
                  </p>

                </div>

                {/* COMMENT */}

                <div className="mt-5">

                  <p className="text-sm font-semibold text-gray-500">
                    Review
                  </p>

                  <p className="mt-2 rounded-xl bg-orange-50 p-4 text-gray-700">
                    {review.comment ||
                      "No comment provided"}
                  </p>

                </div>

                {/* DATE */}

                <div className="mt-5 flex flex-col justify-between gap-4 border-t pt-5 md:flex-row md:items-center">

                  <p className="text-sm text-gray-500">
                    Reviewed on:{" "}
                    {review.createdAt
                      ? new Date(
                          review.createdAt
                        ).toLocaleString()
                      : "N/A"}
                  </p>

                  {/* DELETE */}

                  <button
                    onClick={() =>
                      handleDelete(review._id)
                    }
                    className="rounded-lg bg-red-500 px-5 py-2 font-semibold text-white hover:bg-red-600"
                  >
                    Delete Review
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
};

export default AdminReviews;