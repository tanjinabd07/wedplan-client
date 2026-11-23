"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();

  const [role, setRole] = useState<"customer" | "vendor">("customer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      setError("Password must contain uppercase and lowercase letters.");
      return;
    }

    try {
      setLoading(true);

      const { error: signupError } = await authClient.signUp.email({
        name,
        email,
        password,
        image: image || undefined,
        role,
      });

      if (signupError) {
        setError(signupError.message || "Signup failed.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Google Sign Up / Sign In
  const handleGoogleSignUp = async () => {
    setError("");

    try {
      setGoogleLoading(true);

      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch {
      setError("Google sign up failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fff8f6] px-4 py-12">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">
        {/* Left Side */}
        <div className="hidden bg-[#7c3547] p-12 text-white md:flex md:flex-col md:justify-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-pink-200">
            Welcome to WedPlan
          </p>

          <h1 className="text-5xl font-bold leading-tight">
            Make your dream wedding a reality.
          </h1>

          <p className="mt-6 text-lg leading-8 text-white/80">
            Discover trusted wedding vendors, organize your special day, and
            turn your dream celebration into beautiful memories.
          </p>

          <div className="mt-10 rounded-2xl border border-white/20 bg-white/10 p-6">
            <p className="text-xl font-medium italic">
              "Your love story deserves a perfect celebration."
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="p-6 sm:p-10 md:p-12">
          <div className="mb-8">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-[#7c3547]"
            >
              ← Back to Home
            </Link>

            <h2 className="mt-5 text-3xl font-bold text-gray-900">
              Create an Account
            </h2>

            <p className="mt-2 text-gray-500">
              Join WedPlan and start planning today.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#7c3547]"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#7c3547]"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                minLength={6}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#7c3547]"
              />
              <p className="mt-1 text-xs text-gray-400">
                Minimum 6 characters, including uppercase and lowercase letters.
              </p>
            </div>

            {/* Profile Image */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Profile Image (Optional)
              </label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Paste image URL (optional)"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#7c3547]"
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="mb-3 block text-sm font-medium text-gray-700">
                I want to join as
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("customer")}
                  className={`rounded-xl border p-4 text-left transition ${
                    role === "customer"
                      ? "border-[#7c3547] bg-[#fff4f6] ring-1 ring-[#7c3547]"
                      : "border-gray-300 hover:border-[#7c3547]"
                  }`}
                >
                  <span className="text-2xl">💍</span>
                  <span className="mt-2 block font-semibold text-gray-900">
                    Customer
                  </span>
                  <span className="mt-1 block text-xs text-gray-500">
                    Plan my wedding
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("vendor")}
                  className={`rounded-xl border p-4 text-left transition ${
                    role === "vendor"
                      ? "border-[#7c3547] bg-[#fff4f6] ring-1 ring-[#7c3547]"
                      : "border-gray-300 hover:border-[#7c3547]"
                  }`}
                >
                  <span className="text-2xl">🏪</span>
                  <span className="mt-2 block font-semibold text-gray-900">
                    Vendor
                  </span>
                  <span className="mt-1 block text-xs text-gray-500">
                    Offer wedding services
                  </span>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </p>
            )}

            {/* Email Signup */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full rounded-xl bg-[#7c3547] py-3.5 font-semibold text-white transition hover:bg-[#642839] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-sm text-gray-400">OR</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Google Signup */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={loading || googleLoading}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white py-3.5 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {googleLoading ? (
                "Redirecting to Google..."
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    className="h-5 w-5"
                  >
                    <path
                      fill="#4285F4"
                      d="M43.6 20.5H42V20H24v8h11.3A12 12 0 0 1 24 36a12 12 0 1 1 0-24c3.1 0 5.9 1.2 8 3.2l5.7-5.7A19.9 19.9 0 0 0 24 4a20 20 0 1 0 20 20c0-1.2-.1-2.3-.4-3.5Z"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            {/* Sign In Link */}
            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-semibold text-[#7c3547] hover:underline"
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
