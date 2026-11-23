"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

interface Booking {
  _id: string;
  serviceTitle: string;
  serviceImage?: string;
  servicePrice: number;
  eventDate: string;
  eventLocation: string;
  guestCount: number;
  message?: string;
  customerName?: string;
  customerEmail?: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  createdAt: string;
}

export default function MyBookingsPage() {
  const { data: session, isPending } = authClient.useSession();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [processingId, setProcessingId] = useState("");

  const role = session?.user?.role ?? "";

  useEffect(() => {
    if (isPending || !session) return;

    if (role !== "customer" && role !== "vendor") return;

    let isMounted = true;

    const fetchBookings = async () => {
      try {
        const endpoint =
          role === "vendor"
            ? "http://localhost:5000/api/bookings/vendor-bookings"
            : "http://localhost:5000/api/bookings/my-bookings";

        const response = await fetch(endpoint, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load bookings.");
        }

        if (isMounted) {
          setBookings(data.bookings || []);
          setError("");
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Something went wrong.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBookings();

    return () => {
      isMounted = false;
    };
  }, [session, isPending, role]);

  // Vendor: Accept or Reject Booking
  // Customer: Cancel Booking
  const handleBookingAction = async (
    bookingId: string,
    action: "accepted" | "rejected" | "cancelled",
  ) => {
    try {
      setProcessingId(bookingId);
      setError("");
      setSuccessMessage("");

      const isCancel = action === "cancelled";

      const endpoint = isCancel
        ? `http://localhost:5000/api/bookings/${bookingId}/cancel`
        : `http://localhost:5000/api/bookings/${bookingId}/status`;

      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(isCancel ? {} : { status: action }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update booking.");
      }

      setBookings((previousBookings) =>
        previousBookings.map((booking) =>
          booking._id === bookingId ? { ...booking, status: action } : booking,
        ),
      );

      setSuccessMessage(data.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setProcessingId("");
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-700";

      case "rejected":
      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading bookings...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Please sign in to view bookings.</p>
      </div>
    );
  }

  if (role !== "customer" && role !== "vendor") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">
          You are not authorized to access this page.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading bookings...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf7f5] px-4 py-10 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#813d54]">
            {role === "vendor" ? "Booking Requests" : "My Bookings"}
          </h1>

          <p className="text-gray-600 mt-2">
            {role === "vendor"
              ? "View and manage booking requests received for your services."
              : "View and track all your wedding service booking requests."}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6">
            {successMessage}
          </div>
        )}

        {!error && bookings.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-10 text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              {role === "vendor"
                ? "No Booking Requests Yet"
                : "No Bookings Yet"}
            </h2>

            <p className="text-gray-500 mt-2">
              {role === "vendor"
                ? "You haven't received any booking requests yet."
                : "You haven't booked any wedding services yet."}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
            >
              {booking.serviceImage && (
                <img
                  src={booking.serviceImage}
                  alt={booking.serviceTitle}
                  className="w-full h-52 object-cover"
                />
              )}

              <div className="p-6">
                <div className="flex justify-between items-start gap-3">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {booking.serviceTitle}
                  </h2>

                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full capitalize whitespace-nowrap ${getStatusStyle(
                      booking.status,
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>

                <p className="text-[#813d54] font-bold text-lg mt-3">
                  ৳{booking.servicePrice}
                </p>

                {role === "vendor" && (
                  <div className="mt-4 p-3 bg-[#faf7f5] rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Customer Information
                    </h3>

                    <p className="text-sm text-gray-600">
                      Name: {booking.customerName || "Not available"}
                    </p>

                    <p className="text-sm text-gray-600">
                      Email: {booking.customerEmail || "Not available"}
                    </p>
                  </div>
                )}

                <div className="mt-5 space-y-2 text-sm text-gray-600">
                  <p>
                    <strong>Event Date:</strong>{" "}
                    {new Date(booking.eventDate).toLocaleDateString()}
                  </p>

                  <p>
                    <strong>Event Location:</strong> {booking.eventLocation}
                  </p>

                  <p>
                    <strong>Guest Count:</strong> {booking.guestCount}
                  </p>

                  {booking.message && (
                    <p>
                      <strong>Message:</strong> {booking.message}
                    </p>
                  )}
                </div>

                {/* Vendor Accept / Reject */}
                {role === "vendor" && booking.status === "pending" && (
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() =>
                        handleBookingAction(booking._id, "accepted")
                      }
                      disabled={processingId === booking._id}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingId === booking._id
                        ? "Processing..."
                        : "Accept"}
                    </button>

                    <button
                      onClick={() =>
                        handleBookingAction(booking._id, "rejected")
                      }
                      disabled={processingId === booking._id}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingId === booking._id
                        ? "Processing..."
                        : "Reject"}
                    </button>
                  </div>
                )}

                {/* Customer Cancel */}
                {role === "customer" && booking.status === "pending" && (
                  <button
                    onClick={() =>
                      handleBookingAction(booking._id, "cancelled")
                    }
                    disabled={processingId === booking._id}
                    className="w-full mt-6 bg-white border border-red-500 text-red-600 hover:bg-red-50 font-semibold py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processingId === booking._id
                      ? "Cancelling..."
                      : "Cancel Booking"}
                  </button>
                )}

                <p className="text-xs text-gray-400 mt-5">
                  Requested on:{" "}
                  {new Date(booking.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
