import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import jsPDF from "jspdf";

import { setUser, logout } from "../redux/authSlice";
import intance from "../intances/intance";

import {
  updateProfile,
  getMyNotifications,
  markNotificationAsRead,
  getMyPaymentHistory,
} from "../services/userProfileServices";


const API_URL = import.meta.env.VITE_API_URL.replace("/api/v1", "");


const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  // =======================================================
  // PROFILE STATE
  // =======================================================

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: {
      address: "",
      city: "",
      state: "",
    },
    notificationEnabled: true,
  });

  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // =======================================================
  // ACTIVE SECTION
  // =======================================================

  const [activeSection, setActiveSection] = useState("profile");

  // =======================================================
  // REVIEWS
  // =======================================================

  const [myReviews, setMyReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const [editingReviewId, setEditingReviewId] = useState(null);

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });

  // =======================================================
  // NOTIFICATIONS
  // =======================================================

  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] =
    useState(false);

  const [notificationUpdating, setNotificationUpdating] =
    useState(false);

  // =======================================================
  // PAYMENT HISTORY
  // =======================================================

  const [paymentHistory, setPaymentHistory] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // =======================================================
  // AUTH CHECK
  // =======================================================

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // =======================================================
  // IMAGE URL HELPER
  // =======================================================

  const getImageUrl = (image) => {
    if (!image) {
      return "";
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `${API_URL}${image}`;
  };

  // =======================================================
  // SET USER DATA
  // =======================================================

  useEffect(() => {
    if (!user) {
      return;
    }

    setFormData({
      name: user.name || "",
      phone: user.phone || "",

      location: {
        address: user.location?.address || "",
        city: user.location?.city || "",
        state: user.location?.state || "",
      },

      notificationEnabled:
        user.notificationEnabled ?? true,
    });

    setPreviewImage(
      getImageUrl(user.profilePicture)
    );
  }, [user]);

  // =======================================================
  // GET MY REVIEWS
  // =======================================================

  const getMyReviews = async () => {
    try {
      setReviewsLoading(true);

      const response = await intance.get(
        "/user/reviews/my"
      );

      const result =
        response?.data?.result ||
        response?.data?.data ||
        response?.data ||
        [];

      setMyReviews(
        Array.isArray(result) ? result : []
      );
    } catch (error) {
      console.error(
        "GET MY REVIEWS ERROR:",
        error.response?.data?.message ||
          error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to fetch your reviews."
      );
    } finally {
      setReviewsLoading(false);
    }
  };

  // =======================================================
  // GET NOTIFICATIONS
  // =======================================================

  const getNotifications = async () => {
    try {
      setNotificationsLoading(true);

      const response =
        await getMyNotifications();

      const result =
        response?.result ||
        response?.data?.result ||
        response?.data ||
        [];

      setNotifications(
        Array.isArray(result) ? result : []
      );
    } catch (error) {
      console.error(
        "GET NOTIFICATIONS ERROR:",
        error.response?.data?.message ||
          error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to fetch notifications."
      );
    } finally {
      setNotificationsLoading(false);
    }
  };

  // =======================================================
  // GET PAYMENT HISTORY
  // =======================================================

  const getPaymentHistory = async () => {
    try {
      setPaymentLoading(true);

      const response =
        await getMyPaymentHistory();

      console.log(
        "PAYMENT HISTORY RESPONSE:",
        response
      );

      const result =
        response?.result ||
        response?.data?.result ||
        response?.data ||
        [];

      setPaymentHistory(
        Array.isArray(result) ? result : []
      );
    } catch (error) {
      console.error(
        "GET PAYMENT HISTORY ERROR:",
        error.response?.data?.message ||
          error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to fetch payment history."
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  // =======================================================
  // LOAD REVIEWS
  // =======================================================

  useEffect(() => {
    if (
      isAuthenticated &&
      activeSection === "reviews"
    ) {
      getMyReviews();
    }
  }, [activeSection, isAuthenticated]);

  // =======================================================
  // LOAD NOTIFICATIONS
  // =======================================================

  useEffect(() => {
    if (
      isAuthenticated &&
      activeSection === "notifications"
    ) {
      getNotifications();
    }
  }, [activeSection, isAuthenticated]);

  // =======================================================
  // LOAD PAYMENT HISTORY
  // =======================================================

  useEffect(() => {
    if (
      isAuthenticated &&
      activeSection === "payments"
    ) {
      getPaymentHistory();
    }
  }, [activeSection, isAuthenticated]);

  // =======================================================
  // FORM CHANGE
  // =======================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =======================================================
  // LOCATION CHANGE
  // =======================================================

  const handleLocationChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,

      location: {
        ...previous.location,
        [name]: value,
      },
    }));
  };

  // =======================================================
  // IMAGE CHANGE
  // =======================================================

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB.");
      return;
    }

    setProfileImage(file);

    const imageUrl =
      URL.createObjectURL(file);

    setPreviewImage(imageUrl);
  };

  // =======================================================
  // CREATE PROFILE FORM DATA
  // =======================================================

  const createProfileFormData = (
    notificationStatus =
      formData.notificationEnabled
  ) => {
    const data = new FormData();

    data.append(
      "name",
      formData.name.trim()
    );

    data.append(
      "phone",
      formData.phone.trim()
    );

    data.append(
      "location",
      JSON.stringify(formData.location)
    );

    data.append(
      "notificationEnabled",
      notificationStatus
    );

    if (profileImage) {
      data.append(
        "profilePicture",
        profileImage
      );
    }

    return data;
  };

  // =======================================================
  // UPDATE PROFILE
  // =======================================================

  const handleUpdateProfile = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      alert("Name is required.");
      return;
    }

    try {
      setLoading(true);

      const data =
        createProfileFormData();

      const response =
        await updateProfile(data);

      console.log(
        "PROFILE UPDATE RESPONSE:",
        response
      );

      const updatedUser =
        response?.result ||
        response?.data?.result ||
        response?.data;

      if (updatedUser) {
        dispatch(setUser(updatedUser));

        setFormData({
          name: updatedUser.name || "",
          phone: updatedUser.phone || "",

          location: {
            address:
              updatedUser.location?.address || "",
            city:
              updatedUser.location?.city || "",
            state:
              updatedUser.location?.state || "",
          },

          notificationEnabled:
            updatedUser.notificationEnabled ??
            true,
        });

        setPreviewImage(
          getImageUrl(
            updatedUser.profilePicture
          )
        );
      }

      setProfileImage(null);
      setEditing(false);

      alert(
        "Profile updated successfully."
      );
    } catch (error) {
      console.error(
        "UPDATE PROFILE ERROR:",
        error.response?.data?.message ||
          error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setLoading(false);
    }
  };

  // =======================================================
  // NOTIFICATION TOGGLE
  // =======================================================

  const handleNotificationToggle = async () => {
    try {
      setNotificationUpdating(true);

      const newStatus =
        !formData.notificationEnabled;

      const data =
        createProfileFormData(
          newStatus
        );

      const response =
        await updateProfile(data);

      const updatedUser =
        response?.result ||
        response?.data?.result ||
        response?.data;

      if (updatedUser) {
        dispatch(setUser(updatedUser));

        setFormData((previous) => ({
          ...previous,

          notificationEnabled:
            updatedUser.notificationEnabled ??
            newStatus,
        }));
      } else {
        setFormData((previous) => ({
          ...previous,

          notificationEnabled:
            newStatus,
        }));
      }
    } catch (error) {
      console.error(
        "NOTIFICATION TOGGLE ERROR:",
        error.response?.data?.message ||
          error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to update notification setting."
      );
    } finally {
      setNotificationUpdating(false);
    }
  };

  // =======================================================
  // CANCEL PROFILE EDIT
  // =======================================================

  const handleCancelEdit = () => {
    setEditing(false);
    setProfileImage(null);

    if (!user) {
      return;
    }

    setFormData({
      name: user.name || "",
      phone: user.phone || "",

      location: {
        address:
          user.location?.address || "",
        city:
          user.location?.city || "",
        state:
          user.location?.state || "",
      },

      notificationEnabled:
        user.notificationEnabled ?? true,
    });

    setPreviewImage(
      getImageUrl(user.profilePicture)
    );
  };

  // =======================================================
  // MARK NOTIFICATION AS READ
  // =======================================================

  const handleMarkAsRead = async (
    notificationId
  ) => {
    try {
      const response =
        await markNotificationAsRead(
          notificationId
        );

      const updatedNotification =
        response?.result ||
        response?.data?.result ||
        response?.data;

      if (updatedNotification) {
        setNotifications((previous) =>
          previous.map((notification) =>
            notification._id ===
            notificationId
              ? updatedNotification
              : notification
          )
        );
      } else {
        setNotifications((previous) =>
          previous.map((notification) =>
            notification._id ===
            notificationId
              ? {
                  ...notification,
                  isRead: true,
                }
              : notification
          )
        );
      }
    } catch (error) {
      console.error(
        "MARK READ ERROR:",
        error.response?.data?.message ||
          error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to mark notification as read."
      );
    }
  };

  // =======================================================
  // EDIT REVIEW
  // =======================================================

  const handleEditReview = (review) => {
    setEditingReviewId(review._id);

    setReviewForm({
      rating:
        Number(review.rating) || 5,
      comment:
        review.comment || "",
    });
  };

  // =======================================================
  // REVIEW FORM CHANGE
  // =======================================================

  const handleReviewChange = (event) => {
    const { name, value } =
      event.target;

    setReviewForm((previous) => ({
      ...previous,

      [name]:
        name === "rating"
          ? Number(value)
          : value,
    }));
  };

  // =======================================================
  // UPDATE REVIEW
  // =======================================================

  const handleUpdateReview = async (
    reviewId
  ) => {
    if (
      reviewForm.rating < 1 ||
      reviewForm.rating > 5
    ) {
      alert(
        "Rating must be between 1 and 5."
      );
      return;
    }

    if (
      !reviewForm.comment.trim()
    ) {
      alert("Comment is required.");
      return;
    }

    try {
      await intance.put(
        `/user/reviews/${reviewId}`,
        {
          rating:
            reviewForm.rating,

          comment:
            reviewForm.comment.trim(),
        }
      );

      alert(
        "Review updated successfully."
      );

      setEditingReviewId(null);

      setReviewForm({
        rating: 5,
        comment: "",
      });

      getMyReviews();
    } catch (error) {
      console.error(
        "UPDATE REVIEW ERROR:",
        error.response?.data?.message ||
          error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to update review."
      );
    }
  };

  // =======================================================
  // DELETE REVIEW
  // =======================================================

  const handleDeleteReview = async (
    reviewId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this review?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await intance.delete(
        `/user/reviews/${reviewId}`
      );

      alert(
        "Review deleted successfully."
      );

      getMyReviews();
    } catch (error) {
      console.error(
        "DELETE REVIEW ERROR:",
        error.response?.data?.message ||
          error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete review."
      );
    }
  };

  // =======================================================
  // CANCEL REVIEW EDIT
  // =======================================================

  const handleCancelReviewEdit = () => {
    setEditingReviewId(null);

    setReviewForm({
      rating: 5,
      comment: "",
    });
  };

  // =======================================================
  // LOGOUT
  // =======================================================

  const handleLogout = () => {
    const confirmed =
      window.confirm(
        "Are you sure you want to logout?"
      );

    if (!confirmed) {
      return;
    }

    dispatch(logout());

    navigate("/login");
  };

  // =======================================================
  // PAYMENT STATUS CLASS
  // =======================================================

  const getPaymentStatusClass = (
    status
  ) => {
    const normalizedStatus =
      status?.toLowerCase();

    if (
      normalizedStatus === "success" ||
      normalizedStatus === "paid" ||
      normalizedStatus === "completed"
    ) {
      return "bg-green-100 text-green-700";
    }

    if (
      normalizedStatus === "failed"
    ) {
      return "bg-red-100 text-red-700";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  // =======================================================
  // PAYMENT STATUS MESSAGE
  // =======================================================

  const getPaymentStatusMessage = (
    status
  ) => {
    const normalizedStatus =
      status?.toLowerCase();

    if (
      normalizedStatus === "success" ||
      normalizedStatus === "paid" ||
      normalizedStatus === "completed"
    ) {
      return (
        <p className="text-sm font-semibold text-green-600">
          ✓ Payment completed successfully
        </p>
      );
    }

    if (
      normalizedStatus === "failed"
    ) {
      return (
        <p className="text-sm font-semibold text-red-600">
          ✕ Payment failed
        </p>
      );
    }

    return (
      <p className="text-sm font-semibold text-yellow-600">
        ⏳ Payment is pending
      </p>
    );
  };

  // =======================================================
  // DOWNLOAD PAYMENT RECEIPT PDF
  // =======================================================

  const downloadReceipt = (payment) => {
    try {
      const doc = new jsPDF();

      const restaurantName =
        payment?.restaurant?.name ||
        payment?.restaurantName ||
        "Delivo Restaurant";

      const amount = Number(
        payment?.totalAmount ??
          payment?.amount ??
          0
      );

      const paymentStatus =
        payment?.paymentStatus ||
        "Pending";

      const paymentMethod =
        payment?.paymentMethod ||
        "N/A";

      const paymentId =
        payment?.paymentId ||
        payment?.razorpayPaymentId ||
        "Not available";

      const razorpayOrderId =
        payment?.paymentOrderId ||
        payment?.razorpayOrderId ||
        "Not available";

      const orderId =
        payment?.orderId?._id ||
        payment?.orderId ||
        payment?.order?._id ||
        "Not available";

      const paymentDate =
        payment?.createdAt
          ? new Date(
              payment.createdAt
            ).toLocaleString("en-IN")
          : new Date().toLocaleString(
              "en-IN"
            );

      // ---------------------------------------------------
      // HEADER
      // ---------------------------------------------------

      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text(
        "DELIVO",
        105,
        25,
        {
          align: "center",
        }
      );

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(
        "Online Food Delivery",
        105,
        33,
        {
          align: "center",
        }
      );

      // ---------------------------------------------------
      // RECEIPT TITLE
      // ---------------------------------------------------

      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text(
        "PAYMENT RECEIPT",
        105,
        50,
        {
          align: "center",
        }
      );

      // ---------------------------------------------------
      // LINE
      // ---------------------------------------------------

      doc.line(
        20,
        58,
        190,
        58
      );

      // ---------------------------------------------------
      // CUSTOMER DETAILS
      // ---------------------------------------------------

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");

      doc.text(
        "Customer Details",
        20,
        70
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.text(
        `Name: ${user?.name || "Customer"}`,
        20,
        79
      );

      doc.text(
        `Email: ${user?.email || "N/A"}`,
        20,
        87
      );

      doc.text(
        `Phone: ${user?.phone || "N/A"}`,
        20,
        95
      );

      // ---------------------------------------------------
      // RESTAURANT DETAILS
      // ---------------------------------------------------

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.text(
        "Restaurant Details",
        20,
        110
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.text(
        `Restaurant: ${restaurantName}`,
        20,
        119
      );

      // ---------------------------------------------------
      // PAYMENT DETAILS
      // ---------------------------------------------------

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.text(
        "Payment Details",
        20,
        135
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.text(
        `Amount: Rs. ${amount.toFixed(2)}`,
        20,
        145
      );

      doc.text(
        `Payment Method: ${paymentMethod}`,
        20,
        153
      );

      doc.text(
        `Payment Status: ${paymentStatus}`,
        20,
        161
      );

      doc.text(
        `Payment Date: ${paymentDate}`,
        20,
        169
      );

      // ---------------------------------------------------
      // IDS
      // ---------------------------------------------------

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.text(
        "Transaction Information",
        20,
        185
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.text(
        `Order ID: ${orderId}`,
        20,
        195
      );

      doc.text(
        `Razorpay Order ID: ${razorpayOrderId}`,
        20,
        203
      );

      doc.text(
        `Payment ID: ${paymentId}`,
        20,
        211
      );

      // ---------------------------------------------------
      // FOOTER
      // ---------------------------------------------------

      doc.line(
        20,
        225,
        190,
        225
      );

      doc.setFontSize(10);

      doc.text(
        "Thank you for ordering with Delivo!",
        105,
        238,
        {
          align: "center",
        }
      );

      doc.text(
        "This is a computer-generated payment receipt.",
        105,
        246,
        {
          align: "center",
        }
      );

      // ---------------------------------------------------
      // FILE NAME
      // ---------------------------------------------------

      const safeRestaurantName =
        restaurantName
          .replace(
            /[^a-zA-Z0-9]/g,
            "_"
          );

      const fileName =
        `Delivo_Receipt_${safeRestaurantName}_${Date.now()}.pdf`;

      doc.save(fileName);

      alert(
        "Payment receipt downloaded successfully."
      );
    } catch (error) {
      console.error(
        "RECEIPT DOWNLOAD ERROR:",
        error
      );

      alert(
        "Failed to generate payment receipt."
      );
    }
  };

  // =======================================================
  // PROFILE AVATAR
  // =======================================================

  const ProfileAvatar = ({
    size = "large",
  }) => {
    const sizeClass =
      size === "small"
        ? "h-24 w-24"
        : "h-28 w-28";

    const textClass =
      size === "small"
        ? "text-4xl"
        : "text-5xl";

    return (
      <div
        className={`${sizeClass} overflow-hidden rounded-full bg-orange-100`}
      >
        {previewImage ? (
          <img
            src={previewImage}
            alt="Profile"
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display =
                "none";
            }}
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center font-bold text-orange-500 ${textClass}`}
          >
            {user?.name
              ?.charAt(0)
              ?.toUpperCase() || "U"}
          </div>
        )}
      </div>
    );
  };

  // =======================================================
  // LOADING
  // =======================================================

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="font-semibold text-gray-600">
          Loading profile...
        </p>
      </div>
    );
  }

  // =======================================================
  // RETURN
  // =======================================================

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            My Profile
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your account, orders,
            reviews and preferences.
          </p>
        </div>

        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div className="grid gap-6 md:grid-cols-12">

          {/* =================================================
              SIDEBAR
          ================================================= */}

          <aside className="md:col-span-4 lg:col-span-3">
            <div className="rounded-2xl bg-white p-5 shadow-md">

              {/* PROFILE SUMMARY */}

              <div className="border-b pb-5 text-center">
                <div className="flex justify-center">
                  <ProfileAvatar size="small" />
                </div>

                <h2 className="mt-4 text-xl font-bold text-gray-900">
                  {user.name}
                </h2>

                <p className="mt-1 break-all text-sm text-gray-500">
                  {user.email}
                </p>
              </div>

              {/* MENU */}

              <div className="mt-5 space-y-2">

                <button
                  type="button"
                  onClick={() =>
                    setActiveSection("profile")
                  }
                  className={`w-full rounded-lg px-4 py-3 text-left font-semibold transition ${
                    activeSection === "profile"
                      ? "bg-orange-500 text-white"
                      : "text-gray-700 hover:bg-orange-50"
                  }`}
                >
                  👤 Profile
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/orders")
                  }
                  className="w-full rounded-lg px-4 py-3 text-left font-semibold text-gray-700 transition hover:bg-orange-50"
                >
                  📦 My Orders
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActiveSection("reviews")
                  }
                  className={`w-full rounded-lg px-4 py-3 text-left font-semibold transition ${
                    activeSection === "reviews"
                      ? "bg-orange-500 text-white"
                      : "text-gray-700 hover:bg-orange-50"
                  }`}
                >
                  ⭐ My Reviews
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/favorites")
                  }
                  className="w-full rounded-lg px-4 py-3 text-left font-semibold text-gray-700 transition hover:bg-orange-50"
                >
                  ❤️ Favorites
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActiveSection(
                      "notifications"
                    )
                  }
                  className={`w-full rounded-lg px-4 py-3 text-left font-semibold transition ${
                    activeSection ===
                    "notifications"
                      ? "bg-orange-500 text-white"
                      : "text-gray-700 hover:bg-orange-50"
                  }`}
                >
                  🔔 Notifications
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActiveSection("payments")
                  }
                  className={`w-full rounded-lg px-4 py-3 text-left font-semibold transition ${
                    activeSection === "payments"
                      ? "bg-orange-500 text-white"
                      : "text-gray-700 hover:bg-orange-50"
                  }`}
                >
                  💳 Payment History
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-lg px-4 py-3 text-left font-semibold text-red-600 transition hover:bg-red-50"
                >
                  🚪 Logout
                </button>

              </div>
            </div>
          </aside>

          {/* =================================================
              CONTENT
          ================================================= */}

          <main className="md:col-span-8 lg:col-span-9">

            {/* =================================================
                PROFILE SECTION
            ================================================= */}

            {activeSection === "profile" && (
              <div className="rounded-2xl bg-white p-6 shadow-md md:p-8">

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Personal Information
                    </h2>

                    <p className="mt-1 text-gray-500">
                      Manage your personal details.
                    </p>
                  </div>

                  {!editing && (
                    <button
                      type="button"
                      onClick={() =>
                        setEditing(true)
                      }
                      className="rounded-lg bg-orange-500 px-5 py-2.5 font-semibold text-white transition hover:bg-orange-600"
                    >
                      Edit Profile
                    </button>
                  )}

                </div>

                <form
                  onSubmit={
                    handleUpdateProfile
                  }
                  className="mt-8"
                >

                  {/* PROFILE IMAGE */}

                  <div className="mb-8 flex flex-col items-center sm:flex-row sm:items-start sm:gap-6">

                    <ProfileAvatar />

                    {editing && (
                      <div className="mt-4 sm:mt-2">

                        <label className="cursor-pointer rounded-lg border border-orange-500 px-4 py-2 font-semibold text-orange-500 transition hover:bg-orange-50">

                          Change Photo

                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            onChange={
                              handleImageChange
                            }
                            className="hidden"
                          />

                        </label>

                        <p className="mt-2 text-sm text-gray-500">
                          JPG, PNG, JPEG or WEBP
                          (Max 5MB)
                        </p>

                      </div>
                    )}

                  </div>

                  {/* BASIC DETAILS */}

                  <div className="grid gap-6 md:grid-cols-2">

                    <div>
                      <label className="mb-2 block font-semibold text-gray-700">
                        Full Name
                      </label>

                      <input
                        type="text"
                        name="name"
                        value={
                          formData.name
                        }
                        onChange={
                          handleChange
                        }
                        disabled={!editing}
                        placeholder="Enter your name"
                        className={`w-full rounded-lg border px-4 py-3 outline-none transition ${
                          editing
                            ? "border-gray-300 focus:border-orange-500"
                            : "border-gray-200 bg-gray-50"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block font-semibold text-gray-700">
                        Email
                      </label>

                      <input
                        type="email"
                        value={
                          user.email || ""
                        }
                        disabled
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block font-semibold text-gray-700">
                        Phone Number
                      </label>

                      <input
                        type="text"
                        name="phone"
                        value={
                          formData.phone
                        }
                        onChange={
                          handleChange
                        }
                        disabled={!editing}
                        placeholder="Enter phone number"
                        className={`w-full rounded-lg border px-4 py-3 outline-none transition ${
                          editing
                            ? "border-gray-300 focus:border-orange-500"
                            : "border-gray-200 bg-gray-50"
                        }`}
                      />
                    </div>

                  </div>

                  {/* LOCATION */}

                  <div className="mt-8">

                    <h3 className="text-xl font-bold text-gray-900">
                      Delivery Address
                    </h3>

                    <div className="mt-4 grid gap-6 md:grid-cols-2">

                      <div className="md:col-span-2">
                        <label className="mb-2 block font-semibold text-gray-700">
                          Address
                        </label>

                        <input
                          type="text"
                          name="address"
                          value={
                            formData.location
                              .address
                          }
                          onChange={
                            handleLocationChange
                          }
                          disabled={!editing}
                          placeholder="Enter your address"
                          className={`w-full rounded-lg border px-4 py-3 outline-none transition ${
                            editing
                              ? "border-gray-300 focus:border-orange-500"
                              : "border-gray-200 bg-gray-50"
                          }`}
                        />
                      </div>

                      <div>
                        <label className="mb-2 block font-semibold text-gray-700">
                          City
                        </label>

                        <input
                          type="text"
                          name="city"
                          value={
                            formData.location
                              .city
                          }
                          onChange={
                            handleLocationChange
                          }
                          disabled={!editing}
                          placeholder="Enter city"
                          className={`w-full rounded-lg border px-4 py-3 outline-none transition ${
                            editing
                              ? "border-gray-300 focus:border-orange-500"
                              : "border-gray-200 bg-gray-50"
                          }`}
                        />
                      </div>

                      <div>
                        <label className="mb-2 block font-semibold text-gray-700">
                          State
                        </label>

                        <input
                          type="text"
                          name="state"
                          value={
                            formData.location
                              .state
                          }
                          onChange={
                            handleLocationChange
                          }
                          disabled={!editing}
                          placeholder="Enter state"
                          className={`w-full rounded-lg border px-4 py-3 outline-none transition ${
                            editing
                              ? "border-gray-300 focus:border-orange-500"
                              : "border-gray-200 bg-gray-50"
                          }`}
                        />
                      </div>

                    </div>
                  </div>

                  {/* NOTIFICATION SETTING */}

                  <div className="mt-8 rounded-xl bg-gray-50 p-5">

                    <div className="flex items-center justify-between gap-4">

                      <div>
                        <h3 className="font-bold text-gray-900">
                          Order Notifications
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Receive updates about your
                          orders and delivery.
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={
                          notificationUpdating
                        }
                        onClick={
                          handleNotificationToggle
                        }
                        className={`relative h-7 w-12 rounded-full transition ${
                          formData.notificationEnabled
                            ? "bg-orange-500"
                            : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                            formData.notificationEnabled
                              ? "right-1"
                              : "left-1"
                          }`}
                        />
                      </button>

                    </div>

                    <p
                      className={`mt-3 text-sm font-semibold ${
                        formData.notificationEnabled
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {formData.notificationEnabled
                        ? "Notifications are ON"
                        : "Notifications are OFF"}
                    </p>

                  </div>

                  {/* SAVE / CANCEL */}

                  {editing && (
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                      <button
                        type="submit"
                        disabled={loading}
                        className={`rounded-lg px-6 py-3 font-semibold text-white transition ${
                          loading
                            ? "cursor-not-allowed bg-gray-400"
                            : "bg-orange-500 hover:bg-orange-600"
                        }`}
                      >
                        {loading
                          ? "Saving..."
                          : "Save Changes"}
                      </button>

                      <button
                        type="button"
                        onClick={
                          handleCancelEdit
                        }
                        className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
                      >
                        Cancel
                      </button>

                    </div>
                  )}

                </form>
              </div>
            )}

            {/* =================================================
                REVIEWS
            ================================================= */}

            {activeSection === "reviews" && (
              <div className="rounded-2xl bg-white p-6 shadow-md md:p-8">

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      My Reviews
                    </h2>

                    <p className="mt-2 text-gray-500">
                      View and manage your restaurant reviews.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={getMyReviews}
                    disabled={reviewsLoading}
                    className="rounded-lg border border-orange-500 px-4 py-2 font-semibold text-orange-500 transition hover:bg-orange-50 disabled:opacity-50"
                  >
                    Refresh
                  </button>

                </div>

                {reviewsLoading && (
                  <div className="mt-8 rounded-xl bg-gray-50 p-8 text-center">
                    <p className="font-semibold text-gray-600">
                      Loading your reviews...
                    </p>
                  </div>
                )}

                {!reviewsLoading &&
                  myReviews.length === 0 && (
                    <div className="mt-8 rounded-xl bg-gray-50 p-8 text-center">

                      <div className="text-5xl">
                        ⭐
                      </div>

                      <h3 className="mt-4 text-xl font-bold text-gray-800">
                        No Reviews Yet
                      </h3>

                      <p className="mt-2 text-gray-500">
                        You have not reviewed any
                        restaurant yet.
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            "/restaurants"
                          )
                        }
                        className="mt-5 rounded-lg bg-orange-500 px-5 py-2.5 font-semibold text-white hover:bg-orange-600"
                      >
                        Browse Restaurants
                      </button>

                    </div>
                  )}

                {!reviewsLoading &&
                  myReviews.length > 0 && (
                    <div className="mt-8 space-y-5">

                      {myReviews.map(
                        (review) => (
                          <div
                            key={review._id}
                            className="rounded-xl border border-gray-200 p-5"
                          >

                            <div className="flex flex-col gap-4 sm:flex-row">

                              {/* RESTAURANT IMAGE */}

                              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">

                                {review.restaurant
                                  ?.image ? (
                                  <img
                                    src={getImageUrl(
                                      review.restaurant.image
                                    )}
                                    alt={
                                      review.restaurant.name ||
                                      "Restaurant"
                                    }
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-3xl">
                                    🍽️
                                  </div>
                                )}

                              </div>

                              {/* REVIEW */}

                              <div className="flex-1">

                                <div className="flex flex-col justify-between gap-2 sm:flex-row">

                                  <div>
                                    <h3 className="text-lg font-bold text-gray-900">
                                      {review.restaurant?.name ||
                                        "Restaurant"}
                                    </h3>

                                    {review.restaurant?.cuisine && (
                                      <p className="text-sm text-gray-500">
                                        {
                                          review.restaurant
                                            .cuisine
                                        }
                                      </p>
                                    )}
                                  </div>

                                  <p className="text-sm text-gray-500">
                                    {review.createdAt
                                      ? new Date(
                                          review.createdAt
                                        ).toLocaleDateString(
                                          "en-IN"
                                        )
                                      : ""}
                                  </p>

                                </div>

                                {/* EDIT REVIEW */}

                                {editingReviewId ===
                                review._id ? (
                                  <div className="mt-5 rounded-xl bg-gray-50 p-4">

                                    <label className="mb-2 block font-semibold text-gray-700">
                                      Rating
                                    </label>

                                    <select
                                      name="rating"
                                      value={
                                        reviewForm.rating
                                      }
                                      onChange={
                                        handleReviewChange
                                      }
                                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-orange-500"
                                    >
                                      <option value={1}>
                                        ⭐ 1
                                      </option>

                                      <option value={2}>
                                        ⭐⭐ 2
                                      </option>

                                      <option value={3}>
                                        ⭐⭐⭐ 3
                                      </option>

                                      <option value={4}>
                                        ⭐⭐⭐⭐ 4
                                      </option>

                                      <option value={5}>
                                        ⭐⭐⭐⭐⭐ 5
                                      </option>
                                    </select>

                                    <label className="mb-2 mt-4 block font-semibold text-gray-700">
                                      Comment
                                    </label>

                                    <textarea
                                      name="comment"
                                      value={
                                        reviewForm.comment
                                      }
                                      onChange={
                                        handleReviewChange
                                      }
                                      rows={4}
                                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                                      placeholder="Write your review comment..."
                                    />

                                    <div className="mt-4 flex flex-wrap gap-3">

                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleUpdateReview(
                                            review._id
                                          )
                                        }
                                        className="rounded-lg bg-orange-500 px-5 py-2 font-semibold text-white hover:bg-orange-600"
                                      >
                                        Save Review
                                      </button>

                                      <button
                                        type="button"
                                        onClick={
                                          handleCancelReviewEdit
                                        }
                                        className="rounded-lg border border-gray-300 px-5 py-2 font-semibold text-gray-700 hover:bg-gray-100"
                                      >
                                        Cancel
                                      </button>

                                    </div>

                                  </div>
                                ) : (
                                  <>
                                    {/* RATING */}

                                    <div className="mt-3 text-lg">
                                      {"⭐".repeat(
                                        Number(
                                          review.rating
                                        )
                                      )}

                                      <span className="ml-2 text-sm font-semibold text-gray-600">
                                        {review.rating}/5
                                      </span>
                                    </div>

                                    {/* COMMENT */}

                                    <div className="mt-4 rounded-lg bg-gray-50 p-4">
                                      <p className="text-xs font-bold uppercase text-gray-500">
                                        Your Comment
                                      </p>

                                      <p className="mt-2 text-gray-700">
                                        {review.comment ||
                                          "No comment added."}
                                      </p>
                                    </div>

                                    {/* ACTIONS */}

                                    <div className="mt-4 flex flex-wrap gap-3">

                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleEditReview(
                                            review
                                          )
                                        }
                                        className="rounded-lg border border-orange-500 px-4 py-2 text-sm font-semibold text-orange-500 hover:bg-orange-50"
                                      >
                                        ✏️ Edit
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleDeleteReview(
                                            review._id
                                          )
                                        }
                                        className="rounded-lg border border-red-500 px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50"
                                      >
                                        🗑️ Delete
                                      </button>

                                    </div>
                                  </>
                                )}

                              </div>
                            </div>
                          </div>
                        )
                      )}

                    </div>
                  )}

              </div>
            )}

            {/* =================================================
                NOTIFICATIONS
            ================================================= */}

            {activeSection === "notifications" && (
              <div className="rounded-2xl bg-white p-6 shadow-md md:p-8">

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Notifications
                    </h2>

                    <p className="mt-2 text-gray-500">
                      Manage your notifications and preferences.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={
                      getNotifications
                    }
                    disabled={
                      notificationsLoading
                    }
                    className="rounded-lg border border-orange-500 px-4 py-2 font-semibold text-orange-500 hover:bg-orange-50 disabled:opacity-50"
                  >
                    Refresh
                  </button>

                </div>

                {/* TOGGLE */}

                <div className="mt-8 rounded-xl border border-gray-200 p-5">

                  <div className="flex items-center justify-between gap-4">

                    <div>
                      <h3 className="font-bold text-gray-900">
                        Order & Delivery Updates
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Get notifications about your order status.
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={
                        notificationUpdating
                      }
                      onClick={
                        handleNotificationToggle
                      }
                      className={`relative h-7 w-12 rounded-full transition ${
                        formData.notificationEnabled
                          ? "bg-orange-500"
                          : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                          formData.notificationEnabled
                            ? "right-1"
                            : "left-1"
                        }`}
                      />
                    </button>

                  </div>

                  <p
                    className={`mt-3 text-sm font-semibold ${
                      formData.notificationEnabled
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {formData.notificationEnabled
                      ? "Notifications are ON"
                      : "Notifications are OFF"}
                  </p>

                </div>

                {/* NOTIFICATION LIST */}

                <div className="mt-8">

                  <div className="mb-4 flex items-center justify-between">

                    <h3 className="text-xl font-bold text-gray-900">
                      Your Notifications
                    </h3>

                    <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-600">
                      {
                        notifications.filter(
                          (item) =>
                            !item.isRead
                        ).length
                      }{" "}
                      Unread
                    </span>

                  </div>

                  {notificationsLoading && (
                    <div className="rounded-xl bg-gray-50 p-8 text-center">
                      <p className="font-semibold text-gray-600">
                        Loading notifications...
                      </p>
                    </div>
                  )}

                  {!notificationsLoading &&
                    notifications.length === 0 && (
                      <div className="rounded-xl bg-gray-50 p-10 text-center">

                        <div className="text-5xl">
                          🔔
                        </div>

                        <h3 className="mt-4 text-xl font-bold text-gray-800">
                          No Notifications
                        </h3>

                        <p className="mt-2 text-gray-500">
                          You don't have any
                          notifications yet.
                        </p>

                      </div>
                    )}

                  {!notificationsLoading &&
                    notifications.length > 0 && (
                      <div className="space-y-4">

                        {notifications.map(
                          (notification) => (
                            <div
                              key={
                                notification._id
                              }
                              className={`rounded-xl border p-5 ${
                                notification.isRead
                                  ? "border-gray-200 bg-white"
                                  : "border-orange-200 bg-orange-50"
                              }`}
                            >

                              <div className="flex items-start justify-between gap-4">

                                <div className="flex gap-4">

                                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-xl">
                                    {notification.type ===
                                    "order"
                                      ? "📦"
                                      : notification.type ===
                                        "payment"
                                      ? "💳"
                                      : notification.type ===
                                        "promotion"
                                      ? "🎁"
                                      : "🍽️"}
                                  </div>

                                  <div>

                                    <div className="flex flex-wrap items-center gap-2">

                                      <h4 className="font-bold text-gray-900">
                                        {notification.type
                                          ? notification.type
                                              .charAt(
                                                0
                                              )
                                              .toUpperCase() +
                                            notification.type.slice(
                                              1
                                            )
                                          : "Notification"}
                                      </h4>

                                      {!notification.isRead && (
                                        <span className="rounded-full bg-orange-500 px-2 py-1 text-xs font-semibold text-white">
                                          New
                                        </span>
                                      )}

                                    </div>

                                    <p className="mt-1 text-gray-700">
                                      {
                                        notification.message
                                      }
                                    </p>

                                    <p className="mt-2 text-xs text-gray-500">
                                      {notification.createdAt
                                        ? new Date(
                                            notification.createdAt
                                          ).toLocaleString(
                                            "en-IN"
                                          )
                                        : ""}
                                    </p>

                                  </div>
                                </div>

                                {!notification.isRead && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleMarkAsRead(
                                        notification._id
                                      )
                                    }
                                    className="flex-shrink-0 rounded-lg border border-orange-500 px-3 py-2 text-sm font-semibold text-orange-500 hover:bg-orange-50"
                                  >
                                    Mark as Read
                                  </button>
                                )}

                              </div>

                            </div>
                          )
                        )}

                      </div>
                    )}

                </div>
              </div>
            )}

            {/* =================================================
                PAYMENT HISTORY
            ================================================= */}

            {activeSection === "payments" && (
              <div className="rounded-2xl bg-white p-6 shadow-md md:p-8">

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Payment History
                    </h2>

                    <p className="mt-2 text-gray-500">
                      View your previous payment transactions.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={
                      getPaymentHistory
                    }
                    disabled={paymentLoading}
                    className="rounded-lg border border-orange-500 px-4 py-2 font-semibold text-orange-500 hover:bg-orange-50 disabled:opacity-50"
                  >
                    Refresh
                  </button>

                </div>

                {/* LOADING */}

                {paymentLoading && (
                  <div className="mt-8 rounded-xl bg-gray-50 p-10 text-center">

                    <div className="text-5xl">
                      💳
                    </div>

                    <p className="mt-4 font-semibold text-gray-600">
                      Loading payment history...
                    </p>

                  </div>
                )}

                {/* EMPTY */}

                {!paymentLoading &&
                  paymentHistory.length === 0 && (
                    <div className="mt-8 rounded-xl bg-gray-50 p-10 text-center">

                      <div className="text-5xl">
                        💳
                      </div>

                      <h3 className="mt-4 text-xl font-bold text-gray-800">
                        No Payment History
                      </h3>

                      <p className="mt-2 text-gray-500">
                        You don't have any payment
                        transactions yet.
                      </p>

                    </div>
                  )}

                {/* PAYMENT LIST */}

                {!paymentLoading &&
                  paymentHistory.length > 0 && (
                    <div className="mt-8 space-y-5">

                      {paymentHistory.map(
                        (payment) => {

                          const amount =
                            Number(
                              payment.totalAmount ??
                                payment.amount ??
                                0
                            );

                          const paymentStatus =
                            payment.paymentStatus ||
                            "Pending";

                          return (
                            <div
                              key={
                                payment._id
                              }
                              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                            >

                              {/* TOP */}

                              <div className="flex flex-col justify-between gap-4 sm:flex-row">

                                <div className="flex items-center gap-4">

                                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-2xl">
                                    💳
                                  </div>

                                  <div>

                                    <h3 className="text-lg font-bold text-gray-900">
                                      {payment.restaurant?.name ||
                                        payment.restaurantName ||
                                        "Restaurant"}
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                      {payment.createdAt
                                        ? new Date(
                                            payment.createdAt
                                          ).toLocaleString(
                                            "en-IN"
                                          )
                                        : ""}
                                    </p>

                                  </div>

                                </div>

                                <div className="text-left sm:text-right">

                                  <p className="text-2xl font-bold text-gray-900">
                                    ₹
                                    {amount.toFixed(
                                      2
                                    )}
                                  </p>

                                  <span
                                    className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-bold ${getPaymentStatusClass(
                                      paymentStatus
                                    )}`}
                                  >
                                    {paymentStatus}
                                  </span>

                                </div>

                              </div>

                              {/* DETAILS */}

                              <div className="mt-5 grid gap-4 rounded-xl bg-gray-50 p-4 sm:grid-cols-2 lg:grid-cols-3">

                                <div>
                                  <p className="text-xs font-semibold uppercase text-gray-500">
                                    Payment Method
                                  </p>

                                  <p className="mt-1 font-semibold text-gray-800">
                                    {payment.paymentMethod ||
                                      "N/A"}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-xs font-semibold uppercase text-gray-500">
                                    Payment ID
                                  </p>

                                  <p className="mt-1 break-all text-sm font-semibold text-gray-800">
                                    {payment.paymentId ||
                                      payment.razorpayPaymentId ||
                                      "Not available"}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-xs font-semibold uppercase text-gray-500">
                                    Order ID
                                  </p>

                                  <p className="mt-1 break-all text-sm font-semibold text-gray-800">
                                    {payment.paymentOrderId ||
                                      payment.razorpayOrderId ||
                                      payment.orderId?._id ||
                                      payment.orderId ||
                                      "Not available"}
                                  </p>
                                </div>

                              </div>

                              {/* STATUS */}

                              <div className="mt-4">
                                {getPaymentStatusMessage(
                                  paymentStatus
                                )}
                              </div>

                              {/* RECEIPT BUTTON */}

                              <div className="mt-5 flex flex-wrap gap-3 border-t border-gray-200 pt-5">

                                <button
                                  type="button"
                                  onClick={() =>
                                    downloadReceipt(
                                      payment
                                    )
                                  }
                                  className="rounded-lg bg-orange-500 px-5 py-2.5 font-semibold text-white transition hover:bg-orange-600"
                                >
                                  📄 Download Receipt
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    navigate(
                                      "/orders"
                                    )
                                  }
                                  className="rounded-lg border border-gray-300 px-5 py-2.5 font-semibold text-gray-700 transition hover:bg-gray-100"
                                >
                                  📦 View Orders
                                </button>

                              </div>

                            </div>
                          );
                        }
                      )}

                    </div>
                  )}

              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;




