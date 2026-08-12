import { useState } from "react";
import { Link, useNavigate } from "react-router";

const Home = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // ================= SEARCH =================
  const handleSearch = (e) => {
    e.preventDefault();

    if (search.trim()) {
      navigate(
        `/restaurants?search=${encodeURIComponent(search.trim())}`
      );
    } else {
      navigate("/restaurants");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* =====================================================
          HERO SECTION
      ===================================================== */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-400">

        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center px-6 py-16 md:px-10">

          <div className="w-full max-w-4xl text-white">

            {/* Small Heading */}
            <p className="mb-4 text-lg font-semibold md:text-xl">
              🍔 Delicious food, delivered fast
            </p>

            {/* Main Heading */}
            <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
              Your Favorite Food
              <br />
              Delivered to Your Door
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-2xl text-lg leading-8 text-orange-50 md:text-xl">
              Discover the best restaurants near you, explore delicious
              menus and order your favorite food with Delivo.
            </p>


            {/* =================================================
                SEARCH RESTAURANT
            ================================================= */}
            <form
              onSubmit={handleSearch}
              className="mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row"
            >

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search restaurant or cuisine..."
                className="flex-1 rounded-lg bg-white px-5 py-4 text-gray-800 shadow-md outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-orange-200"
              />

              <button
                type="submit"
                className="rounded-lg bg-gray-900 px-7 py-4 font-semibold text-white shadow-md transition hover:bg-gray-800 active:scale-95"
              >
                🔍 Search
              </button>

            </form>


            {/* =================================================
                HERO BUTTONS
            ================================================= */}
            <div className="mt-5 flex flex-col gap-4 sm:flex-row">

              <Link
                to="/restaurants"
                className="rounded-lg bg-white px-7 py-3 text-center font-bold text-orange-500 shadow-md transition hover:bg-gray-100"
              >
                Explore Restaurants
              </Link>

              <Link
                to="/restaurants"
                className="rounded-lg border-2 border-white px-7 py-3 text-center font-bold text-white transition hover:bg-white hover:text-orange-500"
              >
                Order Now
              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          WHY CHOOSE DELIVO
      ===================================================== */}
      <section className="bg-white py-16">

        <div className="mx-auto max-w-7xl px-6 md:px-10">

          {/* Section Heading */}
          <div className="mb-12 text-center">

            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Why Choose Delivo?
            </h2>

            <p className="mt-3 text-gray-600">
              Everything you need for a simple and delicious food ordering
              experience.
            </p>

          </div>


          {/* Feature Cards */}
          <div className="grid gap-6 md:grid-cols-3">

            {/* Feature 1 */}
            <div className="rounded-2xl bg-gray-50 p-8 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-3xl">
                🍽️
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                Wide Restaurant Choice
              </h3>

              <p className="mt-3 leading-6 text-gray-600">
                Explore restaurants and discover different cuisines
                available near you.
              </p>

            </div>


            {/* Feature 2 */}
            <div className="rounded-2xl bg-gray-50 p-8 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-3xl">
                🚴
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                Fast Delivery
              </h3>

              <p className="mt-3 leading-6 text-gray-600">
                Get your favorite food delivered quickly and conveniently
                to your doorstep.
              </p>

            </div>


            {/* Feature 3 */}
            <div className="rounded-2xl bg-gray-50 p-8 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-3xl">
                💳
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                Secure Payment
              </h3>

              <p className="mt-3 leading-6 text-gray-600">
                Enjoy a secure and smooth payment experience while ordering
                your food.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}
      <section className="bg-gray-50 py-16">

        <div className="mx-auto max-w-7xl px-6 md:px-10">

          {/* Heading */}
          <div className="mb-12 text-center">

            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              How Delivo Works
            </h2>

            <p className="mt-3 text-gray-600">
              Order your favorite food in just a few simple steps.
            </p>

          </div>


          {/* Steps */}
          <div className="grid gap-8 md:grid-cols-4">

            {/* Step 1 */}
            <div className="text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-xl font-bold text-white">
                1
              </div>

              <h3 className="mt-4 font-bold text-gray-900">
                Choose Restaurant
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                Find your favorite restaurant.
              </p>

            </div>


            {/* Step 2 */}
            <div className="text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-xl font-bold text-white">
                2
              </div>

              <h3 className="mt-4 font-bold text-gray-900">
                Select Food
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                Browse the menu and select food.
              </p>

            </div>


            {/* Step 3 */}
            <div className="text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-xl font-bold text-white">
                3
              </div>

              <h3 className="mt-4 font-bold text-gray-900">
                Place Order
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                Add items to cart and checkout.
              </p>

            </div>


            {/* Step 4 */}
            <div className="text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-xl font-bold text-white">
                4
              </div>

              <h3 className="mt-4 font-bold text-gray-900">
                Enjoy Your Food
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                Receive your order at your doorstep.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}
      <section className="bg-orange-500 py-16">

        <div className="mx-auto max-w-4xl px-6 text-center text-white">

          <h2 className="text-3xl font-bold md:text-4xl">
            Hungry? Let's Order!
          </h2>

          <p className="mt-4 text-orange-50">
            Explore restaurants and discover something delicious today.
          </p>

          <Link
            to="/restaurants"
            className="mt-7 inline-block rounded-lg bg-white px-8 py-3 font-bold text-orange-500 shadow-md transition hover:bg-gray-100"
          >
            Browse Restaurants
          </Link>

        </div>

      </section>

    </div>
  );
};

export default Home;