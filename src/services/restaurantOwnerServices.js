import intance from "../intances/intance";

// ================= GET RESTAURANT PROFILE =================

export const getRestaurantProfile = async () => {
  const response = await intance.get(
    "/restaurantOwner"
  );

  return response.data;
};

// ================= UPDATE RESTAURANT PROFILE =================

export const updateRestaurantProfile = async (
  restaurantId,
  formData
) => {
  const response = await intance.put(
    `/restaurantOwner/${restaurantId}`,
    formData
  );

  return response.data;
};



// ================= CREATE MENU =================

export const createMenu = async (formData) => {
  const response = await intance.post(
    "/restaurantOwner/menus",
    formData
  );

  return response.data;
};

// ================= GET RESTAURANT MENU =================

export const getRestaurantMenu = async () => {
  const response = await intance.get(
    "/restaurantOwner/menus"
  );

  return response.data;
};

// ================= UPDATE MENU =================

export const updateMenu = async (
  menuId,
  formData
) => {
  const response = await intance.put(
    `/restaurantOwner/menus/${menuId}`,
    formData
  );

  return response.data;
};

// ================= DELETE MENU =================

export const deleteMenu = async (menuId) => {
  const response = await intance.delete(
    `/restaurantOwner/menus/${menuId}`
  );

  return response.data;
};