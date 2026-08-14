import { useEffect, useState } from "react";

import {
  getMyNotifications,
  markNotificationAsRead,
} from "../services/notificationServices";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyNotifications();

      setNotifications(response.result || []);
    } catch (error) {
      console.log(
        "NOTIFICATION ERROR:",
        error.response?.data?.message || error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to fetch notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      const response = await markNotificationAsRead(id);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? response.result
            : notification
        )
      );
    } catch (error) {
      console.log(
        "MARK READ ERROR:",
        error.response?.data?.message || error.message
      );
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "order":
        return "📦";

      case "payment":
        return "💳";

      case "promotion":
        return "🎁";

      case "restaurant":
        return "🍽️";

      default:
        return "🔔";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Notifications
          </h1>

          <p className="mt-2 text-gray-600">
            Stay updated with your orders and other activities.
          </p>
        </div>

        {loading && (
          <div className="rounded-xl bg-white p-8 text-center shadow">
            <p className="text-gray-500">
              Loading notifications...
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && notifications.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center shadow">
            <div className="text-5xl">🔔</div>

            <h2 className="mt-4 text-xl font-bold text-gray-800">
              No Notifications
            </h2>

            <p className="mt-2 text-gray-500">
              You don't have any notifications yet.
            </p>
          </div>
        )}

        {!loading && notifications.length > 0 && (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`rounded-xl border p-5 shadow-sm ${
                  notification.isRead
                    ? "border-gray-200 bg-white"
                    : "border-orange-200 bg-orange-50"
                }`}
              >
                <div className="flex items-start gap-4">

                  <div className="text-3xl">
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1">

                    <p
                      className={`text-sm ${
                        notification.isRead
                          ? "text-gray-600"
                          : "font-semibold text-gray-900"
                      }`}
                    >
                      {notification.message}
                    </p>

                    <p className="mt-2 text-xs text-gray-400">
                      {new Date(
                        notification.createdAt
                      ).toLocaleString()}
                    </p>

                    {!notification.isRead && (
                      <button
                        onClick={() =>
                          handleMarkAsRead(notification._id)
                        }
                        className="mt-3 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
                      >
                        Mark as Read
                      </button>
                    )}

                    {notification.isRead && (
                      <span className="mt-3 inline-block text-xs font-medium text-green-600">
                        ✓ Read
                      </span>
                    )}

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Notifications;