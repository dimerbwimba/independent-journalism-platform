import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/options"
import ContactForm from "@/components/ContactForm";
import {
  EnvelopeIcon,
  GlobeAltIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Contact Us | Independent Travel Blog",
  description: "Get in touch with our team. We're here to help with any questions about our platform, content creation, or monetization program.",
  keywords: [
    "contact us",
    "get in touch",
    "support",
    "help",
    "content creation",
    "monetization",
    "technical support",
    "partnership",
    "travel blog"
  ],
  authors: [{ name: "Bwimba Mihandgo Dimer" }],
  creator: "Bwimba Mihandgo Dimer", 
  publisher: "Independent Travel Blog",
  openGraph: {
    title: "Contact Us | Independent Travel Blog",
    description: "Get in touch with our team. We're here to help with any questions about our platform, content creation, or monetization program.",
    url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/contact`,
    siteName: "Independent Travel Blog",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/contact-og.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Us - Independent Travel Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Independent Travel Blog", 
    description: "Get in touch with our team. We're here to help with any questions.",
    images: ["/contact-og.jpg"],
    creator: "@travelwing",
    site: "@travelwing",
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/contact`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const contactInfo = [
  {
    icon: EnvelopeIcon,
    title: "Email",
    details: "next191996@gmail.com",
    description: "Our team typically responds within 24 hours",
    action: "Send email",
    href: "mailto:next191996@gmail.com",
  },
  {
    icon: GlobeAltIcon,
    title: "Social Media",
    details: "@yourplatform",
    description: "Follow us for updates",
    action: "Follow us",
    href: "https://twitter.com/travelwing",
  },
];

const inquiryTypes = [
  {
    id: "content-creation",
    label: "Content Creation",
    description: "Questions about writing and publishing articles",
  },
  {
    id: "monetization",
    label: "Monetization Program",
    description: "Information about earning from your content",
  },
  {
    id: "technical",
    label: "Technical Support",
    description: "Help with platform features and issues",
  },
  {
    id: "partnership",
    label: "Partnership Inquiries",
    description: "Collaboration and business opportunities",
  },
  {
    id: "other",
    label: "Other",
    description: "General questions and feedback",
  },
];

export default async function ContactPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen   bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-blue-600 text-white">
        <div className="max-w-[1400px] mx-auto lg:px-60 md:px-20 px-10">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 mix-blend-multiply" />
          </div>
          <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Get in Touch
            </h1>
            <p className="mt-6 max-w-3xl text-xl text-blue-100">
              Have questions? We&apos;re here to help. Reach out to our team for support,
              feedback, or partnership opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Cards */}
      <div className="max-w-[1400px] mx-auto py-12 lg:px-60 md:px-20 px-10">
        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-2">
          {contactInfo.map((item) => (
            <div
              key={item.title}
              className="relative group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-600/20 rounded-lg blur-lg group-hover:bg-blue-600/30 transition-colors" />
                    <div className="relative h-12 w-12 flex items-center justify-center rounded-lg bg-blue-600/10 group-hover:bg-blue-600/20 transition-colors">
                      <item.icon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-lg font-medium text-gray-900">
                  {item.details}
                </div>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {item.action}
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form Section */}
      {session ? (
        <div className="max-w-[1400px] mx-auto py-12 lg:px-60 md:px-20 px-10">
          <div className="relative bg-white shadow-xl rounded-2xl">
            <h2 className="sr-only">Contact us</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3">
              {/* Contact information */}
              <div className="relative overflow-hidden rounded-l-2xl py-10 px-6 bg-gradient-to-b from-blue-600 to-blue-800 sm:px-10 xl:p-12">
                <div className="absolute inset-0 pointer-events-none sm:hidden" aria-hidden="true">
                  <svg
                    className="absolute inset-0 w-full h-full"
                    width={343}
                    height={388}
                    viewBox="0 0 343 388"
                    fill="none"
                    preserveAspectRatio="xMidYMid slice"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M-99 461.107L608.107-246l707.103 707.107-707.103 707.103L-99 461.107z"
                      fill="url(#linear1)"
                      fillOpacity=".1"
                    />
                    <defs>
                      <linearGradient
                        id="linear1"
                        x1="254.553"
                        y1="107.554"
                        x2="961.66"
                        y2="814.66"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#fff" />
                        <stop offset={1} stopColor="#fff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div
                  className="hidden absolute top-0 right-0 bottom-0 w-1/2 pointer-events-none sm:block lg:hidden"
                  aria-hidden="true"
                >
                  <svg
                    className="absolute inset-0 w-full h-full"
                    width={359}
                    height={339}
                    viewBox="0 0 359 339"
                    fill="none"
                    preserveAspectRatio="xMidYMid slice"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M-161 382.107L546.107-325l707.103 707.107-707.103 707.103L-161 382.107z"
                      fill="url(#linear2)"
                      fillOpacity=".1"
                    />
                    <defs>
                      <linearGradient
                        id="linear2"
                        x1="192.553"
                        y1="28.553"
                        x2="899.66"
                        y2="735.66"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#fff" />
                        <stop offset={1} stopColor="#fff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white">Send us a message</h3>
                <p className="mt-6 text-base text-blue-50 max-w-3xl">
                  Have something specific to discuss? Fill out this form and we&apos;ll
                  get back to you as soon as possible.
                </p>
                <dl className="mt-8 space-y-6">
                  <dt>
                    <span className="sr-only">Email</span>
                  </dt>
                 
                </dl>
              </div>

              {/* Contact form */}
              <div className="py-10 px-6 sm:px-10 lg:col-span-2 xl:p-12">
                <ContactForm inquiryTypes={inquiryTypes} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl  mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
            <div className="flex flex-col space-y-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h2 className="text-lg font-semibold text-yellow-800">Sign in Required</h2>
                  <p className="text-sm text-yellow-700 mt-1">
                    Please{" "}
                    <a href="/auth/signin" className="font-medium underline text-yellow-700 hover:text-yellow-600">
                      sign in
                    </a>{" "}
                    to access our contact form.
                  </p>
                </div>
              </div>

              <div className="prose prose-yellow max-w-none">
                <h3 className="text-yellow-800 font-medium">Why Sign In?</h3>
                <ul className="text-sm text-yellow-700 list-disc pl-5 space-y-2">
                  <li>Submit inquiries about content creation and publishing</li>
                  <li>Get detailed information about our monetization program</li>
                  <li>Learn about earning opportunities through your content</li>
                  <li>Receive personalized support from our team</li>
                  <li>Track and manage your support requests</li>
                </ul>

                <p className="text-sm text-yellow-700 mt-4">
                  Our support team is ready to assist you with:
                </p>
                <ul className="text-sm text-yellow-700 list-disc pl-5 space-y-2">
                  <li>Content creation guidelines and best practices</li>
                  <li>Monetization program details and eligibility</li>
                  <li>Payment processes and revenue sharing</li>
                  <li>Technical support and platform features</li>
                  <li>Partnership opportunities and collaborations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 