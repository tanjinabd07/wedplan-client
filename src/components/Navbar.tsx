"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await authClient.signOut();
    setProfileOpen(false);
    setMobileOpen(false);
    router.push("/login");
    router.refresh();
  };

  const user = session?.user;

  const dashboardLink =
    user?.role === "vendor"
      ? "/dashboard"
      : user?.role === "admin"
        ? "/dashboard/admin"
        : "/dashboard";

  return (
    <nav className="sticky top-0 z-50 border-b border-[#f1dfe3] bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-[#7c3547]">
          💍 WedPlan
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="font-medium text-gray-700 transition hover:text-[#7c3547]"
          >
            Home
          </Link>

          <Link
            href="/services"
            className="font-medium text-gray-700 transition hover:text-[#7c3547]"
          >
            Browse Services
          </Link>
        </div>

        {/* Authentication */}
        <div className="hidden items-center gap-4 md:flex">
          {isPending ? (
            <span className="text-sm text-gray-400">Loading...</span>
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-full border border-[#ead5da] px-4 py-2 text-[#7c3547] hover:bg-[#fff8f6]"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7c3547] text-white">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </span>

                <span className="max-w-32 truncate font-medium">
                  {user.name || "My Account"}
                </span>

                <span>⌄</span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-xl border border-gray-100 bg-white p-3 shadow-lg">
                  <div className="border-b border-gray-100 px-3 py-2">
                    <p className="font-semibold text-gray-800">{user.name}</p>

                    <p className="truncate text-xs text-gray-500">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    href={dashboardLink}
                    onClick={() => setProfileOpen(false)}
                    className="mt-2 block rounded-lg px-3 py-2 text-sm font-medium text-[#7c3547] hover:bg-[#fff8f6]"
                  >
                    Dashboard
                  </Link>

                  <Link
                    href="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-[#fff8f6] hover:text-[#7c3547]"
                  >
                    My Profile
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/signin"
                className="rounded-full border border-[#7c3547] px-5 py-2.5 font-semibold text-[#7c3547] transition hover:bg-[#fff8f6]"
              >
                Sign In
              </Link>

              <Link
                href="/signup"
                className="rounded-full bg-[#7c3547] px-6 py-2.5 font-semibold text-white transition hover:bg-[#642839]"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-2xl text-[#7c3547] md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-5 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="text-gray-700 hover:text-[#7c3547]"
            >
              Home
            </Link>

            <Link
              href="/services"
              onClick={() => setMobileOpen(false)}
              className="text-gray-700 hover:text-[#7c3547]"
            >
              Browse Services
            </Link>

            {!isPending &&
              (user ? (
                <>
                  <p className="font-medium text-[#7c3547]">{user.name}</p>

                  <Link
                    href={dashboardLink}
                    onClick={() => setMobileOpen(false)}
                    className="font-medium text-[#7c3547]"
                  >
                    Dashboard
                  </Link>

                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="text-gray-700 hover:text-[#7c3547]"
                  >
                    My Profile
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="text-left text-red-600"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    onClick={() => setMobileOpen(false)}
                    className="font-semibold text-[#7c3547]"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="font-semibold text-[#7c3547]"
                  >
                    Sign Up
                  </Link>
                </>
              ))}
          </div>
        </div>
      )}
    </nav>
  );
}
