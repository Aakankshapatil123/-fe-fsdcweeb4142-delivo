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
import AdminUsers from "./pages/AdminUsers";
import AdminUserDetails from "./pages/AdminUserDetails";
import AdminRestaurants from "./pages/AdminRestaurants";
import Payment from "./pages/Payment";
import Notifications from "./pages/Notification";
import AdminReviews from "./pages/AdminReviews";
import RestaurantEdit from "./pages/RestaurantEdit";

const router = createBrowserRouter([
  // =====================================================
  // AUTHENTICATION PAGES
  // =====================================================
  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/register",
    element: <Register />,
  },

  // =====================================================
  // ADMIN + RESTAURANT PROTECTED ROUTES
  // =====================================================
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/admin/dashboard",
        element: <AdminDashboard />,
      },

      {
        path: "/admin/users",
        element: <AdminUsers />,
      },

      {
        path: "/admin/users/:id",
        element: <AdminUserDetails />,
      },

      {
        path: "/admin/restaurants",
        element: <AdminRestaurants />,
      },

      {
        path: "/admin/orders",
        element: <AdminOrders />,
      },

      {
        path: "/admin/reviews",
        element: <AdminReviews />,
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
        path: "/restaurant/owner/edit/:id",
        element: <RestaurantEdit />,
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

  // =====================================================
  // MAIN APPLICATION
  // =====================================================

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

      // =================================================
      // USER PROTECTED ROUTES
      // =================================================

      {
        element: <ProtectedRoute />,
        children: [
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
            path: "notifications",
            element: <Notifications />,
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

          {
            path: "payment/:orderId",
            element: <Payment />,
          },
        ],
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
