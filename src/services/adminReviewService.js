import instance from "../intances/intance";


export const getAllReviews = async () => {
  const response = await instance.get("/restaurant/reviews");

  return response.data;
};

export const deleteReview = async (id) => {
  const response = await instance.delete(
    `/restaurant/reviews/${id}`
  );

  return response.data;
};