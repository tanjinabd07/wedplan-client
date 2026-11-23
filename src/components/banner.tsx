import Link from "next/link";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="relative flex min-h-[600px] items-center bg-cover bg-center md:min-h-[680px]"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(38,20,29,0.80), rgba(38,20,29,0.30)), url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=90')",
        }}
      >
        <div className="mx-auto w-full max-w-7xl px-6 py-24">
          <div className="max-w-2xl">
            <p className="mb-6 text-sm font-semibold uppercase tracking-[0.35em] text-[#f3c8cb]">
              Your dream wedding starts here
            </p>

            <h1 className="text-4xl font-bold leading-tight text-white sm:text-6xl md:text-7xl">
              Make Your Day
              <br />
              <span className="font-serif italic text-[#e9b9c0]">
                Unforgettable
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-8 text-white/85 sm:text-lg">
              From the perfect venue to the smallest details, discover
              everything you need to create the wedding of your dreams.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/services"
                className="rounded-full bg-[#813d54] px-8 py-4 font-semibold text-white transition hover:bg-[#682e43]"
              >
                Explore Services →
              </Link>

              <Link
                href="/signup"
                className="rounded-full border border-white/70 px-8 py-4 font-semibold text-white transition hover:bg-white hover:text-[#813d54]"
              >
                Get Started
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap gap-8 text-white">
              <div>
                <p className="text-3xl font-bold">All-in-One</p>
                <p className="mt-1 text-sm text-white/70">
                  Wedding Marketplace
                </p>
              </div>

              <div className="h-12 w-px bg-white/30" />

              <div>
                <p className="text-3xl font-bold">Easy</p>
                <p className="mt-1 text-sm text-white/70">Service Discovery</p>
              </div>

              <div className="h-12 w-px bg-white/30" />

              <div>
                <p className="text-3xl font-bold">Beautiful</p>
                <p className="mt-1 text-sm text-white/70">Wedding Planning</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
