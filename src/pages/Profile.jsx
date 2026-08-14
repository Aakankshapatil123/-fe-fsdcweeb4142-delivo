import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import {
  setUser,
  logout,
} from "../redux/authSlice";

import intance from "../intances/intance";

import {
  updateProfile,
  getMyNotifications,
  markNotificationAsRead,
} from "../services/userProfileServices";


const Profile = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );


  // =========================================================
  // PROFILE STATE
  // =========================================================

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


  // =========================================================
  // ACTIVE SECTION
  // =========================================================

  const [activeSection, setActiveSection] = useState(
    "profile"
  );


  // =========================================================
  // REVIEWS STATE
  // =========================================================

  const [myReviews, setMyReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const [editingReviewId, setEditingReviewId] =
    useState(null);

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });


  // =========================================================
  // NOTIFICATION STATE
  // =========================================================

  const [notifications, setNotifications] = useState([]);

  const [notificationsLoading, setNotificationsLoading] =
    useState(false);

  const [notificationUpdating, setNotificationUpdating] =
    useState(false);


  // =========================================================
  // AUTH CHECK
  // =========================================================

  useEffect(() => {

    if (!isAuthenticated) {
      navigate("/login");
    }

  }, [isAuthenticated, navigate]);


  // =========================================================
  // LOAD USER
  // =========================================================

  useEffect(() => {

    if (user) {

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


      if (user.profilePicture) {

        setPreviewImage(
          `http://localhost:3001${user.profilePicture}`
        );

      } else {

        setPreviewImage("");

      }

    }

  }, [user]);


  // =========================================================
  // GET MY REVIEWS
  // =========================================================

  const getMyReviews = async () => {

    try {

      setReviewsLoading(true);

      const response = await intance.get(
        "/user/reviews/my"
      );

      setMyReviews(
        response.data.result || []
      );

    } catch (error) {

      console.log(
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


  // =========================================================
  // GET NOTIFICATIONS
  // =========================================================

  const getNotifications = async () => {

    try {

      setNotificationsLoading(true);

      const response =
        await getMyNotifications();

      setNotifications(
        response.result || []
      );

    } catch (error) {

      console.log(
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


  // =========================================================
  // LOAD DATA WHEN SECTION OPENS
  // =========================================================

  useEffect(() => {

    if (
      isAuthenticated &&
      activeSection === "reviews"
    ) {

      getMyReviews();

    }

  }, [
    activeSection,
    isAuthenticated,
  ]);


  useEffect(() => {

    if (
      isAuthenticated &&
      activeSection === "notifications"
    ) {

      getNotifications();

    }

  }, [
    activeSection,
    isAuthenticated,
  ]);


  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };


  // =========================================================
  // LOCATION CHANGE
  // =========================================================

  const handleLocationChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,

      location: {
        ...prev.location,
        [name]: value,
      },
    }));

  };


  // =========================================================
  // IMAGE CHANGE
  // =========================================================

  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (!file) {
      return;
    }

    setProfileImage(file);

    const imageURL =
      URL.createObjectURL(file);

    setPreviewImage(imageURL);

  };


  // =========================================================
  // UPDATE PROFILE
  // =========================================================

  const handleUpdateProfile = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const data = new FormData();

      data.append(
        "name",
        formData.name
      );

      data.append(
        "phone",
        formData.phone
      );

      data.append(
        "location",
        JSON.stringify(
          formData.location
        )
      );

      data.append(
        "notificationEnabled",
        formData.notificationEnabled
      );


      if (profileImage) {

        data.append(
          "profilePicture",
          profileImage
        );

      }


      const response =
        await updateProfile(data);


      console.log(
        "PROFILE UPDATE RESPONSE:",
        response
      );


      const updatedUser =
        response.result;


      if (updatedUser) {

        dispatch(
          setUser(updatedUser)
        );

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


        if (updatedUser.profilePicture) {

          setPreviewImage(
            `http://localhost:3001${updatedUser.profilePicture}`
          );

        }

      }


      setEditing(false);
      setProfileImage(null);

      alert(
        "Profile updated successfully."
      );

    } catch (error) {

      console.log(
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


  // =========================================================
  // NOTIFICATION TOGGLE
  // =========================================================

  const handleNotificationToggle = async () => {

    try {

      setNotificationUpdating(true);

      const newStatus =
        !formData.notificationEnabled;


      const data = new FormData();

      data.append(
        "name",
        formData.name
      );

      data.append(
        "phone",
        formData.phone
      );

      data.append(
        "location",
        JSON.stringify(
          formData.location
        )
      );

      data.append(
        "notificationEnabled",
        newStatus
      );


      const response =
        await updateProfile(data);


      const updatedUser =
        response.result;


      if (updatedUser) {

        dispatch(
          setUser(updatedUser)
        );


        setFormData((prev) => ({
          ...prev,

          notificationEnabled:
            updatedUser.notificationEnabled,
        }));

      }

    } catch (error) {

      console.log(
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


  // =========================================================
  // CANCEL PROFILE EDIT
  // =========================================================

  const handleCancelEdit = () => {

    setEditing(false);

    if (user) {

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
          user.notificationEnabled ??
          true,
      });


      setPreviewImage(
        user.profilePicture
          ? `http://localhost:3001${user.profilePicture}`
          : ""
      );

    }

    setProfileImage(null);

  };


  // =========================================================
  // MARK NOTIFICATION AS READ
  // =========================================================

  const handleMarkAsRead = async (
    notificationId
  ) => {

    try {

      const response =
        await markNotificationAsRead(
          notificationId
        );


      const updatedNotification =
        response.result;


      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id ===
          notificationId
            ? updatedNotification
            : notification
        )
      );

    } catch (error) {

      console.log(
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


  // =========================================================
  // EDIT REVIEW
  // =========================================================

  const handleEditReview = (
    review
  ) => {

    setEditingReviewId(
      review._id
    );

    setReviewForm({
      rating: review.rating,
      comment: review.comment || "",
    });

  };


  // =========================================================
  // REVIEW FORM CHANGE
  // =========================================================

  const handleReviewChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setReviewForm((prev) => ({
      ...prev,

      [name]:
        name === "rating"
          ? Number(value)
          : value,
    }));

  };


  // =========================================================
  // UPDATE REVIEW
  // =========================================================

  const handleUpdateReview = async (
    reviewId
  ) => {

    try {

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

        alert(
          "Comment is required."
        );

        return;

      }


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

      console.log(
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


  // =========================================================
  // DELETE REVIEW
  // =========================================================

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

      console.log(
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


  // =========================================================
  // CANCEL REVIEW EDIT
  // =========================================================

  const handleCancelReviewEdit = () => {

    setEditingReviewId(null);

    setReviewForm({
      rating: 5,
      comment: "",
    });

  };


  // =========================================================
  // LOGOUT
  // =========================================================

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


  // =========================================================
  // PROFILE IMAGE
  // =========================================================

  const getProfileImage = () => {

    if (previewImage) {
      return previewImage;
    }

    return "";

  };


  // =========================================================
  // LOADING
  // =========================================================

  if (
    !isAuthenticated ||
    !user
  ) {

    return (
      <div className="flex min-h-[70vh] items-center justify-center">

        <p className="font-semibold text-gray-600">
          Loading profile...
        </p>

      </div>
    );

  }


  // =========================================================
  // RETURN
  // =========================================================

  return (

    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">

      <div className="mx-auto max-w-7xl">


        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            My Profile
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your account, orders, reviews and preferences.
          </p>

        </div>


        {/* =====================================================
            MAIN GRID
        ===================================================== */}

        <div className="grid gap-6 md:grid-cols-12">


          {/* ===================================================
              SIDEBAR
          =================================================== */}

          <div className="md:col-span-4 lg:col-span-3">

            <div className="rounded-2xl bg-white p-5 shadow-md">


              {/* PROFILE SUMMARY */}

              <div className="border-b pb-5 text-center">

                <div className="mx-auto h-24 w-24 overflow-hidden rounded-full bg-orange-100">

                  {getProfileImage() ? (

                    <img
                      src={getProfileImage()}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />

                  ) : (

                    <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-orange-500">

                      {user.name
                        ?.charAt(0)
                        ?.toUpperCase() ||
                        "U"}

                    </div>

                  )}

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
                    setActiveSection("notifications")
                  }
                  className={`w-full rounded-lg px-4 py-3 text-left font-semibold transition ${
                    activeSection === "notifications"
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

          </div>


          {/* ===================================================
              CONTENT
          =================================================== */}

          <div className="md:col-span-8 lg:col-span-9">


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
                      className="rounded-lg bg-orange-500 px-5 py-2.5 font-semibold text-white hover:bg-orange-600"
                    >
                      Edit Profile
                    </button>

                  )}

                </div>


                {/* PROFILE FORM */}

                <form
                  onSubmit={handleUpdateProfile}
                  className="mt-8"
                >


                  {/* IMAGE */}

                  <div className="mb-8 flex flex-col items-center sm:flex-row sm:items-start sm:gap-6">

                    <div className="h-28 w-28 overflow-hidden rounded-full bg-orange-100">

                      {getProfileImage() ? (

                        <img
                          src={getProfileImage()}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />

                      ) : (

                        <div className="flex h-full w-full items-center justify-center text-5xl font-bold text-orange-500">

                          {user.name
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "U"}

                        </div>

                      )}

                    </div>


                    {editing && (

                      <div className="mt-4 sm:mt-2">

                        <label className="cursor-pointer rounded-lg border border-orange-500 px-4 py-2 font-semibold text-orange-500 hover:bg-orange-50">

                          Change Photo

                          <input
                            type="file"
                            accept="image/*"
                            onChange={
                              handleImageChange
                            }
                            className="hidden"
                          />

                        </label>

                        <p className="mt-2 text-sm text-gray-500">
                          JPG, PNG or JPEG
                        </p>

                      </div>

                    )}

                  </div>


                  {/* NAME EMAIL PHONE */}

                  <div className="grid gap-6 md:grid-cols-2">


                    <div>

                      <label className="mb-2 block font-semibold text-gray-700">
                        Full Name
                      </label>

                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!editing}
                        className={`w-full rounded-lg border px-4 py-3 outline-none ${
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
                        value={user.email || ""}
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
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!editing}
                        placeholder="Enter phone number"
                        className={`w-full rounded-lg border px-4 py-3 outline-none ${
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
                            formData.location.address
                          }
                          onChange={
                            handleLocationChange
                          }
                          disabled={!editing}
                          placeholder="Enter your address"
                          className={`w-full rounded-lg border px-4 py-3 outline-none ${
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
                            formData.location.city
                          }
                          onChange={
                            handleLocationChange
                          }
                          disabled={!editing}
                          placeholder="Enter city"
                          className={`w-full rounded-lg border px-4 py-3 outline-none ${
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
                            formData.location.state
                          }
                          onChange={
                            handleLocationChange
                          }
                          disabled={!editing}
                          placeholder="Enter state"
                          className={`w-full rounded-lg border px-4 py-3 outline-none ${
                            editing
                              ? "border-gray-300 focus:border-orange-500"
                              : "border-gray-200 bg-gray-50"
                          }`}
                        />

                      </div>

                    </div>

                  </div>


                  {/* NOTIFICATION PREFERENCE */}

                  <div className="mt-8 rounded-xl bg-gray-50 p-5">

                    <div className="flex items-center justify-between gap-4">

                      <div>

                        <h3 className="font-bold text-gray-900">
                          Order Notifications
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Receive updates about your orders and delivery.
                        </p>

                      </div>


                      <button
                        type="button"
                        disabled={notificationUpdating}
                        onClick={
                          handleNotificationToggle
                        }
                        className={`relative h-7 w-12 rounded-full transition ${
                          formData.notificationEnabled
                            ? "bg-orange-500"
                            : "bg-gray-300"
                        } ${
                          notificationUpdating
                            ? "cursor-not-allowed opacity-60"
                            : ""
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


                  {/* SAVE */}

                  {editing && (

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                      <button
                        type="submit"
                        disabled={loading}
                        className={`rounded-lg px-6 py-3 font-semibold text-white ${
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
                        className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-100"
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
                    className="rounded-lg border border-orange-500 px-4 py-2 font-semibold text-orange-500 hover:bg-orange-50"
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
                        You have not reviewed any restaurant yet.
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          navigate("/restaurants")
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

                      {myReviews.map((review) => (

                        <div
                          key={review._id}
                          className="rounded-xl border border-gray-200 p-5"
                        >

                          <div className="flex flex-col gap-4 sm:flex-row">


                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">

                              {review.restaurant?.image ? (

                                <img
                                  src={`http://localhost:3001${review.restaurant.image}`}
                                  alt={
                                    review.restaurant.name
                                  }
                                  className="h-full w-full object-cover"
                                />

                              ) : (

                                <div className="flex h-full w-full items-center justify-center text-3xl">
                                  🍽️
                                </div>

                              )}

                            </div>


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
                                        review.restaurant.cuisine
                                      }
                                    </p>

                                  )}

                                </div>


                                <div className="text-sm text-gray-500">

                                  {review.createdAt
                                    ? new Date(
                                        review.createdAt
                                      ).toLocaleDateString()
                                    : ""}

                                </div>

                              </div>


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
                                    rows="4"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                                    placeholder="Write your review..."
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


                                  <p className="mt-3 text-gray-700">
                                    {review.comment}
                                  </p>


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

                      ))}

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
                    onClick={getNotifications}
                    className="rounded-lg border border-orange-500 px-4 py-2 font-semibold text-orange-500 hover:bg-orange-50"
                  >
                    Refresh
                  </button>

                </div>


                {/* ON / OFF */}

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
                      } ${
                        notificationUpdating
                          ? "cursor-not-allowed opacity-60"
                          : ""
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
                          You don't have any notifications yet.
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
                              className={`rounded-xl border p-5 transition ${
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
                                          ?.charAt(0)
                                          ?.toUpperCase() +
                                          notification.type?.slice(
                                            1
                                          )}

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
                                          ).toLocaleString()
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

                <h2 className="text-2xl font-bold text-gray-900">
                  Payment History
                </h2>

                <p className="mt-2 text-gray-500">
                  View your previous payment transactions.
                </p>


                <div className="mt-8 rounded-xl bg-gray-50 p-8 text-center">

                  <div className="text-5xl">
                    💳
                  </div>

                  <h3 className="mt-4 text-xl font-bold text-gray-800">
                    Payment History
                  </h3>

                  <p className="mt-2 text-gray-500">
                    Payment history will appear here after payment transactions are connected.
                  </p>

                </div>

              </div>

            )}

          </div>

        </div>

      </div>

    </div>

  );

};


export default Profile;