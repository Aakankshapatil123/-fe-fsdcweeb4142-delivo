import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import { getUserById } from "../services/adminService";

const AdminUserDetails = () => {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= GET USER DETAILS =================

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getUserById(id);

        setUser(response.result);
      } catch (error) {
        console.log(
          "GET USER DETAILS ERROR:",
          error.response?.data?.message || error.message
        );

        setError(
          error.response?.data?.message ||
            "Failed to load user details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg font-semibold text-gray-600">
          Loading user details...
        </p>
      </div>
    );
  }

  // ================= ERROR =================

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="font-semibold text-red-500">
            {error}
          </p>

          <Link
            to="/admin/users"
            className="mt-4 inline-block rounded-lg bg-gray-700 px-5 py-2 font-semibold text-white"
          >
            ← Back to Users
          </Link>
        </div>
      </div>
    );
  }

  // ================= USER NOT FOUND =================

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg font-semibold text-gray-600">
          User not found
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 md:px-10">
      <div className="mx-auto max-w-5xl">

        {/* ================= HEADER ================= */}

        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">

          <div>
            <h1 className="text-3xl font-bold text-gray-800 md:text-4xl">
              User Details
            </h1>

            <p className="mt-2 text-gray-600">
              View registered user information
            </p>
          </div>

          <Link
            to="/admin/users"
            className="rounded-lg bg-gray-700 px-5 py-3 text-center font-semibold text-white hover:bg-gray-800"
          >
            ← Back to Users
          </Link>

        </div>

        {/* ================= USER CARD ================= */}

        <div className="overflow-hidden rounded-2xl bg-white shadow-md">

          {/* ================= PROFILE HEADER ================= */}

          <div className="bg-orange-500 p-8 text-center">

            {/* PROFILE IMAGE */}

            {user.profilePicture ? (
              <img
                src={`${import.meta.env.VITE_API_URL.replace("/api/v1", "")}${user.profilePicture}`}
                alt={user.name}
                className="mx-auto h-28 w-28 rounded-full border-4 border-white object-cover shadow-md"
              />
            ) : (
              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-white text-5xl shadow-md">
                👤
              </div>
            )}

            {/* NAME */}

            <h2 className="mt-4 text-2xl font-bold text-white">
              {user.name}
            </h2>

            {/* ROLE */}

            <span className="mt-2 inline-block rounded-full bg-white px-4 py-1 text-sm font-semibold text-orange-600">
              {user.role || "user"}
            </span>

          </div>

          {/* ================= USER INFORMATION ================= */}

          <div className="p-6 md:p-8">

            <h3 className="text-xl font-bold text-gray-800">
              Personal Information
            </h3>

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              {/* EMAIL */}

              <div className="rounded-xl bg-gray-50 p-5">
                <p className="text-sm text-gray-500">
                  Email
                </p>

                <p className="mt-1 break-all font-semibold text-gray-800">
                  {user.email || "N/A"}
                </p>
              </div>

              {/* PHONE */}

              <div className="rounded-xl bg-gray-50 p-5">
                <p className="text-sm text-gray-500">
                  Phone
                </p>

                <p className="mt-1 font-semibold text-gray-800">
                  {user.phone || "N/A"}
                </p>
              </div>

              {/* ROLE */}

              <div className="rounded-xl bg-gray-50 p-5">
                <p className="text-sm text-gray-500">
                  Role
                </p>

                <p className="mt-1 font-semibold capitalize text-gray-800">
                  {user.role || "user"}
                </p>
              </div>

             
              {/* NOTIFICATION */}

              <div className="rounded-xl bg-gray-50 p-5">
                <p className="text-sm text-gray-500">
                  Notifications
                </p>

                <p
                  className={`mt-1 font-semibold ${
                    user.notificationEnabled
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {user.notificationEnabled
                    ? "Enabled"
                    : "Disabled"}
                </p>
              </div>

              {/* CREATED DATE */}

              <div className="rounded-xl bg-gray-50 p-5">
                <p className="text-sm text-gray-500">
                  Created At
                </p>

                <p className="mt-1 font-semibold text-gray-800">
                  {user.createdAt
                    ? new Date(
                        user.createdAt
                      ).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

            </div>

            {/* ================= LOCATION ================= */}

            <h3 className="mt-8 text-xl font-bold text-gray-800">
              Location
            </h3>

            <div className="mt-4 rounded-xl bg-gray-50 p-5">

              <p className="font-semibold text-gray-800">
                {user.location?.address || "Address not available"}
              </p>

              <p className="mt-1 text-gray-600">
                {user.location?.city || ""}
                {user.location?.state
                  ? `, ${user.location.state}`
                  : ""}
                {user.location?.pincode
                  ? ` - ${user.location.pincode}`
                  : ""}
              </p>

            </div>

            {/* ================= USER ID ================= */}

            <h3 className="mt-8 text-xl font-bold text-gray-800">
              Account Information
            </h3>

            <div className="mt-4 rounded-xl bg-gray-50 p-5">

              <p className="text-sm text-gray-500">
                User ID
              </p>

              <p className="mt-1 break-all font-mono text-sm text-gray-700">
                {user._id}
              </p>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminUserDetails;