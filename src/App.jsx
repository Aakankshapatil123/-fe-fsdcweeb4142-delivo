import { createBrowserRouter, RouterProvider } from "react-router";

const router = createBrowserRouter([
{
  path:"/",
  element: <h1>hellow Word!</h1>
}
])

const App = () => {
  return (
    <RouterProvider router={router}/>
  )
}

export default App;
