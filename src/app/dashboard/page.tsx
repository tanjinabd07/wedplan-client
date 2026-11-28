"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

interface Service {
  _id: string;
  status: "pending" | "approved" | "rejected";
}

interface Booking {
  _id: string;
  serviceTitle: string;
  serviceImage?: string;
  servicePrice: number;
  eventDate: string;
  eventLocation: string;
  guestCount: number;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  createdAt?: string;
}

interface VendorBooking {
  _id: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
}

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  cancelled: "bg-gray-100 text-gray-600",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

export default function DashboardPage() {
  const { data: session, isPending } = authClient.useSession();

  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesError, setServicesError] = useState("");

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState("");

  // Vendor Booking States
  const [vendorBookings, setVendorBookings] = useState<VendorBooking[]>([]);
  const [vendorBookingsLoading, setVendorBookingsLoading] = useState(false);
  const [vendorBookingsError, setVendorBookingsError] = useState("");

  const user = session?.user;
  const role = user?.role || "customer";

  // Vendor: Fetch My Services
  useEffect(() => {
    if (!session || role !== "vendor") return;

    let isMounted = true;

    const fetchMyServices = async () => {
      try {
        setServicesLoading(true);
        setServicesError("");

        const response = await apiFetch(
          "http://localhost:5000/api/services/my-services",
          {
            method: "GET",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load services.");
        }

        if (isMounted) {
          setServices(data.services || []);
        }
      } catch (err) {
        if (isMounted) {
          setServicesError(
            err instanceof Error ? err.message : "Something went wrong.",
          );
        }
      } finally {
        if (isMounted) {
          setServicesLoading(false);
        }
      }
    };

    fetchMyServices();

    return () => {
      isMounted = false;
    };
  }, [session, role]);

  // Customer: Fetch My Bookings
  useEffect(() => {
    if (!session || role !== "customer") return;

    let isMounted = true;

    const fetchMyBookings = async () => {
      try {
        setBookingsLoading(true);
        setBookingsError("");

        const response = await apiFetch(
          "http://localhost:5000/api/bookings/my-bookings",
          {
            method: "GET",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load bookings.");
        }

        if (isMounted) {
          setBookings(data.bookings || []);
        }
      } catch (err) {
        if (isMounted) {
          setBookingsError(
            err instanceof Error ? err.message : "Something went wrong.",
          );
        }
      } finally {
        if (isMounted) {
          setBookingsLoading(false);
        }
      }
    };

    fetchMyBookings();

    return () => {
      isMounted = false;
    };
  }, [session, role]);

  // Vendor: Fetch Booking Statistics
  useEffect(() => {
    if (!session || role !== "vendor") return;

    let isMounted = true;

    const fetchVendorBookings = async () => {
      try {
        setVendorBookingsLoading(true);
        setVendorBookingsError("");

        const response = await apiFetch(
          "http://localhost:5000/api/bookings/vendor-bookings",
          {
            method: "GET",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load bookings.");
        }

        if (isMounted) {
          setVendorBookings(data.bookings || []);
        }
      } catch (err) {
        if (isMounted) {
          setVendorBookingsError(
            err instanceof Error ? err.message : "Something went wrong.",
          );
        }
      } finally {
        if (isMounted) {
          setVendorBookingsLoading(false);
        }
      }
    };

    fetchVendorBookings();

    return () => {
      isMounted = false;
    };
  }, [session, role]);

  // Loading
  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fff8f6]">
        <p className="text-[#7c3547]">Loading Dashboard...</p>
      </main>
    );
  }

  // Not signed in
  if (!session || !user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#fff8f6] px-4">
        <h1 className="text-3xl font-bold text-[#7c3547]">Please Sign In</h1>

        <p className="mt-3 text-gray-600">Sign in to access your dashboard.</p>

        <Link
          href="/signin"
          className="mt-6 rounded-xl bg-[#7c3547] px-6 py-3 text-white"
        >
          Sign In
        </Link>
      </main>
    );
  }

  // Vendor Dashboard Cards
  const vendorDashboardItems = [
    {
      title: "My Services",
      description: "Manage your wedding services.",
      href: "/dashboard/services",
      icon: "💼",
    },
    {
      title: "Add Service",
      description: "Create a new service listing.",
      href: "/dashboard/services/add",
      icon: "➕",
    },
    {
      title: "Bookings",
      description: "View customer booking requests.",
      href: "/dashboard/bookings",
      icon: "📅",
    },
    {
      title: "Subscription",
      description: "Manage your Free or Premium plan.",
      href: "/dashboard/subscription",
      icon: "⭐",
    },
  ];

  // Customer Dashboard Cards
  const customerDashboardItems = [
    {
      title: "Browse Services",
      description: "Explore wedding services.",
      href: "/services",
      icon: "🔍",
    },
    {
      title: "My Bookings",
      description: "View and manage your bookings.",
      href: "/dashboard/bookings",
      icon: "📅",
    },
    {
      title: "My Profile",
      description: "View your account information.",
      href: "/profile",
      icon: "👤",
    },
  ];

  // Vendor Service Statistics
  const approvedCount = services.filter(
    (service) => service.status === "approved",
  ).length;

  const pendingCount = services.filter(
    (service) => service.status === "pending",
  ).length;

  const rejectedCount = services.filter(
    (service) => service.status === "rejected",
  ).length;

  // Customer Booking Statistics
  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending",
  ).length;

  const acceptedBookings = bookings.filter(
    (booking) => booking.status === "accepted",
  ).length;

  const rejectedBookings = bookings.filter(
    (booking) => booking.status === "rejected",
  ).length;

  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "cancelled",
  ).length;

  // Vendor Booking Statistics
  const totalVendorBookings = vendorBookings.length;

  const pendingVendorBookings = vendorBookings.filter(
    (booking) => booking.status === "pending",
  ).length;

  const acceptedVendorBookings = vendorBookings.filter(
    (booking) => booking.status === "accepted",
  ).length;

  const rejectedVendorBookings = vendorBookings.filter(
    (booking) => booking.status === "rejected",
  ).length;

  // Recent Customer Bookings (latest 5)
  const recentBookings = bookings.slice(0, 5);

  return (
    <main className="min-h-screen bg-[#fff8f6] px-4 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Welcome Section */}
        <div className="rounded-3xl bg-[#7c3547] p-8 text-white sm:p-12">
          <p className="text-white/80">Welcome to WedPlan</p>

          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            Hello, {user.name}!
          </h1>

          <p className="mt-3 text-white/80">
            Manage your wedding planning activities from here.
          </p>

          <span className="mt-6 inline-block rounded-full bg-white/20 px-5 py-2 text-sm font-semibold capitalize">
            {role} Dashboard
          </span>
        </div>

        {/* ================= VENDOR SERVICE OVERVIEW ================= */}
        {role === "vendor" && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-[#7c3547]">
              Service Overview
            </h2>

            {servicesLoading ? (
              <p className="mt-6 text-gray-500">
                Loading service statistics...
              </p>
            ) : servicesError ? (
              <p className="mt-6 rounded-lg bg-red-50 p-4 text-red-600">
                {servicesError}
              </p>
            ) : (
              <div className="mt-6 grid gap-5 sm:grid-cols-3">
                {/* Approved */}
                <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
                  <p className="text-sm font-medium text-gray-500">
                    Approved Services
                  </p>

                  <h3 className="mt-3 text-4xl font-bold text-green-600">
                    {approvedCount}
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Services approved by admin
                  </p>
                </div>

                {/* Pending */}
                <div className="rounded-2xl border border-yellow-100 bg-white p-6 shadow-sm">
                  <p className="text-sm font-medium text-gray-500">
                    Pending Services
                  </p>

                  <h3 className="mt-3 text-4xl font-bold text-yellow-600">
                    {pendingCount}
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Waiting for admin approval
                  </p>
                </div>

                {/* Rejected */}
                <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
                  <p className="text-sm font-medium text-gray-500">
                    Rejected Services
                  </p>

                  <h3 className="mt-3 text-4xl font-bold text-red-600">
                    {rejectedCount}
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Services rejected by admin
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= VENDOR BOOKING OVERVIEW ================= */}
        {role === "vendor" && (
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-[#7c3547]">
              Booking Overview
            </h2>

            {vendorBookingsLoading ? (
              <p className="mt-6 text-gray-500">
                Loading booking statistics...
              </p>
            ) : vendorBookingsError ? (
              <p className="mt-6 rounded-lg bg-red-50 p-4 text-red-600">
                {vendorBookingsError}
              </p>
            ) : (
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {/* Total */}
                <div className="rounded-2xl border border-[#f1dfe3] bg-white p-6 shadow-sm">
                  <p className="text-sm text-gray-500">Total Requests</p>

                  <h3 className="mt-3 text-4xl font-bold text-[#7c3547]">
                    {totalVendorBookings}
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    All booking requests
                  </p>
                </div>

                {/* Pending */}
                <div className="rounded-2xl border border-amber-100 bg-white p-6 shadow-sm">
                  <p className="text-sm text-gray-500">Pending Requests</p>

                  <h3 className="mt-3 text-4xl font-bold text-amber-600">
                    {pendingVendorBookings}
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Awaiting your response
                  </p>
                </div>

                {/* Accepted */}
                <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
                  <p className="text-sm text-gray-500">Accepted Bookings</p>

                  <h3 className="mt-3 text-4xl font-bold text-green-600">
                    {acceptedVendorBookings}
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Confirmed bookings
                  </p>
                </div>

                {/* Rejected */}
                <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
                  <p className="text-sm text-gray-500">Rejected Bookings</p>

                  <h3 className="mt-3 text-4xl font-bold text-red-600">
                    {rejectedVendorBookings}
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Rejected requests
                  </p>
                </div>
              </div>
            )}

            <Link
              href="/dashboard/bookings"
              className="mt-6 inline-block rounded-xl bg-[#7c3547] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#642a3a]"
            >
              Manage Bookings →
            </Link>
          </section>
        )}

        {/* ================= CUSTOMER DASHBOARD ================= */}
        {role === "customer" && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-[#7c3547]">
              Booking Overview
            </h2>

            {bookingsLoading ? (
              <p className="mt-6 text-gray-500">
                Loading booking statistics...
              </p>
            ) : bookingsError ? (
              <p className="mt-6 rounded-lg bg-red-50 p-4 text-red-600">
                {bookingsError}
              </p>
            ) : (
              <>
                {/* Booking Statistics Cards */}
                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                  {/* Total */}
                  <div className="rounded-2xl border border-[#f1dfe3] bg-white p-6 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">
                      Total Bookings
                    </p>

                    <h3 className="mt-3 text-4xl font-bold text-[#7c3547]">
                      {totalBookings}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      All your bookings
                    </p>
                  </div>

                  {/* Pending */}
                  <div className="rounded-2xl border border-amber-100 bg-white p-6 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">Pending</p>

                    <h3 className="mt-3 text-4xl font-bold text-amber-600">
                      {pendingBookings}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      Awaiting vendor response
                    </p>
                  </div>

                  {/* Accepted */}
                  <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">
                      Accepted
                    </p>

                    <h3 className="mt-3 text-4xl font-bold text-green-600">
                      {acceptedBookings}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      Confirmed bookings
                    </p>
                  </div>

                  {/* Rejected */}
                  <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">
                      Rejected
                    </p>

                    <h3 className="mt-3 text-4xl font-bold text-red-600">
                      {rejectedBookings}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      Declined by vendors
                    </p>
                  </div>

                  {/* Cancelled */}
                  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">
                      Cancelled
                    </p>

                    <h3 className="mt-3 text-4xl font-bold text-gray-600">
                      {cancelledBookings}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      Cancelled bookings
                    </p>
                  </div>
                </div>

                {/* Recent Bookings */}
                <div className="mt-10 rounded-2xl border border-[#f1dfe3] bg-white p-6 shadow-sm sm:p-8">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-xl font-bold text-[#7c3547]">
                      Recent Bookings
                    </h2>

                    <Link
                      href="/dashboard/bookings"
                      className="text-sm font-semibold text-[#7c3547] hover:underline"
                    >
                      View All Bookings →
                    </Link>
                  </div>

                  {recentBookings.length === 0 ? (
                    <div className="py-12 text-center">
                      <p className="text-5xl">💍</p>

                      <h3 className="mt-4 text-lg font-semibold text-gray-700">
                        No bookings yet
                      </h3>

                      <p className="mt-2 text-sm text-gray-500">
                        Start exploring wedding services and book your favorite
                        ones.
                      </p>

                      <Link
                        href="/services"
                        className="mt-5 inline-block rounded-xl bg-[#7c3547] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#642a3a]"
                      >
                        Explore Services
                      </Link>
                    </div>
                  ) : (
                    <div className="mt-6 space-y-4">
                      {recentBookings.map((booking) => (
                        <div
                          key={booking._id}
                          className="flex flex-col gap-4 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div>
                            <h3 className="font-semibold text-gray-800">
                              {booking.serviceTitle}
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                              Event Date:{" "}
                              {new Date(booking.eventDate).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                              Location: {booking.eventLocation}
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                              Guests: {booking.guestCount}
                            </p>

                            <p className="mt-2 font-semibold text-[#7c3547]">
                              ৳{booking.servicePrice.toLocaleString("en-BD")}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            <span
                              className={`rounded-full px-4 py-2 text-xs font-semibold ${
                                statusStyles[booking.status] ||
                                "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {statusLabels[booking.status] || booking.status}
                            </span>

                            <Link
                              href="/dashboard/bookings"
                              className="rounded-lg border border-[#7c3547] px-4 py-2 text-sm font-medium text-[#7c3547] transition hover:bg-[#7c3547] hover:text-white"
                            >
                              Details
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* ================= DASHBOARD NAVIGATION CARDS ================= */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-[#7c3547]">Your Dashboard</h2>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(role === "vendor"
              ? vendorDashboardItems
              : customerDashboardItems
            ).map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="rounded-2xl border border-[#f1dfe3] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="text-4xl">{item.icon}</span>

                <h3 className="mt-5 text-xl font-bold text-[#7c3547]">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {item.description}
                </p>

                <p className="mt-5 text-sm font-semibold text-[#7c3547]">
                  Explore →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
