"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
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
          You need to login to view your profile.
        </p>
        <Link
          href="/login"
          className="mt-5 rounded-xl bg-[#7c3547] px-6 py-3 text-white"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const user = session.user;

  return (
    <main className="min-h-screen bg-[#fff8f6] px-4 py-12">
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-lg sm:p-10">
        <div className="text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#7c3547] text-4xl font-bold text-white">
            {user.name?.charAt(0).toUpperCase() || "U"}
          </div>

          <h1 className="mt-5 text-3xl font-bold text-[#7c3547]">My Profile</h1>

          <p className="mt-2 text-gray-500">Manage your WedPlan account</p>
        </div>

        <div className="mt-10 space-y-5">
          <div className="rounded-xl bg-[#fff8f6] p-4">
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="mt-1 font-semibold text-gray-800">{user.name}</p>
          </div>

          <div className="rounded-xl bg-[#fff8f6] p-4">
            <p className="text-sm text-gray-500">Email Address</p>
            <p className="mt-1 break-all font-semibold text-gray-800">
              {user.email}
            </p>
          </div>

          <div className="rounded-xl bg-[#fff8f6] p-4">
            <p className="text-sm text-gray-500">Account Role</p>
            <p className="mt-1 font-semibold capitalize text-gray-800">
              {user.role || "Customer"}
            </p>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="mt-8 w-full rounded-xl bg-[#7c3547] py-3 font-semibold text-white transition hover:bg-[#642839]"
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
