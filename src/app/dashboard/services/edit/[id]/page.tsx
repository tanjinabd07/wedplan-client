"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { apiFetch } from "@/lib/api";

interface Service {
  _id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  location: string;
  image?: string;
}

export default function EditServicePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");

  // Load existing service information
  useEffect(() => {
    const controller = new AbortController();

    const fetchService = async () => {
      try {
        const response = await apiFetch(
          "http://localhost:5000/api/services/my-services",
          { signal: controller.signal },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load services");
        }

        const service: Service | undefined = data.services.find(
          (item: Service) => item._id === params.id,
        );

        if (!service) {
          throw new Error("Service not found");
        }

        setTitle(service.title);
        setCategory(service.category);
        setDescription(service.description);
        setPrice(String(service.price));
        setLocation(service.location);
        setImage(service.image || "");
      } catch (err) {
        if (controller.signal.aborted) return;

        console.error("Fetch Service Error:", err);
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchService();

    return () => controller.abort();
  }, [params.id]);

  // Update service
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      const response = await apiFetch(
        `http://localhost:5000/api/services/my-services/${params.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            category,
            description,
            price: Number(price),
            location,
            image,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update service");
      }

      // Save Toast message for My Services page
      sessionStorage.setItem(
        "wedplan-toast",
        "Service updated successfully! Waiting for admin approval.",
      );

      router.push("/dashboard/services");
    } catch (err) {
      console.error("Update Service Error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-lg text-gray-600">Loading service...</p>
      </div>
    );
  }

  if (error && !title) {
    return (
      <div className="mx-auto max-w-3xl p-8 text-center">
        <p className="text-red-600">{error}</p>

        <button
          onClick={() => router.push("/dashboard/services")}
          className="mt-4 rounded-lg bg-[#813d54] px-5 py-2 text-white"
        >
          Back to My Services
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f5] px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-md sm:p-8">
        <h1 className="mb-2 text-3xl font-bold text-[#813d54]">
          Edit Your Service
        </h1>

        <p className="mb-8 text-gray-500">
          Update your service information below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block font-medium">Service Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#813d54]"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#813d54]"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={5}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#813d54]"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Price</label>
            <input
              type="number"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#813d54]"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#813d54]"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Image URL</label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Enter image URL"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#813d54]"
            />

            {image && (
              <Image
                src={image}
                alt="Service preview"
                width={600}
                height={300}
                unoptimized
                className="mt-3 h-48 w-full rounded-lg object-cover"
              />
            )}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex flex-wrap gap-3 pt-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#813d54] px-6 py-3 font-semibold text-white hover:bg-[#682d42] disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/dashboard/services")}
              className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
