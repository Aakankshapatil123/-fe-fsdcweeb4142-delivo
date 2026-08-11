import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { registerUser } from "../services/authServices";

const Register = () => {
   const navigate = useNavigate();

   const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
   });

   const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);

      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      const response = await registerUser(userData);

      toast.success(
        response?.message || "Registration successful!"
    );


    navigate("/login")

  }catch (error) {
      console.log("REGISTER ERROR:", error);
  console.log("REGISTER RESPONSE:", error.response?.data);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Registration failed. Please try again.";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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

      {/* Register Card */}
      <div className="mx-auto mt-8 w-full max-w-2xl rounded-xl bg-white p-6 shadow-md md:p-10">

        {/* Heading */}
        <h1 className="text-center text-3xl font-bold text-gray-800">
          Create an Account
        </h1>

        <p className="mt-2 text-center text-base text-gray-500">
          Create your Delivo account to order your favorite food
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 w-full max-w-xl space-y-5"
        >

          {/* Name */}
          <div className="w-full">
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>

            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="Enter your name"
              className="h-14 w-full rounded-lg border border-gray-300 px-5 text-base outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name:e.target.value})}
            />
          </div>

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

          {/* Register Button */}
          <button
            type="submit"
            className="h-14 w-full rounded-lg bg-orange-500 text-base font-semibold text-white transition hover:bg-orange-600"
          >
            Create Account
          </button>

        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-orange-500 hover:text-orange-600"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;