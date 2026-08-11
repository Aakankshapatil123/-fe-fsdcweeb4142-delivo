import { Outlet } from "react-router"
import Navbar from "../components/Navbar"

const Navwrapper = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  )
}

export default Navwrapper;
