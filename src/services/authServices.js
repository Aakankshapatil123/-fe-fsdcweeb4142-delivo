import intance from "../intances/intance";


// Register user
export const registerUser = async (userData) => {
  const response = await intance.post(
    "/auth/register",
    userData
  );

  return response.data;
};

// Login user
export const loginUser = async (userData) => {
  const response = await intance.post(
    "/auth/login",
    userData
  );

  return response.data;
};

// Get current logged-in user

export const getCurrentUser = async () => {
  const response = await intance.get(
    "/auth/me"
  );

  return response.data;
};

// Logout user
export const logoutUser = async () => {
  const response = await intance.post(
    "/auth/logout"
  );

  return response.data;
};