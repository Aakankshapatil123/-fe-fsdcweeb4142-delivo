import intance from "../intances/intance";

// get all resturant
export const getAllRestaurants = async () => {
  const response = await intance.get("/restaurants")

  return response.data;
};

// Get restaurant by ID
export const getRestaurantById = async (id) => {
  const response = await intance.get(`/restaurants/${id}`);

  return response.data;
};



