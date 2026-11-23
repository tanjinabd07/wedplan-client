import Link from "next/link";

export default function VendorDashboard() {
  return (
    <main className="min-h-screen bg-[#fff8f6] px-4 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <p className="font-semibold tracking-[3px] text-[#a16b7e]">
            VENDOR PANEL
          </p>

          <h1 className="mt-3 text-3xl font-bold text-[#7c3547] sm:text-4xl">
            Welcome to Your Dashboard
          </h1>

          <p className="mt-3 text-gray-600">
            Manage your wedding services and grow your business with WedPlan.
          </p>
        </div>

        {/* Welcome Card */}
        <div className="rounded-3xl bg-gradient-to-r from-[#813d54] to-[#a16b7e] p-8 text-white shadow-lg sm:p-10">
          <p className="text-sm font-medium tracking-widest text-white/80">
            WELCOME TO WEDPLAN
          </p>

          <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
            Grow Your Wedding Business
          </h2>

          <p className="mt-3 max-w-xl leading-7 text-white/90">
            Showcase your services, reach more customers and make every wedding
            celebration special.
          </p>

          <Link
            href="/dashboard/services/add"
            className="mt-7 inline-block rounded-full bg-white px-7 py-3 font-semibold text-[#813d54] transition hover:bg-[#fff0f2]"
          >
            + Add New Service
          </Link>
        </div>

        {/* Dashboard Cards */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-[#f1dfe3] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff0f2] text-3xl">
              💍
            </div>

            <h3 className="mt-5 text-xl font-bold text-[#7c3547]">
              Add New Service
            </h3>

            <p className="mt-3 leading-7 text-gray-600">
              Add your wedding photography, decoration, catering or other
              wedding services.
            </p>

            <Link
              href="/dashboard/services/add"
              className="mt-6 inline-block font-semibold text-[#813d54] hover:underline"
            >
              Add Service →
            </Link>
          </div>

          <div className="rounded-2xl border border-[#f1dfe3] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff0f2] text-3xl">
              🔍
            </div>

            <h3 className="mt-5 text-xl font-bold text-[#7c3547]">
              Explore Services
            </h3>

            <p className="mt-3 leading-7 text-gray-600">
              Explore other wedding services available on the WedPlan platform.
            </p>

            <Link
              href="/services"
              className="mt-6 inline-block font-semibold text-[#813d54] hover:underline"
            >
              Browse Services →
            </Link>
          </div>
        </div>

        {/* Information */}
        <div className="mt-10 rounded-2xl border border-[#f1dfe3] bg-white p-7">
          <h3 className="text-xl font-bold text-[#7c3547]">
            Important Information
          </h3>

          <p className="mt-3 leading-7 text-gray-600">
            Newly added services will be reviewed by the WedPlan administration
            team. Once approved, your services will appear on the public
            Services page.
          </p>
        </div>
      </div>
    </main>
  );
}
