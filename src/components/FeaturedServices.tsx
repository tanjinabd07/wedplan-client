"use client";

import { useEffect, useState } from "react";
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

export default function FeaturedServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/services");

        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }

        const data = await response.json();
        setServices((data.services || []).slice(0, 3));
      } catch (error) {
        console.error("Featured Services Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[4px] text-[#a16b7e]">
              Our Services
            </p>

            <h2 className="text-3xl font-bold text-[#382832] md:text-4xl">
              Featured Wedding Services
            </h2>

            <p className="mt-4 text-gray-600">
              Find the perfect professionals for your special day.
            </p>
          </div>

          <Link
            href="/services"
            className="font-semibold text-[#813d54] transition hover:text-[#a16b7e]"
          >
            View All Services →
          </Link>
        </div>

        {loading ? (
          <p className="py-12 text-center text-gray-500">Loading services...</p>
        ) : services.length === 0 ? (
          <p className="py-12 text-center text-gray-500">
            No services available yet.
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link
                href={`/services/${service._id}`}
                key={service._id}
                className="group overflow-hidden rounded-2xl border border-[#f0e3e5] bg-white shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="h-56 overflow-hidden bg-[#f9edf0]">
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

                <div className="p-6">
                  <p className="mb-3 text-sm font-medium text-[#a16b7e]">
                    {service.category}
                  </p>

                  <h3 className="mb-3 text-xl font-bold text-[#382832]">
                    {service.title}
                  </h3>

                  <p className="mb-4 line-clamp-2 text-sm leading-6 text-gray-600">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <span className="text-sm text-gray-500">
                      📍 {service.location}
                    </span>

                    <span className="font-bold text-[#813d54]">
                      ৳{service.price.toLocaleString("en-BD")}
                    </span>
                  </div>

                  <p className="mt-4 font-semibold text-[#813d54]">
                    View Details →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
