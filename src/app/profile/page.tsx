"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import Image from "next/image";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const user = session?.user;
  // নতুন upload করা ছবি থাকলে সেটা, না থাকলে আগের ছবি
  const currentImage = image ?? user?.image;

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/signin");
    router.refresh();
  };

  const handleImageChange = async (file: File | undefined) => {
    if (!file) return;

    setMessage("");
    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("image", file);

      // FormData পাঠানোর সময় Content-Type header দেওয়া যাবে না
      const response = await apiFetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Image upload failed.");
      }

      setImage(data.imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const updatedName = (name ?? user?.name ?? "").trim();
    const updatedImage = (image ?? user?.image ?? "").trim();

    if (!updatedName) {
      setError("Please enter your name.");
      return;
    }

    try {
      setIsSaving(true);

      const response = await apiFetch(
        "http://localhost:5000/api/users/profile",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: updatedName,
            image: updatedImage || null,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Profile update failed.");
      }

      // Update Better Auth user session
      await authClient.updateUser({
        name: data.user.name,
        image: data.user.image || "",
      });

      setName(null);
      setImage(null);
      setMessage("Profile updated successfully!");
      setIsEditing(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fff8f6]">
        <p className="text-[#7c3547]">Loading profile...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#fff8f6] px-4">
        <h1 className="text-2xl font-bold text-[#7c3547]">Please Sign In</h1>

        <p className="mt-2 text-gray-600">
          You need to sign in to view your profile.
        </p>

        <Link
          href="/signin"
          className="mt-5 rounded-xl bg-[#7c3547] px-6 py-3 text-white"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff8f6] px-4 py-12">
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-lg sm:p-10">
        <div className="text-center">
          {currentImage ? (
            <Image
              src={currentImage}
              alt="Profile"
              width={96}
              height={96}
              unoptimized
              className="mx-auto h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#7c3547] text-4xl font-bold text-white">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          )}

          <h1 className="mt-5 text-3xl font-bold text-[#7c3547]">My Profile</h1>

          <p className="mt-2 text-gray-500">Manage your WedPlan account</p>
        </div>

        {message && (
          <p className="mt-6 rounded-xl bg-green-50 p-3 text-center text-sm text-green-700">
            {message}
          </p>
        )}

        {error && (
          <p className="mt-6 rounded-xl bg-red-50 p-3 text-center text-sm text-red-600">
            {error}
          </p>
        )}

        {isEditing ? (
          <form onSubmit={handleUpdateProfile} className="mt-10 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Full Name
              </label>

              <input
                type="text"
                value={name ?? user?.name ?? ""}
                onChange={(e) => setName(e.target.value)}
                maxLength={80}
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-800 outline-none focus:border-[#7c3547]"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label
                htmlFor="profile-image"
                className="mb-2 block text-sm font-medium text-gray-600"
              >
                Profile Image
              </label>

              <input
                id="profile-image"
                type="file"
                accept="image/*"
                disabled={isUploading || isSaving}
                onChange={(e) => {
                  handleImageChange(e.target.files?.[0]);
                  e.target.value = "";
                }}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-600 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-[#7c3547] file:px-4 file:py-2 file:text-white disabled:opacity-60"
              />

              <p className="mt-2 text-xs text-gray-400">
                {isUploading
                  ? "Uploading image..."
                  : "Choose an image (max 5MB), then click Save Changes."}
              </p>

              {currentImage && (
                <button
                  type="button"
                  disabled={isUploading || isSaving}
                  onClick={() => setImage("")}
                  className="mt-2 text-sm text-red-600 hover:underline disabled:opacity-60"
                >
                  Remove image
                </button>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSaving || isUploading}
                className="flex-1 rounded-xl bg-[#7c3547] py-3 font-semibold text-white transition hover:bg-[#642839] disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                disabled={isSaving || isUploading}
                onClick={() => {
                  setName(null);
                  setImage(null);
                  setIsEditing(false);
                  setError("");
                }}
                className="flex-1 rounded-xl border border-gray-300 py-3 font-semibold text-gray-600 transition hover:bg-gray-100 disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="mt-10 space-y-5">
              <div className="rounded-xl bg-[#fff8f6] p-4">
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="mt-1 font-semibold text-gray-800">{user?.name}</p>
              </div>

              <div className="rounded-xl bg-[#fff8f6] p-4">
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="mt-1 break-all font-semibold text-gray-800">
                  {user?.email}
                </p>
              </div>

              <div className="rounded-xl bg-[#fff8f6] p-4">
                <p className="text-sm text-gray-500">Account Role</p>
                <p className="mt-1 font-semibold capitalize text-gray-800">
                  {user?.role || "Customer"}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setName(user?.name || "");
                setImage(user?.image || "");
                setMessage("");
                setError("");
                setIsEditing(true);
              }}
              className="mt-8 w-full rounded-xl border-2 border-[#7c3547] py-3 font-semibold text-[#7c3547] transition hover:bg-[#fff8f6]"
            >
              Edit Profile
            </button>
          </>
        )}

        <button
          onClick={handleSignOut}
          className="mt-4 w-full rounded-xl bg-[#7c3547] py-3 font-semibold text-white transition hover:bg-[#642839]"
        >
          Sign Out
        </button>

        <Link
          href="/"
          className="mt-5 block text-center text-sm text-gray-500 hover:text-[#7c3547]"
        >
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
