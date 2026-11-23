"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Service {
  _id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  location: string;
  image?: string;
}

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/services/${params.id}`,
        );

        if (!response.ok) {
          throw new Error("Service not found");
        }

        const data = await response.json();
        setService(data.service);
      } catch (err) {
        console.error("Service Details Error:", err);
        setError("Unable to load service details.");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fff8f6]">
        <p className="text-lg font-medium text-[#7c3547]">
          Loading service details...
        </p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#fff8f6] px-4 text-center">
        <div className="text-6xl">💍</div>

        <h2 className="mt-5 text-2xl font-bold text-[#7c3547]">
          Service Not Found
        </h2>

        <p className="mt-3 text-gray-500">
          Sorry, we could not find this wedding service.
        </p>

        <button
          onClick={() => router.push("/services")}
          className="mt-6 rounded-full bg-[#813d54] px-7 py-3 font-semibold text-white transition hover:bg-[#682c41]"
        >
          Back to Services
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff8f6] px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl">
        {/* Back Button */}
        <button
          onClick={() => router.push("/services")}
          className="mb-8 inline-flex items-center gap-2 font-semibold text-[#813d54] transition hover:gap-3"
        >
          <span>←</span> Back to Services
        </button>

        {/* Service Image */}
        <div className="relative h-72 overflow-hidden rounded-3xl bg-[#f4e5e8] shadow-sm sm:h-[450px]">
          {service.image ? (
            <img
              src={service.image}
              alt={service.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center">
              <span className="text-8xl">💍</span>
              <p className="mt-4 font-medium text-[#7c3547]">Wedding Service</p>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          <div className="absolute bottom-6 left-6">
            <span className="rounded-full bg-white/95 px-5 py-2 text-sm font-semibold text-[#813d54] shadow">
              {service.category}
            </span>
          </div>
        </div>

        {/* Service Content */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Description Section */}
          <section className="rounded-3xl border border-[#f1dfe3] bg-white p-6 shadow-sm sm:p-9">
            <p className="text-sm font-semibold tracking-[3px] text-[#a16b7e]">
              MAKE YOUR DAY SPECIAL
            </p>

            <h1 className="mt-4 text-3xl font-bold text-[#7c3547] sm:text-4xl">
              {service.title}
            </h1>

            <div className="my-7 h-px bg-[#f1dfe3]" />

            <h2 className="text-xl font-bold text-[#7c3547]">
              About This Service
            </h2>

            <p className="mt-4 whitespace-pre-line leading-8 text-gray-600">
              {service.description}
            </p>

            <div className="mt-9 rounded-2xl bg-[#fff8f6] p-5">
              <h3 className="font-bold text-[#7c3547]">
                Make Your Wedding Memorable
              </h3>

              <p className="mt-2 text-sm leading-7 text-gray-600">
                Discover the right wedding service to make your special day
                beautiful, memorable and unforgettable.
              </p>
            </div>
          </section>

          {/* Service Information */}
          <aside className="h-fit rounded-3xl border border-[#f1dfe3] bg-white p-6 shadow-sm sm:p-7">
            <h2 className="text-xl font-bold text-[#7c3547]">
              Service Information
            </h2>

            {/* Price */}
            <div className="mt-6 rounded-2xl bg-[#fff0f2] p-5">
              <p className="text-sm font-medium text-gray-600">Service Price</p>

              <p className="mt-2 text-3xl font-bold text-[#813d54]">
                ৳ {service.price.toLocaleString("en-BD")}
              </p>
            </div>

            {/* Category */}
            <div className="mt-6 border-b border-gray-100 pb-5">
              <p className="text-sm text-gray-500">Category</p>
              <p className="mt-2 font-semibold text-gray-800">
                {service.category}
              </p>
            </div>

            {/* Location */}
            <div className="mt-5">
              <p className="text-sm text-gray-500">Service Location</p>

              <p className="mt-2 font-semibold text-gray-800">
                📍 {service.location}
              </p>
            </div>

            {/* Book Now Button */}
            <button
              onClick={() => router.push(`/services/${service._id}/book`)}
              className="mt-8 w-full rounded-full bg-[#813d54] px-5 py-3 font-semibold text-white transition hover:bg-[#682c41]"
            >
              Book Now
            </button>

            {/* Explore More Services */}
            <button
              onClick={() => router.push("/services")}
              className="mt-3 w-full rounded-full border border-[#813d54] px-5 py-3 font-semibold text-[#813d54] transition hover:bg-[#813d54] hover:text-white"
            >
              Explore More Services
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}
