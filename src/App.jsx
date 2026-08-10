import { createBrowserRouter, RouterProvider } from "react-router";
import { ToastContainer } from "react-toastify";

const router = createBrowserRouter([
{
  path:"/",
  element: <h1>hellow Word!</h1>
}
])

const App = () => {
  return (
    <>
    <RouterProvider router={router}/>
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
  )
}

export default App;
