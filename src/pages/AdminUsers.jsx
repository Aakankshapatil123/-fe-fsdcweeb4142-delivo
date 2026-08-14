import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  getAllUsers,
  deleteUser,
} from "../services/adminService";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= FETCH USERS =================

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllUsers();

      setUsers(response.result || []);
    } catch (error) {
      console.log(
        "GET USERS ERROR:",
        error.response?.data?.message || error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= DELETE USER =================

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteUser(userId);

      // Remove deleted user from UI
      setUsers((previousUsers) =>
        previousUsers.filter(
          (user) => user._id !== userId
        )
      );

    } catch (error) {
      console.log(
        "DELETE USER ERROR:",
        error.response?.data?.message || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete user"
      );
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg font-semibold text-gray-600">
          Loading users...
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
            onClick={fetchUsers}
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
              Manage Users
            </h1>

            <p className="mt-2 text-gray-600">
              View and manage registered users
            </p>
          </div>

          <Link
            to="/admin/dashboard"
            className="rounded-lg bg-orange-500 px-5 py-3 text-center font-semibold text-white hover:bg-orange-600"
          >
            Dashboard
          </Link>

        </div>

        {/* ================= USER COUNT ================= */}

        <div className="mb-6 rounded-2xl bg-white p-6 shadow-md">
          <p className="text-sm text-gray-500">
            Total Users
          </p>

          <p className="mt-1 text-3xl font-bold text-gray-800">
            {users.length}
          </p>
        </div>

        {/* ================= NO USERS ================= */}

        {users.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-md">
            <div className="text-5xl">
              👥
            </div>

            <h2 className="mt-4 text-xl font-bold text-gray-800">
              No users found
            </h2>

            <p className="mt-2 text-gray-600">
              There are no registered users.
            </p>
          </div>
        ) : (

          /* ================= USERS TABLE ================= */

          <div className="overflow-hidden rounded-2xl bg-white shadow-md">

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-100">

                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      #
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Name
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Email
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Phone
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Role
                    </th>

                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>

                </thead>

                <tbody>

                  {users.map((user, index) => (

                    <tr
                      key={user._id}
                      className="border-t hover:bg-gray-50"
                    >

                      <td className="px-6 py-4 text-gray-600">
                        {index + 1}
                      </td>

                      <td className="px-6 py-4 font-semibold text-gray-800">
                        {user.name}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {user.email}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {user.phone || "N/A"}
                      </td>

                      <td className="px-6 py-4">

                        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                          {user.role}
                        </span>

                      </td>

                      <td className="px-6 py-4 text-center">

                        <div className="flex justify-center gap-3">

                          <Link
                            to={`/admin/users/${user._id}`}
                            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
                          >
                            View
                          </Link>

                          <button
                            onClick={() =>
                              handleDelete(user._id)
                            }
                            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default AdminUsers;