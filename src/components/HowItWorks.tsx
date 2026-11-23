const steps = [
  {
    number: "01",
    icon: "🔍",
    title: "Explore Services",
    description:
      "Browse different wedding services and discover the perfect options for your special day.",
  },
  {
    number: "02",
    icon: "❤️",
    title: "Choose Your Favorite",
    description:
      "Compare service details, prices and locations to find the right professionals.",
  },
  {
    number: "03",
    icon: "📅",
    title: "Book Your Service",
    description:
      "Choose your preferred service and submit your booking request easily.",
  },
  {
    number: "04",
    icon: "💍",
    title: "Enjoy Your Big Day",
    description:
      "Relax and celebrate your beautiful wedding while professionals handle the details.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[4px] text-[#a16b7e]">
            Simple Process
          </p>

          <h2 className="text-3xl font-bold text-[#382832] md:text-4xl">
            How WedPlan Works
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
            Planning your dream wedding is easier than you think. Just follow
            these simple steps.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative rounded-2xl border border-[#f0e3e5] bg-[#fffaf8] p-7 text-center transition duration-300 hover:-translate-y-2 hover:shadow-lg"
            >
              <span className="absolute right-5 top-5 text-sm font-bold text-[#c9a7b3]">
                {step.number}
              </span>

              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#f9edf0] text-4xl">
                {step.icon}
              </div>

              <h3 className="mb-3 text-lg font-bold text-[#382832]">
                {step.title}
              </h3>

              <p className="text-sm leading-7 text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
