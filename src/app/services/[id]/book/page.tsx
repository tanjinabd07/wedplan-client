"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

interface Service {
  _id: string;
  title: string;
  price: number;
  image?: string;
}

export default function BookingPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace("/signin");
      return;
    }

    if (session.user.role !== "customer") {
      router.replace("/dashboard");
      return;
    }

    const controller = new AbortController();

    const fetchService = async () => {
      try {
        setLoading(true);

        const response = await apiFetch(
          `http://localhost:5000/api/services/${params.id}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Service not found");
        }

        const data = await response.json();
        setService(data.service);
      } catch (err) {
        if (controller.signal.aborted) return;

        console.error("Booking Service Error:", err);
        setError("Unable to load service details.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchService();

    return () => controller.abort();
  }, [params.id, session, isPending, router]);

  const handleBooking = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!session?.user) {
      router.push("/signin");
      return;
    }

    if (session.user.role !== "customer") {
      setError("Only customers can submit booking requests.");
      return;
    }

    if (!eventDate || !eventLocation.trim() || !guestCount) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await apiFetch(
        "http://localhost:5000/api/bookings/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            serviceId: params.id,
            eventDate,
            eventLocation,
            guestCount: Number(guestCount),
            message,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Booking request failed.");
      }

      setSuccess("Your booking request has been sent successfully!");

      setEventDate("");
      setEventLocation("");
      setGuestCount("");
      setMessage("");

      setTimeout(() => {
        router.push("/dashboard/bookings");
      }, 2000);
    } catch (err) {
      console.error("Booking Error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fff8f6]">
        <p className="font-medium text-[#7c3547]">Loading booking page...</p>
      </div>
    );
  }

  if (!session?.user || session.user.role !== "customer") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fff8f6]">
        <p className="text-[#7c3547]">Redirecting...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#fff8f6]">
        <h2 className="text-2xl font-bold text-[#7c3547]">Service Not Found</h2>

        <button
          onClick={() => router.push("/services")}
          className="mt-5 rounded-full bg-[#813d54] px-6 py-3 text-white"
        >
          Back to Services
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff8f6] px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => router.back()}
          className="mb-7 font-semibold text-[#813d54] hover:underline"
        >
          ← Back
        </button>

        <div className="rounded-3xl border border-[#f1dfe3] bg-white p-6 shadow-sm sm:p-9">
          <div className="text-center">
            <p className="text-sm font-semibold tracking-[3px] text-[#a16b7e]">
              MAKE YOUR DAY SPECIAL
            </p>

            <h1 className="mt-3 text-3xl font-bold text-[#7c3547]">
              Book Your Service
            </h1>

            <p className="mt-3 text-gray-500">
              Fill in your event details to send a booking request.
            </p>
          </div>

          {/* Selected Service */}
          <div className="mt-8 rounded-2xl bg-[#fff8f6] p-5">
            <h2 className="font-bold text-[#7c3547]">Selected Service</h2>

            <p className="mt-2 text-lg font-semibold text-gray-800">
              {service.title}
            </p>

            <p className="mt-2 font-bold text-[#813d54]">
              ৳ {service.price.toLocaleString("en-BD")}
            </p>
          </div>

          <form onSubmit={handleBooking} className="mt-8 space-y-6">
            {/* Event Date */}
            <div>
              <label
                htmlFor="eventDate"
                className="mb-2 block font-semibold text-gray-700"
              >
                Event Date *
              </label>

              <input
                id="eventDate"
                type="date"
                min={new Date().toLocaleDateString("en-CA")}
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
                className="w-full rounded-xl border border-[#ead5dc] px-4 py-3 outline-none focus:border-[#813d54]"
              />
            </div>

            {/* Event Location */}
            <div>
              <label
                htmlFor="eventLocation"
                className="mb-2 block font-semibold text-gray-700"
              >
                Event Location *
              </label>

              <input
                id="eventLocation"
                type="text"
                placeholder="Enter your wedding event location"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                required
                className="w-full rounded-xl border border-[#ead5dc] px-4 py-3 outline-none focus:border-[#813d54]"
              />
            </div>

            {/* Guest Count */}
            <div>
              <label
                htmlFor="guestCount"
                className="mb-2 block font-semibold text-gray-700"
              >
                Number of Guests *
              </label>

              <input
                id="guestCount"
                type="number"
                min="1"
                placeholder="Enter number of guests"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                required
                className="w-full rounded-xl border border-[#ead5dc] px-4 py-3 outline-none focus:border-[#813d54]"
              />
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="mb-2 block font-semibold text-gray-700"
              >
                Additional Message (Optional)
              </label>

              <textarea
                id="message"
                rows={4}
                placeholder="Write any additional information..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full resize-none rounded-xl border border-[#ead5dc] px-4 py-3 outline-none focus:border-[#813d54]"
              />
            </div>

            {/* Error Message */}
            {error && (
              <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
                {error}
              </p>
            )}

            {/* Success Message */}
            {success && (
              <p className="rounded-xl bg-green-50 p-3 text-sm text-green-700">
                {success}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-[#813d54] px-6 py-4 font-semibold text-white transition hover:bg-[#682c41] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Sending Request..." : "Send Booking Request"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
