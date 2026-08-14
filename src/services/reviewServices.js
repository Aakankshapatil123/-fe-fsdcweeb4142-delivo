import instance from "../intances/intance";

// GET RESTAURANT REVIEWS
export const getRestaurantReviews = async (restaurantId) => {
  const response = await instance.get(
    `/user/reviews/restaurant/${restaurantId}`
  );

  return response.data;
};

// GET MY REVIEWS
export const getMyReviews = async () => {
  const response = await instance.get(
    "/user/reviews/my"
  );

  return response.data;
};

// ADD REVIEW
export const addReview = async (reviewData) => {
  const response = await instance.post(
    "/user/reviews",
    reviewData
  );

  return response.data;
};

// UPDATE REVIEW
export const updateReview = async (reviewId, reviewData) => {
  const response = await instance.put(
    `/user/reviews/${reviewId}`,
    reviewData
  );

  return response.data;
};

// DELETE REVIEW
export const deleteReview = async (reviewId) => {
  const response = await instance.delete(
    `/user/reviews/${reviewId}`
  );

  return response.data;
};