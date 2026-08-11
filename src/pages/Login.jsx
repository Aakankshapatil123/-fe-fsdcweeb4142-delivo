import { Link, useNavigate } from "react-router";
import { loginUser } from "../services/authServices";
import { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);

    const handleLogin = async(e) => {
     e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please enter email and password");
      return;
    }
    
    try {
      setLoading(true);

      const response = await loginUser(formData)

      console.log("LOGIN RESPONSE:", response);
 
      const user = response?.user;


      if (!user) {
            toast.error("User information not received");
            return;
        }
   
        dispatch(setUser(user));

      toast.success(
        response.data?.message || "Login successful!"
      );
     
      // Role-based navigation
      if (user.role === "admin") {
           navigate("/admin/dashboard");
        } else if (user.role === "restaurant") {
            navigate("/restaurant/dashboard");
        } else {
             navigate("/");
        }
    }catch (error) {
      console.log("LOGIN ERROR:", error.response?.data);

      toast.error(
        error.response?.data?.message ||
        "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
}

  return (
     <div className="min-h-screen bg-gray-50 px-4 py-10">

      {/* Logo */}
      <div className="flex justify-center">
        <Link to="/" className="flex items-center">
          <div className="flex h-12 w-28 items-center justify-center rounded-lg bg-orange-500">
            <span className="text-2xl font-bold text-white">
              Delivo
            </span>
          </div>
        </Link>
      </div>

      {/* Login Card */}
      <div className="mx-auto mt-8 w-full max-w-2xl rounded-xl bg-white p-6 shadow-md md:p-10">

        {/* Heading */}
        <h1 className="text-center text-3xl font-bold text-gray-800">
          Welcome Back
        </h1>

        <p className="mt-2 text-center text-base text-gray-500">
          Login to your Delivo account
        </p>

        {/* Login Form */}
        <form
          onSubmit={handleLogin}
          className="mx-auto mt-8 w-full max-w-xl space-y-5"
        >

          {/* Email */}
          <div className="w-full">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="h-14 w-full rounded-lg border border-gray-300 px-5 text-base outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
               value={formData.email}
              onChange={e => setFormData({ ...formData, email:e.target.value})}
            />
          </div>

          {/* Password */}
          <div className="w-full">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="h-14 w-full rounded-lg border border-gray-300 px-5 text-base outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
               value={formData.password}
              onChange={e => setFormData({ ...formData, password:e.target.value})}
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="h-14 w-full rounded-lg bg-orange-500 text-base font-semibold text-white transition hover:bg-orange-600"
          >
            Login
          </button>

        </form>

        {/* Register Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-orange-500 hover:text-orange-600"
          >
            Create Account
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Login;
