import instance from "../intances/intance";


export const getMyNotifications = async () => {
  const response = await instance.get("/notifications");

  return response.data;
};

export const markNotificationAsRead = async (id) => {
  const response = await instance.put(`/notifications/${id}/read`);

  return response.data;
};