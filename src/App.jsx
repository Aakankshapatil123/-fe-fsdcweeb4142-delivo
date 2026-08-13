import { createBrowserRouter, RouterProvider } from "react-router";
import { ToastContainer } from "react-toastify";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import RestaurantDetails from "./pages/RestaurantDetails";
import Restaurants from "./pages/Restaurants";
import Cart from "./pages/Cart";
import Navwrapper from "./wrappers/Navwrapper";
import Login from "./pages/Login";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import AdminDashboard from "./pages/AdminDashboard";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import ProtectedRoute from "./components/ProtectedRouter";
import Checkout from "./pages/checkout";
import Favorites from "./pages/Favorites";
import Orders from "./pages/Order";
import OrderDetails from "./pages/OrderDetails";
import RestaurantOwner from "./pages/RestaurantOwner";
import RestaurantOrders from "./pages/RestaurantOrders";
import AdminOrders from "./pages/Dashboard";
import RestaurantMenu from "./pages/RestaurantMenu";

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
    element: <ProtectedRoute />,
    children: [
      {
        path: "/admin/dashboard",
        element: <AdminDashboard />,
      },

      {
        path: "/admin/orders",
        element: <AdminOrders />,
      },
      {
        path: "/restaurant/dashboard",
        element: <RestaurantDashboard />,
      },

      {
        path: "/restaurant/owner",
        element: <RestaurantOwner />,
      },


      {
        path: "/restaurant/menu",
        element: <RestaurantMenu />,
      },

      {
        path: "/restaurant/orders",
        element: <RestaurantOrders />,
      },
    ],
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
        path: "restaurants",
        element: <Restaurants />,
      },

      {
        path: "restaurants/:id",
        element: <RestaurantDetails />,
      },

      {
        path: "favorites",
        element: <Favorites />,
      },

      {
        path: "orders",
        element: <Orders />,
      },

      {
        path: "orders/:id",
        element: <OrderDetails />,
      },

      {
        path: "profile",
        element: <Profile />,
      },

      {
        path: "cart",
        element: <Cart />,
      },

      {
        path: "checkout",
        element: <Checkout />,
      },
    ],
  },
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
