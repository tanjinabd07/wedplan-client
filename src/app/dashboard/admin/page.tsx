"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

interface Service {
  _id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  location: string;
  image?: string;
  vendorId: string;
  status: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: "customer" | "vendor" | "admin";
  image?: string;
  isBlocked: boolean;
  createdAt?: string;
}

interface Transaction {
  id: string;
  vendorName: string;
  vendorEmail: string;
  plan: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  transactionDate: string | null;
  stripeSessionId: string;
}

export default function AdminPage() {
  const { data: session, isPending } = authClient.useSession();

  const [services, setServices] = useState<Service[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [transactionLoading, setTransactionLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [transactionSearch, setTransactionSearch] = useState("");
  const [transactionStatus, setTransactionStatus] = useState("all");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [processingEmail, setProcessingEmail] = useState("");

  // Load pending services
  useEffect(() => {
    if (session?.user?.role !== "admin") return;

    const loadServices = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/services/pending",
          { credentials: "include" },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load services.");
        }

        setServices(data.services || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, [session]);

  // Load users with search and role filter
  useEffect(() => {
    if (session?.user?.role !== "admin") return;

    const loadUsers = async () => {
      try {
        const params = new URLSearchParams();

        if (search.trim()) {
          params.set("search", search.trim());
        }

        params.set("role", roleFilter);

        const response = await fetch(
          `http://localhost:5000/api/admin/users?${params.toString()}`,
          { credentials: "include" },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load users.");
        }

        setUsers(data.users || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load users.");
      } finally {
        setUsersLoading(false);
      }
    };

    loadUsers();
  }, [session, search, roleFilter]);

  // Load transactions with search and status filter
  useEffect(() => {
    if (session?.user?.role !== "admin") return;

    const loadTransactions = async () => {
      try {
        const params = new URLSearchParams();

        if (transactionSearch.trim()) {
          params.set("search", transactionSearch.trim());
        }

        params.set("status", transactionStatus);

        const response = await fetch(
          `http://localhost:5000/api/admin/transactions?${params.toString()}`,
          { credentials: "include" },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load transactions.");
        }

        setTransactions(data.transactions || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load transactions.",
        );
      } finally {
        setTransactionLoading(false);
      }
    };

    loadTransactions();
  }, [session, transactionSearch, transactionStatus]);

  // Approve or Reject service
  const handleStatusUpdate = async (
    serviceId: string,
    status: "approved" | "rejected",
  ) => {
    try {
      setMessage("");
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/services/${serviceId}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update service.");
      }

      setServices((previous) =>
        previous.filter((service) => service._id !== serviceId),
      );

      setMessage(`Service ${status} successfully!`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  // Block or Unblock user
  const handleBlockStatus = async (email: string, isBlocked: boolean) => {
    try {
      setMessage("");
      setError("");
      setProcessingEmail(email);

      const response = await fetch(
        `http://localhost:5000/api/admin/users/${encodeURIComponent(email)}/block`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isBlocked }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update user.");
      }

      setUsers((previous) =>
        previous.map((user) =>
          user.email === email ? { ...user, isBlocked: data.isBlocked } : user,
        ),
      );

      setMessage(data.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setProcessingEmail("");
    }
  };

  // Calculate total revenue from paid transactions
  const totalRevenue = transactions
    .filter((transaction) => transaction.paymentStatus === "paid")
    .reduce((total, transaction) => total + transaction.amount, 0);

  if (isPending) {
    return <main className="p-10 text-center">Loading...</main>;
  }

  if (!session) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Please Sign In</h1>

        <Link href="/signin" className="mt-4 text-[#7c3547] underline">
          Go to Sign In
        </Link>
      </main>
    );
  }

  if (session.user.role !== "admin") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-red-600">Admin Access Only</h1>

        <Link href="/dashboard" className="mt-4 underline">
          Back to Dashboard
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff8f6] px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-[#7c3547]">Admin Dashboard</h1>

        <p className="mt-2 text-gray-600">
          Review services and manage platform users.
        </p>

        {message && (
          <p className="mt-5 rounded-lg bg-green-50 p-3 text-green-700">
            {message}
          </p>
        )}

        {error && (
          <p className="mt-5 rounded-lg bg-red-50 p-3 text-red-600">{error}</p>
        )}

        {/* Pending Services */}
        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">
            Pending Services ({services.length})
          </h2>

          {loading ? (
            <p className="py-10 text-center text-gray-500">
              Loading services...
            </p>
          ) : services.length === 0 ? (
            <p className="py-10 text-center text-gray-500">
              No pending services available.
            </p>
          ) : (
            <div className="mt-6 space-y-5">
              {services.map((service) => (
                <div
                  key={service._id}
                  className="rounded-xl border border-gray-200 p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                    <div>
                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                        Pending
                      </span>

                      <h3 className="mt-3 text-xl font-bold text-[#7c3547]">
                        {service.title}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {service.category}
                      </p>

                      <p className="mt-3 text-gray-600">
                        {service.description}
                      </p>

                      <p className="mt-2 text-sm text-gray-600">
                        Location: {service.location}
                      </p>

                      <p className="mt-1 font-semibold text-gray-800">
                        Price: ৳{service.price.toLocaleString("en-BD")}
                      </p>
                    </div>

                    {service.image && (
                      <div className="relative h-36 w-full overflow-hidden rounded-xl sm:w-48">
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          sizes="(min-width: 640px) 192px, 100vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      onClick={() =>
                        handleStatusUpdate(service._id, "approved")
                      }
                      className="rounded-lg bg-green-600 px-5 py-2 font-medium text-white hover:bg-green-700"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        handleStatusUpdate(service._id, "rejected")
                      }
                      className="rounded-lg bg-red-600 px-5 py-2 font-medium text-white hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Manage Users */}
        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Manage Users
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Search, filter and manage customers and vendors.
              </p>
            </div>

            <span className="rounded-full bg-[#f8e9ed] px-4 py-2 text-sm font-semibold text-[#7c3547]">
              {users.length} Users
            </span>
          </div>

          {/* Search and Filter */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#7c3547]"
            />

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#7c3547]"
            >
              <option value="all">All Users</option>
              <option value="customer">Customers</option>
              <option value="vendor">Vendors</option>
            </select>
          </div>

          {/* User List */}
          {usersLoading ? (
            <p className="py-10 text-center text-gray-500">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="py-10 text-center text-gray-500">No users found.</p>
          ) : (
            <div className="mt-6 space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col gap-4 rounded-xl border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f8e9ed] text-lg font-bold text-[#7c3547]">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}

                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {user.name}
                      </h3>

                      <p className="text-sm text-gray-500">{user.email}</p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium capitalize text-blue-700">
                          {user.role}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            user.isBlocked
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {user.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {user.role !== "admin" && (
                    <button
                      onClick={() =>
                        handleBlockStatus(user.email, !user.isBlocked)
                      }
                      disabled={processingEmail === user.email}
                      className={`rounded-lg px-5 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 ${
                        user.isBlocked
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {processingEmail === user.email
                        ? "Please wait..."
                        : user.isBlocked
                          ? "Unblock User"
                          : "Block User"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Transactions Management */}
        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Transactions Management
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Monitor vendor subscription payments.
              </p>
            </div>

            <span className="rounded-full bg-[#f8e9ed] px-4 py-2 text-sm font-semibold text-[#7c3547]">
              {transactions.length} Transactions
            </span>
          </div>

          {/* Transaction Summary */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-[#fff8f6] p-5">
              <p className="text-sm text-gray-500">Total Transactions</p>

              <h3 className="mt-2 text-2xl font-bold text-[#7c3547]">
                {transactions.length}
              </h3>
            </div>

            <div className="rounded-xl bg-[#fff8f6] p-5">
              <p className="text-sm text-gray-500">Paid Revenue</p>

              <h3 className="mt-2 text-2xl font-bold text-green-700">
                ৳{totalRevenue.toLocaleString("en-BD")}
              </h3>
            </div>
          </div>

          {/* Search and Status Filter */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              value={transactionSearch}
              onChange={(e) => {
                setTransactionLoading(true);
                setTransactionSearch(e.target.value);
              }}
              placeholder="Search vendor name or email..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#7c3547]"
            />

            <select
              value={transactionStatus}
              onChange={(e) => {
                setTransactionLoading(true);
                setTransactionStatus(e.target.value);
              }}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#7c3547]"
            >
              <option value="all">All Transactions</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Transaction Table */}
          {transactionLoading ? (
            <p className="py-10 text-center text-gray-500">
              Loading transactions...
            </p>
          ) : transactions.length === 0 ? (
            <p className="py-10 text-center text-gray-500">
              No transactions found.
            </p>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[850px] border-collapse text-left">
                <thead>
                  <tr className="border-b bg-[#fff8f6] text-sm text-gray-600">
                    <th className="px-4 py-4 font-semibold">Vendor</th>

                    <th className="px-4 py-4 font-semibold">Plan</th>

                    <th className="px-4 py-4 font-semibold">Amount</th>

                    <th className="px-4 py-4 font-semibold">Payment Status</th>

                    <th className="px-4 py-4 font-semibold">Date</th>

                    <th className="px-4 py-4 font-semibold">Transaction ID</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-b border-gray-100 text-sm hover:bg-gray-50"
                    >
                      <td className="px-4 py-4">
                        <p className="font-semibold text-gray-800">
                          {transaction.vendorName}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {transaction.vendorEmail}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold capitalize text-purple-700">
                          {transaction.plan}
                        </span>
                      </td>

                      <td className="px-4 py-4 font-semibold text-gray-800">
                        {transaction.currency === "BDT" ? "৳" : ""}
                        {transaction.amount.toLocaleString("en-BD")}
                        {transaction.currency !== "BDT" &&
                          ` ${transaction.currency}`}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                            transaction.paymentStatus === "paid"
                              ? "bg-green-100 text-green-700"
                              : transaction.paymentStatus === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {transaction.paymentStatus}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {transaction.transactionDate
                          ? new Date(
                              transaction.transactionDate,
                            ).toLocaleDateString("en-BD")
                          : "N/A"}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className="text-xs text-gray-500"
                          title={transaction.stripeSessionId}
                        >
                          {transaction.stripeSessionId
                            ? `${transaction.stripeSessionId.slice(0, 14)}...`
                            : "N/A"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
