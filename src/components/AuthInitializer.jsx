import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { getCurrentUser } from "../services/authServices";
import { logout, setUser, setLoading } from "../redux/authSlice";

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkUser = async () => {
      try {
        // Auth check
        dispatch(setLoading(true));

        const response = await getCurrentUser();

        console.log("CURRENT USER:", response);

        const user =
          response?.user || response?.data?.user || response?.data || response;

        if (user) {
          dispatch(setUser(user));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.log("AUTH ERROR:", error);
        console.log("STATUS:", error.response?.status);
        console.log("DATA:", error.response?.data);
        console.log("URL:", error.config?.url);

        dispatch(logout());
      } finally {
        // Auth check पूर्ण
        dispatch(setLoading(false));
      }
    };

    checkUser();
  }, [dispatch]);

  return children;
};

export default AuthInitializer;
