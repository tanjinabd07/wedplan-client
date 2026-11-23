"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

interface Subscription {
  plan: "free" | "premium";
  status: string;
  activeServices: number;
  serviceLimit: number | null;
  remainingServices: number | null;
  isPremium: boolean;
  limitExceeded?: boolean;
}

export default function SubscriptionPage() {
  const { data: session, isPending } = authClient.useSession();

  const [subscription, setSubscription] = useState<Subscription | null>(null);

  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [error, setError] = useState("");

  const userRole = session?.user?.role;

  // Fetch subscription details
  useEffect(() => {
    if (isPending || !session?.user?.id || userRole !== "vendor") {
      return;
    }

    let isMounted = true;

    const fetchSubscription = async () => {
      try {
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/subscriptions/status",
          {
            method: "GET",
            credentials: "include",
          },
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load subscription.");
        }

        if (isMounted) {
          setSubscription(data.subscription);
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

    fetchSubscription();

    return () => {
      isMounted = false;
    };
  }, [isPending, session?.user?.id, userRole]);

  // Upgrade to Premium
  const handleUpgrade = async () => {
    try {
      setUpgrading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/subscriptions/checkout",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to start checkout.");
      }

      if (data.checkoutUrl) {
        window.location.assign(data.checkoutUrl);
      } else {
        throw new Error("Checkout URL not found.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment checkout failed.");
      setUpgrading(false);
    }
  };

  // Loading State
  if (isPending || (loading && session?.user?.id && userRole === "vendor")) {
    return (
      <main className="min-h-screen bg-[#fff8f6] flex items-center justify-center">
        <p className="text-[#813d54] font-medium">Loading subscription...</p>
      </main>
    );
  }

  // Not Logged In
  if (!session) {
    return (
      <main className="min-h-screen bg-[#fff8f6] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-[#813d54]">Please Sign In</h1>

          <p className="text-gray-600 mt-2">
            Sign in to view your subscription.
          </p>

          <a
            href="/signin"
            className="inline-block mt-5 bg-[#813d54] text-white px-6 py-3 rounded-lg"
          >
            Sign In
          </a>
        </div>
      </main>
    );
  }

  // Vendor Only
  if (userRole !== "vendor") {
    return (
      <main className="min-h-screen bg-[#fff8f6] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-[#813d54]">
            Vendor Access Only
          </h1>

          <p className="text-gray-600 mt-2">
            Only vendors can access subscription details.
          </p>
        </div>
      </main>
    );
  }

  // Check Free Plan Limit
  const limitExceeded =
    subscription !== null &&
    !subscription.isPremium &&
    (subscription.limitExceeded === true ||
      (subscription.serviceLimit !== null &&
        subscription.activeServices > subscription.serviceLimit));

  return (
    <main className="min-h-screen bg-[#fff8f6] py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Page Heading */}
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-[3px] text-[#a16b7e]">
            WedPlan Membership
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-[#813d54] mt-3">
            Subscription Plans
          </h1>

          <p className="text-gray-600 mt-3">
            Choose the right plan to grow your wedding business.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Current Subscription */}
        {subscription && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#ead9df] p-6 md:p-8 mb-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div>
                <p className="text-gray-500 text-sm">Your Current Plan</p>

                <h2 className="text-3xl font-bold text-[#813d54] mt-2 capitalize">
                  {subscription.plan} Plan
                </h2>

                <p className="text-gray-500 mt-2">
                  Status:{" "}
                  <span className="font-semibold capitalize text-[#813d54]">
                    {subscription.status}
                  </span>
                </p>
              </div>

              <div className="bg-[#fff8f6] rounded-xl p-5 min-w-52">
                <p className="text-sm text-gray-500">Active Services</p>

                <p className="text-3xl font-bold text-[#813d54] mt-2">
                  {subscription.activeServices}

                  <span className="text-lg text-gray-400">
                    {" "}
                    / {subscription.serviceLimit ?? "Unlimited"}
                  </span>
                </p>

                {!subscription.isPremium && (
                  <p className="text-sm text-gray-600 mt-2">
                    {subscription.remainingServices} remaining
                  </p>
                )}
              </div>
            </div>

            {/* Free Plan Limit Warning */}
            {limitExceeded && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-5">
                <h3 className="text-red-700 font-bold text-lg">
                  Free Plan Limit Exceeded!
                </h3>

                <p className="text-red-600 text-sm mt-2 leading-6">
                  You currently have {subscription.activeServices} active
                  services, but your Free Plan allows only{" "}
                  {subscription.serviceLimit} active services. Please upgrade to
                  Premium or reduce your active services.
                </p>

                <p className="text-red-700 font-semibold text-sm mt-3">
                  Upgrade to Premium to enjoy unlimited active services.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl border border-gray-200 p-7 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800">Free Plan</h2>

            <p className="text-gray-500 mt-2">Perfect for getting started.</p>

            <div className="my-7">
              <span className="text-4xl font-bold text-[#813d54]">৳0</span>

              <span className="text-gray-500"> / month</span>
            </div>

            <ul className="space-y-4 text-gray-600">
              <li>✓ Maximum 3 Active Services</li>
              <li>✓ Receive Booking Requests</li>
              <li>✓ Manage Your Services</li>
              <li>✓ Vendor Dashboard Access</li>
            </ul>

            <div className="mt-8">
              {subscription?.plan === "free" ? (
                <button
                  disabled
                  className="w-full bg-gray-100 text-gray-500 py-3 rounded-lg font-semibold cursor-not-allowed"
                >
                  Your Current Plan
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-100 text-gray-500 py-3 rounded-lg font-semibold"
                >
                  Free Plan
                </button>
              )}
            </div>
          </div>

          {/* Premium Plan */}
          <div className="bg-white rounded-2xl border-2 border-[#813d54] p-7 shadow-md relative">
            <span className="absolute -top-3 right-6 bg-[#813d54] text-white text-xs px-4 py-1 rounded-full">
              RECOMMENDED
            </span>

            <h2 className="text-2xl font-bold text-[#813d54]">Premium Plan</h2>

            <p className="text-gray-500 mt-2">
              Grow your business without limits.
            </p>

            <div className="my-7">
              <span className="text-4xl font-bold text-[#813d54]">৳1,000</span>

              <span className="text-gray-500"> / month</span>
            </div>

            <ul className="space-y-4 text-gray-600">
              <li>✓ Unlimited Active Services</li>
              <li>✓ Receive Booking Requests</li>
              <li>✓ Manage Your Services</li>
              <li>✓ Vendor Dashboard Access</li>
              <li>✓ Grow Your Wedding Business</li>
            </ul>

            <div className="mt-8">
              {subscription?.isPremium ? (
                <button
                  disabled
                  className="w-full bg-green-100 text-green-700 py-3 rounded-lg font-semibold cursor-not-allowed"
                >
                  Premium Activated
                </button>
              ) : (
                <button
                  onClick={handleUpgrade}
                  disabled={upgrading}
                  className="w-full bg-[#813d54] hover:bg-[#692b40] disabled:opacity-60 text-white py-3 rounded-lg font-semibold transition"
                >
                  {upgrading
                    ? "Redirecting to Checkout..."
                    : "Upgrade to Premium"}
                </button>
              )}
            </div>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          Secure subscription management with WedPlan.
        </p>
      </div>
    </main>
  );
}
