import Link from "next/link";
import {
  EnvelopeIcon,
  RocketLaunchIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";

const footerNavigation = {
  main: [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Categories", href: "/categories" },
    { name: "Guidelines", href: "/guidelines" },
    { name: "Terms", href: "/terms" },
    { name: "Privacy", href: "/privacy" },
  ],
  social: [
    {
      name: "Twitter",
      href: "https://twitter.com/yourplatform",
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/company/yourplatform",
    },
    {
      name: "Facebook",
      href: "https://facebook.com/yourplatform",
    },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative bg-gradient-to-b border-t-2 from-white to-gray-200 overflow-hidden"
      aria-labelledby="footer-heading"
    >
      {/* Parallax Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-50 rounded-full mix-blend-multiply opacity-70 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-50 rounded-full mix-blend-multiply opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute top-40 left-20 w-80 h-80 bg-pink-50 rounded-full mix-blend-multiply opacity-70 animate-blob animation-delay-4000" />
      </div>

      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      <div className="relative mx-auto max-w-[1400px] pt-12 lg:px-8">
        {/* Three CTAs Section */}
        <div className="grid md:grid-cols-3 px-6 gap-8 mb-16">
          {/* Write Content CTA */}
          <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-blue-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-lg blur-xl transition-all duration-500 group-hover:blur-2xl opacity-0 group-hover:opacity-100" />
              <div className="relative">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Share Your Voice
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Join our community of writers and earn <br /> from your content.
                  Start your journey today.
                </p>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg group"
                >
                  Start Writing
                  <RocketLaunchIcon className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* Discover Content CTA - Similar structure with different colors */}
          <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-purple-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg blur-xl transition-all duration-500 group-hover:blur-2xl opacity-0 group-hover:opacity-100" />
              <div className="relative">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Explore Stories
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Discover curated articles from independent voices around the
                  world.
                </p>
                <Link
                  href="/categories"
                  className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-md hover:shadow-lg group"
                >
                  Browse Categories
                  <svg
                    className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Monetization CTA - Similar structure with different colors */}
          <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-green-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg blur-xl transition-all duration-500 group-hover:blur-2xl opacity-0 group-hover:opacity-100" />
              <div className="relative">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Earn From Content
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Turn your passion into profit with our fair monetization program.
                </p>
                <Link
                  href="/monetization"
                  className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg group"
                >
                  Learn More
                  <BanknotesIcon className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="relative md:flex justify-center border-t items-center backdrop-blur-sm">
          {/* Brand Section */}
          <div className="pt-12 pb-8 pr-6 border-r">
            <div className="flex flex-col space-y-4">
              <div className="flex space-x-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg transform hover:scale-110 transition-transform duration-300" />
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
                  Blog
                </span>
              </div>
              <p className="text-sm text-gray-600 max-w-md leading-tight">
                Empowering independent voices through <br /> quality journalism and
                fair monetization.
              </p>
              <div className="flex gap-2 text-gray-500 hover:text-blue-600 transition-colors group cursor-pointer">
                <EnvelopeIcon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <a
                  href="mailto:contact@yourplatform.com"
                  className="text-sm transition-colors"
                >
                  contact@yourplatform.com
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Section */}
          <div className="mt-8 pt-8 pl-8">
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {footerNavigation.main.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-1.5 bg-white/80 backdrop-blur-sm text-sm text-gray-600 hover:text-blue-600 rounded-full border border-gray-100 hover:border-blue-100 hover:bg-blue-50/50 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="flex justify-center gap-6 mb-8">
              {footerNavigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-500 hover:text-blue-600 transition-all duration-300 hover:-translate-y-0.5"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="text-sm font-medium">{item.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="relative flex flex-col sm:flex-row justify-center items-center gap-4 text-center py-8 backdrop-blur-sm">
          <div className="flex flex-wrap items-center justify-center gap-4 text-gray-500">
            <p className="text-sm">
              &copy; {currentYear} Independent Journalism Platform
            </p>
            <div className="hidden sm:block text-gray-300">•</div>
            <span className="text-sm bg-gradient-to-r from-blue-600/10 to-purple-600/10 px-4 py-1.5 rounded-full">
              Made with ❤️ in DRC
            </span>
          </div>
        </div>

        {/* Schema.org Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "http://schema.org",
              "@type": "Organization",
              name: "Independent Journalism Platform",
              url: "https://yourplatform.com",
              logo: "https://yourplatform.com/logo.png",
              foundingDate: "2023",
              founders: [
                {
                  "@type": "Person",
                  name: "Bwimba Mihandgo Dimer",
                },
              ],
              address: {
                "@type": "PostalAddress",
                addressRegion: "North Kivu",
                addressCountry: "DRC",
              },
              sameAs: [
                "https://twitter.com/yourplatform",
                "https://linkedin.com/company/yourplatform",
                "https://facebook.com/yourplatform",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                email: "contact@yourplatform.com",
                contactType: "customer service",
              },
            }),
          }}
        />
      </div>

    </footer>
  );
}