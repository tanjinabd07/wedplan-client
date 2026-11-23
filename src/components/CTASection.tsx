import Link from "next/link";

export default function CTASection() {
  return (
    <section
      className="relative overflow-hidden bg-cover bg-center px-6 py-24"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#382832]/75"></div>

      <div className="relative z-10 mx-auto max-w-4xl text-center text-white">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[4px] text-rose-200">
          Start Your Journey
        </p>

        <h2 className="mb-6 text-3xl font-bold leading-tight md:text-5xl">
          Let&apos;s Make Your Dream Wedding Come True
        </h2>

        <p className="mx-auto mb-9 max-w-2xl leading-8 text-white/90">
          Your beautiful wedding journey starts with one simple step. Join
          WedPlan and discover everything you need for your special day.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-full bg-white px-8 py-3.5 font-semibold text-[#813d54] transition hover:bg-rose-100"
          >
            Get Started Today
          </Link>

          <Link
            href="/services"
            className="rounded-full border border-white px-8 py-3.5 font-semibold text-white transition hover:bg-white hover:text-[#813d54]"
          >
            Explore Services
          </Link>
        </div>
      </div>
    </section>
  );
}
