"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import Image from "next/image";

interface Service {
  _id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  location: string;
  image?: string;
  status: "pending" | "approved" | "rejected";
}

export default function MyServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // Toast auto-hide
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  // Show toast after editing
  // Show toast after editing
  useEffect(() => {
    const message = sessionStorage.getItem("wedplan-toast");

    if (!message) return;

    const timer = setTimeout(() => {
      setToastType("success");
      setToast(message);
    }, 0);

    sessionStorage.removeItem("wedplan-toast");

    return () => clearTimeout(timer);
  }, []);

  // Fetch Vendor's Services
  const fetchMyServices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiFetch(
        "http://localhost:5000/api/services/my-services",
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch services");
      }

      setServices(data.services || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    const loadServices = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await apiFetch(
          "http://localhost:5000/api/services/my-services",
          { signal: controller.signal },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch services");
        }

        setServices(data.services || []);
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadServices();

    return () => controller.abort();
  }, []);

  // Delete Service
  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);

      const response = await apiFetch(
        `http://localhost:5000/api/services/my-services/${id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete service");
      }

      setServices((previousServices) =>
        previousServices.filter((service) => service._id !== id),
      );

      setToastType("success");
      setToast("Service deleted successfully!");
    } catch (err) {
      setToastType("error");
      setToast(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  const pendingCount = services.filter(
    (service) => service.status === "pending",
  ).length;

  const approvedCount = services.filter(
    (service) => service.status === "approved",
  ).length;

  const rejectedCount = services.filter(
    (service) => service.status === "rejected",
  ).length;

  return (
    <main className="min-h-screen bg-[#faf7f5] px-4 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Toast Notification */}
        {toast && (
          <div
            role="status"
            className={`fixed right-5 top-5 z-50 flex items-center gap-4 rounded-xl px-6 py-4 text-white shadow-lg ${
              toastType === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            <span>{toast}</span>

            <button onClick={() => setToast("")} className="text-xl font-bold">
              ×
            </button>
          </div>
        )}

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#813d54]">My Services</h1>
            <p className="mt-2 text-gray-600">
              Manage the wedding services you have added.
            </p>
          </div>

          <Link
            href="/dashboard/services/add"
            className="rounded-lg bg-[#813d54] px-6 py-3 text-center font-medium text-white transition hover:bg-[#682d42]"
          >
            + Add New Service
          </Link>
        </div>

        {/* Loading */}
        {loading ? (
          <p className="py-12 text-center text-gray-600">
            Loading your services...
          </p>
        ) : error ? (
          <div className="rounded-lg bg-red-50 p-5 text-center text-red-600">
            {error}
            <button
              onClick={fetchMyServices}
              className="ml-3 font-semibold underline"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">Pending Services</p>
                <h2 className="mt-2 text-3xl font-bold text-yellow-600">
                  {pendingCount}
                </h2>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">Approved Services</p>
                <h2 className="mt-2 text-3xl font-bold text-green-600">
                  {approvedCount}
                </h2>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">Rejected Services</p>
                <h2 className="mt-2 text-3xl font-bold text-red-600">
                  {rejectedCount}
                </h2>
              </div>
            </div>

            {/* Empty State */}
            {services.length === 0 ? (
              <div className="rounded-xl bg-white p-12 text-center shadow-sm">
                <div className="mb-4 text-5xl">💍</div>

                <h2 className="text-xl font-semibold text-gray-800">
                  No Services Added Yet
                </h2>

                <p className="mt-2 text-gray-500">
                  Start by adding your first wedding service.
                </p>

                <Link
                  href="/dashboard/services/add"
                  className="mt-6 inline-block rounded-lg bg-[#813d54] px-6 py-3 text-white hover:bg-[#682d42]"
                >
                  Add Your First Service
                </Link>
              </div>
            ) : (
              <>
                <p className="mb-5 text-gray-600">
                  Total Services: {services.length}
                </p>

                {/* Service Cards */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {services.map((service) => (
                    <div
                      key={service._id}
                      className="overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md"
                    >
                      {service.image ? (
                        <Image
                          src={service.image}
                          alt={service.title}
                          width={600}
                          height={300}
                          unoptimized
                          className="h-48 w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-48 items-center justify-center bg-[#f1e6e9] text-5xl">
                          💍
                        </div>
                      )}

                      <div className="p-5">
                        <div className="mb-3 flex items-center justify-between gap-2">
                          <span className="rounded-full bg-[#f5e9ed] px-3 py-1 text-xs font-medium text-[#813d54]">
                            {service.category}
                          </span>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              service.status === "approved"
                                ? "bg-green-100 text-green-700"
                                : service.status === "rejected"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {service.status}
                          </span>
                        </div>

                        <h2 className="text-lg font-semibold text-gray-800">
                          {service.title}
                        </h2>

                        <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                          {service.description}
                        </p>

                        <div className="mt-4 flex items-center justify-between gap-2 text-sm">
                          <span className="font-semibold text-[#813d54]">
                            ৳{service.price.toLocaleString("en-BD")}
                          </span>

                          <span className="text-gray-500">
                            📍 {service.location}
                          </span>
                        </div>

                        {/* Edit and Delete Buttons */}
                        <div className="mt-5 flex gap-3 border-t border-gray-100 pt-4">
                          <Link
                            href={`/dashboard/services/edit/${service._id}`}
                            className="flex-1 rounded-lg bg-[#813d54] px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-[#682d42]"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() => handleDelete(service._id)}
                            disabled={deletingId === service._id}
                            className="flex-1 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId === service._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}
