import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { getCurrentUser } from "../services/authServices";
import { logout, setUser } from "../redux/authSlice";

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await getCurrentUser();

        console.log("CURRENT USER:", response);

        const user = response;

        if (user) {
          dispatch(setUser(user));
        }else {
          console.log("NO USER FOUND");

          dispatch(logout());
        }
      } catch (error) {
        console.log(
          "AUTH CHECK:",
          error.response?.data?.message || "User not logged in"
        );
        dispatch(logout());
      }
    };

    checkUser();
  }, [dispatch]);

  return children;
};

export default AuthInitializer;