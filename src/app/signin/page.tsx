"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: loginError } = await authClient.signIn.email({
        email,
        password,
      });

      if (loginError) {
        setError(loginError.message || "Login failed. Please try again.");
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

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fff8f6] px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">
        {/* Left Side */}
        <div className="hidden flex-col justify-center bg-[#7c3547] p-12 text-white md:flex">
          <h1 className="mb-5 text-4xl font-bold">Welcome Back!</h1>

          <p className="text-lg leading-8 text-white/85">
            Your dream wedding starts here. Sign in to continue planning your
            special day with WedPlan.
          </p>

          <div className="mt-10 text-6xl">💍</div>
        </div>

        {/* Login Form */}
        <div className="p-8 sm:p-12">
          <h2 className="text-3xl font-bold text-[#7c3547]">Sign In</h2>

          <p className="mt-2 text-gray-500">Welcome back to WedPlan</p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#7c3547] focus:ring-2 focus:ring-[#7c3547]/20"
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
                placeholder="Enter your password"
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#7c3547] focus:ring-2 focus:ring-[#7c3547]/20"
              />
            </div>

            {/* Error Message */}
            {error && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </p>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#7c3547] py-3 font-semibold text-white transition hover:bg-[#642839] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Signup Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-[#7c3547] hover:underline"
            >
              Sign Up
            </Link>
          </p>

          <Link
            href="/"
            className="mt-5 block text-center text-sm text-gray-500 hover:text-[#7c3547]"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
