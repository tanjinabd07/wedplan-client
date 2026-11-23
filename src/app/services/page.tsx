"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

interface Service {
  _id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  location: string;
  image?: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/services");

        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }

        const data = await response.json();
        setServices(data.services || []);
      } catch (err) {
        console.error("Services Fetch Error:", err);
        setError("Unable to load services. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Get unique categories
  const categories = useMemo(() => {
    return [
      "All",
      ...Array.from(new Set(services.map((service) => service.category))),
    ];
  }, [services]);

  // Search, filter and sort services
  const filteredServices = useMemo(() => {
    let result = [...services];

    if (search.trim()) {
      const keyword = search.toLowerCase();

      result = result.filter(
        (service) =>
          service.title.toLowerCase().includes(keyword) ||
          service.category.toLowerCase().includes(keyword) ||
          service.location.toLowerCase().includes(keyword),
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter(
        (service) => service.category === selectedCategory,
      );
    }

    if (sortBy === "low-to-high") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "high-to-low") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [services, search, selectedCategory, sortBy]);

  return (
    <main className="min-h-screen bg-[#fff8f6] px-4 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-12 text-center">
          <p className="font-semibold tracking-[3px] text-[#a16b7e]">
            MAKE YOUR DAY SPECIAL
          </p>

          <h1 className="mt-3 text-3xl font-bold text-[#7c3547] sm:text-5xl">
            Explore Wedding Services
          </h1>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
            Find the perfect wedding services to make your special day
            unforgettable.
          </p>
        </div>

        {/* Search and Filter */}
        {!loading && !error && services.length > 0 && (
          <div className="mb-10 rounded-2xl border border-[#f1dfe3] bg-white p-5 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Search */}
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by service, category or location..."
                className="w-full rounded-xl border border-[#ead6dc] px-4 py-3 text-gray-700 outline-none transition focus:border-[#813d54] focus:ring-2 focus:ring-[#813d54]/10"
              />

              {/* Price Sorting */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-xl border border-[#ead6dc] bg-white px-4 py-3 text-gray-700 outline-none focus:border-[#813d54]"
              >
                <option value="default">Sort by: Default</option>
                <option value="low-to-high">Price: Low to High</option>
                <option value="high-to-low">Price: High to Low</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold text-[#7c3547]">
                Browse by Category
              </p>

              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                      selectedCategory === category
                        ? "bg-[#813d54] text-white"
                        : "bg-[#fff0f2] text-[#7c3547] hover:bg-[#f4dfe5]"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="py-20 text-center">
            <p className="text-lg text-[#7c3547]">Loading services...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl bg-red-50 p-6 text-center text-red-600">
            {error}
          </div>
        )}

        {/* No Services */}
        {!loading && !error && services.length === 0 && (
          <div className="rounded-2xl border border-[#f1dfe3] bg-white px-6 py-16 text-center">
            <div className="text-5xl">💍</div>

            <h2 className="mt-5 text-2xl font-bold text-[#7c3547]">
              No Services Available Yet
            </h2>

            <p className="mt-3 text-gray-500">
              Wedding services will appear here once vendors add services and
              administrators approve them.
            </p>
          </div>
        )}

        {/* Services */}
        {!loading && !error && services.length > 0 && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="font-medium text-gray-600">
                Showing {filteredServices.length} of {services.length} Services
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                  setSortBy("default");
                }}
                className="text-sm font-semibold text-[#813d54] hover:underline"
              >
                Clear Filters
              </button>
            </div>

            {filteredServices.length === 0 ? (
              <div className="rounded-2xl bg-white px-6 py-16 text-center">
                <div className="text-5xl">🔍</div>
                <h2 className="mt-5 text-xl font-bold text-[#7c3547]">
                  No Matching Services Found
                </h2>
                <p className="mt-3 text-gray-500">
                  Try another search or category.
                </p>
              </div>
            ) : (
              <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {filteredServices.map((service) => (
                  <Link
                    key={service._id}
                    href={`/services/${service._id}`}
                    className="group block overflow-hidden rounded-2xl border border-[#f1dfe3] bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                  >
                    {/* Service Image */}
                    <div className="h-56 w-full overflow-hidden bg-[#f4e5e8]">
                      {service.image ? (
                        <img
                          src={service.image}
                          alt={service.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-6xl">
                          💍
                        </div>
                      )}
                    </div>

                    {/* Service Details */}
                    <div className="p-6">
                      <span className="rounded-full bg-[#fff0f2] px-3 py-1 text-xs font-semibold text-[#7c3547]">
                        {service.category}
                      </span>

                      <h2 className="mt-4 text-xl font-bold text-[#7c3547]">
                        {service.title}
                      </h2>

                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                        {service.description}
                      </p>

                      <p className="mt-4 text-sm text-gray-500">
                        📍 {service.location}
                      </p>

                      <div className="mt-5 border-t border-gray-100 pt-4">
                        <p className="text-lg font-bold text-[#7c3547]">
                          ৳ {service.price.toLocaleString("en-BD")}
                        </p>

                        <p className="mt-3 text-sm font-semibold text-[#7c3547] transition group-hover:text-[#a16b7e]">
                          View Details →
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
