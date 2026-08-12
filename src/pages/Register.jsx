import { useState } from "react";
import { useNavigate } from "react-router";

const Home = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // ================= SEARCH =================
  const handleSearch = (e) => {
    e.preventDefault();

    const searchText = search.trim();

    if (!searchText) {
      navigate("/restaurants");
      return;
    }

    navigate(
      `/restaurants?search=${encodeURIComponent(searchText)}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================= HERO ================= */}
      <section className="bg-orange-500 px-6 py-20 md:px-10 md:py-28">

        <div className="mx-auto max-w-5xl text-center">

          <h1 className="text-4xl font-bold leading-tight text-white md:text-6xl">
            Delicious Food,
            <br />
            Delivered to You
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-orange-50 md:text-xl">
            Discover the best restaurants and delicious food near you.
          </p>

          {/* ================= SEARCH ================= */}
          <form
            onSubmit={handleSearch}
            className="mx-auto mt-8 flex max-w-3xl flex-col gap-3 sm:flex-row"
          >

            <input
              type="text"
              placeholder="Search restaurant or cuisine..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 rounded-xl border-0 bg-white px-5 py-4 text-gray-800 shadow-lg outline-none focus:ring-4 focus:ring-orange-200"
            />

            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg transition hover:bg-blue-700"
            >
              🔍 Search
            </button>

          </form>

        </div>

      </section>

      {/* ================= FEATURES ================= */}
      <section className="px-6 py-16 md:px-10">

        <div className="mx-auto max-w-7xl">

          <h2 className="text-center text-3xl font-bold text-gray-900">
            Why Choose Delivo?
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">

            {/* Great Food */}
            <div className="rounded-2xl bg-white p-8 text-center shadow-md transition hover:-translate-y-1 hover:shadow-xl">

              <div className="text-5xl">
                🍔
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                Great Food
              </h3>

              <p className="mt-3 text-gray-600">
                Explore delicious food from the best restaurants.
              </p>

            </div>

            {/* Fast Delivery */}
            <div className="rounded-2xl bg-white p-8 text-center shadow-md transition hover:-translate-y-1 hover:shadow-xl">

              <div className="text-5xl">
                🚀
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                Fast Delivery
              </h3>

              <p className="mt-3 text-gray-600">
                Get your favorite food delivered quickly to your doorstep.
              </p>

            </div>

            {/* Secure Payment */}
            <div className="rounded-2xl bg-white p-8 text-center shadow-md transition hover:-translate-y-1 hover:shadow-xl">

              <div className="text-5xl">
                💳
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                Secure Payment
              </h3>

              <p className="mt-3 text-gray-600">
                Enjoy safe and secure online payment options.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* ================= CTA ================= */}
      <section className="px-6 pb-16 md:px-10">

        <div className="mx-auto max-w-5xl rounded-2xl bg-white p-10 text-center shadow-md">

          <h2 className="text-3xl font-bold text-gray-900">
            Hungry?
          </h2>

          <p className="mt-3 text-gray-600">
            Find your favorite restaurant and order now.
          </p>

          <button
            onClick={() => navigate("/restaurants")}
            className="mt-6 rounded-lg bg-orange-500 px-7 py-3 font-semibold text-white transition hover:bg-orange-600"
          >
            Explore Restaurants
          </button>

        </div>

      </section>

    </div>
  );
};

export default Home;