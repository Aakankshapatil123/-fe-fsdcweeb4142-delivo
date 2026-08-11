import { createBrowserRouter, RouterProvider } from "react-router";
import { ToastContainer } from "react-toastify";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import RestaurantDetails from "./pages/RestaurantDetails";
import Restaurants from "./pages/Restaurants";
import Navwrapper from "./wrappers/Navwrapper";
import Login from "./pages/Login";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import AdminDashboard from "./pages/AdminDashboard";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import ProtectedRoute from "./components/ProtectedRouter";


const router = createBrowserRouter([
  // authentication pages
  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/register",
    element: <Register />,
  },
 {
  element:<ProtectedRoute />,
  children: [
     {
    path:"/admin/dashboard",
    element: <AdminDashboard />
  },
  {
    path: "/restaurant/dashboard",
    element: <RestaurantDashboard />,
  },
  ]
 },

  // Main appliaction

 {
  path: "/",
  element: <Navwrapper />,
  children: [
    {
      path: "/",
      element: <Home />,
    },

    {
      path: "profile",
      element: <Profile />,
    },

    {
      path: "restaurants",
      element: <Restaurants />,
    },

    {
      path: "restaurant/:id",
      element: <RestaurantDetails />,
    },
  ]
 }
]);

const App = () => {
  return (
    <>
        <RouterProvider router={router} />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default App;