import { Metadata } from "next";
import {
  ShieldCheckIcon,
  DocumentTextIcon,
  BanknotesIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Content Guidelines | Independent Journalism Platform",
  description: "Our comprehensive guidelines for content creation, community standards, and monetization policies.",
  openGraph: {
    title: "Content Guidelines | Independent Journalism Platform",
    description: "Our comprehensive guidelines for content creation, community standards, and monetization policies.",
    url: "https://yourplatform.com/guidelines",
  },
};

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-blue-600 text-white">
        <div className="max-w-[1400px] mx-auto lg:px-60 md:px-20 px-10">
          <div className="relative py-24">
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-6">Platform Guidelines</h1>
              <p className="text-xl text-blue-100 max-w-2xl">
                Our guidelines ensure a high-quality, respectful, and rewarding
                environment for all creators and readers.
              </p>
            </div>
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto lg:px-60 md:px-20 px-10 py-16">
        <div className="space-y-16">
          {/* Content Quality Guidelines */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DocumentTextIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Content Quality Guidelines
              </h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Article Requirements
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <span className="text-blue-600 text-sm">1</span>
                    </div>
                    <span>Minimum 800 words for standard articles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <span className="text-blue-600 text-sm">2</span>
                    </div>
                    <span>Original content only - no plagiarism or AI-generated content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <span className="text-blue-600 text-sm">3</span>
                    </div>
                    <span>Proper formatting with headers, paragraphs, and citations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <span className="text-blue-600 text-sm">4</span>
                    </div>
                    <span>High-quality images with proper attribution</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Writing Style
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <span>Clear, concise, and engaging writing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <span>Proper grammar and punctuation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <span>Factual accuracy with reliable sources</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Monetization Guidelines */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <BanknotesIcon className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Monetization Guidelines
              </h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Eligibility Requirements
                  </h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                        <span className="text-green-600 text-sm">✓</span>
                      </div>
                      <span>Minimum 10,000 total article views</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                        <span className="text-green-600 text-sm">✓</span>
                      </div>
                      <span>At least 5 published articles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                        <span className="text-green-600 text-sm">✓</span>
                      </div>
                      <span>90-day account history</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                        <span className="text-green-600 text-sm">✓</span>
                      </div>
                      <span>No community guidelines violations</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Payment Information
                  </h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                        <span className="text-blue-600 text-sm">$</span>
                      </div>
                      <span>$0.30 per 1,000 views</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                        <span className="text-blue-600 text-sm">$</span>
                      </div>
                      <span>Monthly payments via PayPal</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                        <span className="text-blue-600 text-sm">$</span>
                      </div>
                      <span>$50 minimum payout threshold</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Community Guidelines */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <UserGroupIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Community Guidelines
              </h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Expected Behavior
                  </h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start gap-2">
                      <HandThumbUpIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Respectful communication in comments and discussions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <HandThumbUpIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Constructive feedback and meaningful engagement</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <HandThumbUpIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Support for fellow creators and readers</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Prohibited Content
                  </h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start gap-2">
                      <ExclamationTriangleIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span>Hate speech or discrimination</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ExclamationTriangleIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span>Harassment or bullying</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ExclamationTriangleIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span>Explicit or adult content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ExclamationTriangleIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span>Spam or misleading content</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Enforcement */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-100 rounded-lg">
                <ShieldCheckIcon className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Guideline Enforcement
              </h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="space-y-6">
                <p className="text-gray-600">
                  Violation of these guidelines may result in:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-medium text-red-800 mb-2">First Violation</h4>
                      <p className="text-sm text-red-600">Warning and content removal</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-medium text-red-800 mb-2">Second Violation</h4>
                      <p className="text-sm text-red-600">Temporary suspension (7 days)</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-medium text-red-800 mb-2">Third Violation</h4>
                      <p className="text-sm text-red-600">Account termination</p>
                    </div>
                  </div>
                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-3">Appeal Process</h4>
                    <p className="text-sm text-yellow-700 mb-4">
                      If you believe a violation was incorrectly assessed, you can appeal by:
                    </p>
                    <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-2">
                      <li>Contacting support within 7 days</li>
                      <li>Providing detailed explanation</li>
                      <li>Including relevant evidence</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 