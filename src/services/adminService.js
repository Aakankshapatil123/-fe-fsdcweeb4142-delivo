

// ================= GET ALL USERS =================

import intance from "../intances/intance";

export const getAllUsers = async () => {
  const response = await intance.get("/restaurant/users");

  return response.data;
};

// ================= GET USER BY ID =================

export const getUserById = async (userId) => {
  const response = await intance.get(`/restaurant/users/${userId}`);

  return response.data;
};

// ================= DELETE USER =================

export const deleteUser = async (userId) => {
  const response = await intance.delete(`/restaurant/users/:id${userId}`);

  return response.data;
};

export const getAllRestaurants = async () => {
  const response = await intance.get(
    "/restaurant"
  );

  return response.data;
};

export const updateRestaurant = async (id, data) => {
  const response = await intance.put(
    `/restaurant/${id}`,
    data
  );

  return response.data;
};

export const deleteRestaurant = async (id) => {
  const response = await instance.delete(
    `/restaurant/${id}`
  );

  return response.data;
};

