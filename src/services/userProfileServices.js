import intance from "../intances/intance";

// ================= UPDATE PROFILE =================

export const updateProfile = async (profileData) => {
  const response = await intance.put(
    "/user/profiles",
    profileData
  );

  return response.data;
};


// ================= GET MY NOTIFICATIONS =================

export const getMyNotifications = async () => {
  const response = await intance.get(
    "/notifications"
  );

  return response.data;
};


// ================= MARK NOTIFICATION AS READ =================

export const markNotificationAsRead = async (notificationId) => {
  const response = await intance.put(
    `/notifications/${notificationId}/read`
  );

  return response.data;
};