"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function AddServicePage() {
  const { data: session, isPending } = authClient.useSession();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!session?.user) {
      setError("Please sign in first.");
      return;
    }

    if (session.user.role !== "vendor") {
      setError("Only vendors can add services.");
      return;
    }

    if (!imageFile) {
      setError("Please select a service image.");
      return;
    }

    if (imageFile.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Upload image to ImgBB
      const formData = new FormData();
      formData.append("image", imageFile);

      const uploadResponse = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok || !uploadData.success) {
        throw new Error(uploadData.message || "Image upload failed.");
      }

      const imageUrl = uploadData.imageUrl;

      // Step 2: Save service with uploaded image URL
      const response = await fetch("http://localhost:5000/api/services/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          category,
          description,
          price: Number(price),
          location,
          image: imageUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add service.");
      }

      setMessage("Service submitted successfully! Waiting for admin approval.");

      setTitle("");
      setCategory("");
      setDescription("");
      setPrice("");
      setLocation("");
      setImageFile(null);

      const fileInput = document.getElementById(
        "service-image",
      ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fff8f6]">
        <p className="text-[#7c3547]">Loading...</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#fff8f6]">
        <h1 className="text-2xl font-bold text-[#7c3547]">Please Sign In</h1>

        <Link
          href="/signin"
          className="mt-5 rounded-xl bg-[#7c3547] px-6 py-3 text-white"
        >
          Sign In
        </Link>
      </main>
    );
  }

  if (session.user.role !== "vendor") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#fff8f6] px-4">
        <h1 className="text-2xl font-bold text-[#7c3547]">
          Vendor Access Only
        </h1>

        <p className="mt-3 text-gray-600">
          Only vendor accounts can add services.
        </p>

        <Link href="/dashboard" className="mt-5 text-[#7c3547] underline">
          Back to Dashboard
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff8f6] px-4 py-12">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-lg sm:p-10">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-[#7c3547] hover:underline"
          >
            ← Back to Dashboard
          </Link>

          <h1 className="mt-5 text-3xl font-bold text-[#7c3547]">
            Add New Service
          </h1>

          <p className="mt-2 text-gray-500">
            Share your wedding service with customers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Service Title */}
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Service Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Example: Wedding Photography"
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#7c3547]"
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#7c3547]"
            >
              <option value="">Select a category</option>
              <option value="Photography">Photography</option>
              <option value="Catering">Catering</option>
              <option value="Decoration">Decoration</option>
              <option value="Wedding Venue">Wedding Venue</option>
              <option value="Makeup Artist">Makeup Artist</option>
              <option value="Wedding Planning">Wedding Planning</option>
              <option value="Music & Entertainment">
                Music & Entertainment
              </option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your service..."
              required
              rows={5}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#7c3547]"
            />
          </div>

          {/* Price */}
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Price (BDT)
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter your service price"
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#7c3547]"
            />
          </div>

          {/* Location */}
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Location
            </label>

            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Example: Dhaka, Bangladesh"
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#7c3547]"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Service Image
            </label>

            <input
              id="service-image"
              type="file"
              accept="image/*"
              required
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-[#f5e9ed] file:px-4 file:py-2 file:font-medium file:text-[#7c3547]"
            />

            <p className="mt-2 text-xs text-gray-500">
              Select an image from your device. Maximum size: 5 MB.
            </p>

            {imageFile && (
              <p className="mt-2 text-sm text-green-700">
                Selected: {imageFile.name}
              </p>
            )}
          </div>

          {/* Error */}
          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          {/* Success */}
          {message && (
            <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
              {message}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#7c3547] py-3 font-semibold text-white transition hover:bg-[#642839] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Uploading & Submitting..." : "Submit Service"}
          </button>
        </form>
      </div>
    </main>
  );
}
