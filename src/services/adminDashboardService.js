import intance from "../intances/intance";


export const getDashboardStatistics = async () => {
  const response = await intance.get("/restaurant/dashboard");

  return response.data;
};