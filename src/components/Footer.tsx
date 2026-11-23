import Link from "next/link";
import { connection } from "next/server";

export default async function Footer() {
  // Wait for the incoming request before reading the current date
  await connection();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#382832] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="text-3xl font-bold text-rose-200">
              💍 WedPlan
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-gray-300">
              Your perfect wedding starts here. Discover trusted professionals
              and make your dream wedding unforgettable with WedPlan.
            </p>

            <div className="mt-6 flex gap-4">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-[#813d54]"
              >
                f
              </a>

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-[#813d54]"
              >
                ◎
              </a>

              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-[#813d54]"
              >
                in
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-rose-200">
              Quick Links
            </h3>

            <ul className="space-y-4 text-sm text-gray-300">
              <li>
                <Link href="/" className="hover:text-rose-200">
                  Home
                </Link>
              </li>

              <li>
                <Link href="/services" className="hover:text-rose-200">
                  Browse Services
                </Link>
              </li>

              <li>
                <Link href="/signup" className="hover:text-rose-200">
                  Create Account
                </Link>
              </li>

              <li>
                <Link href="/signin" className="hover:text-rose-200">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-rose-200">
              Our Services
            </h3>

            <ul className="space-y-4 text-sm text-gray-300">
              <li>Wedding Photography</li>
              <li>Wedding Venues</li>
              <li>Decoration</li>
              <li>Catering</li>
              <li>Makeup Artists</li>
              <li>Music & DJ</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-rose-200">
              Contact Us
            </h3>

            <ul className="space-y-4 text-sm leading-6 text-gray-300">
              <li>📍 Dhaka, Bangladesh</li>

              <li>
                ✉️{" "}
                <a
                  href="mailto:wedplan@example.com"
                  className="hover:text-rose-200"
                >
                  wedplan@example.com
                </a>
              </li>

              <li>💍 Making your wedding memorable</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 border-t border-white/15 pt-7 text-center text-sm text-gray-400">
          <p>© {currentYear} WedPlan. All rights reserved.</p>

          <p className="mt-2 text-rose-200">
            Made with ❤️ for your special day.
          </p>
        </div>
      </div>
    </footer>
  );
}
