import Link from "next/link";

const categories = [
  { name: "Photography", icon: "📸", description: "Capture every moment" },
  { name: "Venues", icon: "🏰", description: "Find your dream venue" },
  { name: "Decoration", icon: "🌸", description: "Beautiful wedding decor" },
  { name: "Catering", icon: "🍽️", description: "Delicious wedding food" },
  { name: "Makeup", icon: "💄", description: "Look your best" },
  { name: "Music & DJ", icon: "🎵", description: "Celebrate with music" },
  { name: "Wedding Cakes", icon: "🎂", description: "Sweeten your day" },
  { name: "Planning", icon: "💍", description: "Plan every detail" },
];

export default function CategorySection() {
  return (
    <section className="bg-[#fffaf8] px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[4px] text-[#a16b7e]">
            Explore Categories
          </p>

          <h2 className="text-3xl font-bold text-[#382832] md:text-4xl">
            Everything for Your Special Day
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Discover all the services you need to make your wedding day
            beautiful and memorable.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href="/services"
              className="group rounded-2xl border border-[#f0e3e5] bg-white p-6 text-center shadow-sm transition duration-300 hover:-translate-y-2 hover:border-[#a16b7e] hover:shadow-lg"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f9edf0] text-3xl transition group-hover:bg-[#813d54]">
                <span className="transition group-hover:scale-110">
                  {category.icon}
                </span>
              </div>

              <h3 className="mb-2 font-semibold text-[#382832]">
                {category.name}
              </h3>

              <p className="text-sm text-gray-500">{category.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
