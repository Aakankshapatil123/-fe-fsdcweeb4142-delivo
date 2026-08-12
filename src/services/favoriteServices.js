import intance from "../intances/intance";

// ================= GET ALL FAVORITES =================

export const getMyFavorites = async () => {
  const response = await intance.get("/favorites");

  return response.data;
};

// ================= ADD RESTAURANT FAVORITE =================

export const addRestaurantFavorite = async (
  restaurantId
) => {
  const response = await intance.post(
    "/favorites/restaurant",
    {
      restaurantId,
    }
  );

  return response.data;
};

// ================= REMOVE RESTAURANT FAVORITE =================

export const removeRestaurantFavorite = async (
  restaurantId
) => {
  const response = await intance.delete(
    `/favorites/restaurant/${restaurantId}`
  );

  return response.data;
};

// ================= CHECK RESTAURANT FAVORITE =================

export const checkRestaurantFavorite = async (
  restaurantId
) => {
  const response = await intance.get(
    `/favorites/restaurant/${restaurantId}/check`
  );

  return response.data;
};

// ================= ADD MENU FAVORITE =================

export const addMenuFavorite = async (menuId) => {
  const response = await intance.post(
    "/favorites/menu",
    {
      menuId,
    }
  );

  return response.data;
};

// ================= REMOVE MENU FAVORITE =================

export const removeMenuFavorite = async (
  menuId
) => {
  const response = await intance.delete(
    `/favorites/menu/${menuId}`
  );

  return response.data;
};

// ================= CHECK MENU FAVORITE =================

export const checkMenuFavorite = async (
  menuId
) => {
  const response = await intance.get(
    `/favorites/menu/${menuId}/check`
  );

  return response.data;
};