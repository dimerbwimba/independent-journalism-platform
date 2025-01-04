import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { ShieldCheckIcon } from "@heroicons/react/24/solid";
import { ArrowTrendingUpIcon } from "@heroicons/react/24/outline";
import AccommodationSection from '@/components/AccommodationSection';


// SEO Metadata
export const metadata: Metadata = {
  title: "Travel Stories & Adventures | Share Your Journey, Inspire Others",
  description: "Discover amazing travel stories from adventurers worldwide. Share your own journey, connect with fellow travelers, and inspire others with your unique experiences.",
  keywords: [
    "travel blog",
    "travel stories",
    "travel adventures",
    "travel community",
    "travel inspiration",
    "travel tips",
    "travel guides",
    "travel photography",
    "travel experiences",
    "world travel"
  ],
  authors: [{ name: "Bwimba Mihandgo Dimer" }],
  creator: "Bwimba Mihandgo Dimer",
  publisher: "Travel Stories & Adventures",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}`,
    siteName: "Travel Stories & Adventures",
    title: "Travel Stories & Adventures | Share Your Journey, Inspire Others",
    description: "Discover amazing travel stories from adventurers worldwide. Share your own journey, connect with fellow travelers, and inspire others with your unique experiences.",
    images: [
      {
        url: "/og-travel-image.jpg", // Add this image to your public folder
        width: 1200,
        height: 630,
        alt: "Travel Stories & Adventures",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Travel Stories & Adventures | Share Your Journey, Inspire Others",
    description: "Discover amazing travel stories from adventurers worldwide. Share your own journey, connect with fellow travelers, and inspire others with your unique experiences.",
    images: ["/og-travel-image.jpg"],
    creator: "@travelstories",
    site: "@travelstories",
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/apple-touch-icon-precomposed.png",
    },
  },
  manifest: "/site.webmanifest",
  other: {
    "msapplication-TileColor": "#2563eb",
    "theme-color": "#2563eb",
  },
};

async function getHomeData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/home`, {
      next: { revalidate: 60 },
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching home data:", error);
    return {
      categories: [],
      latestArticles: [],
      featuredArticle: null,
      popularArticles: [],
      popularCreators: [],
      risingCreators: [],
    };
  }
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  postCount: number;
}

interface Article {
  id: string;
  slug: string;
  title: string;
  description?: string;
  image?: string;
  author: {
    name: string;
    image?: string;
  };
  categories: {
    id: string;
    name: string;
    slug: string;
  }[];
  viewCount: number;
  reactionCount: number;
  commentCount: number;
}

interface Creator {
  id: string;
  name: string | null;
  image: string | null;
  role: string | null;
  topPost: {
    title: string;
    slug: string;
    _count: {
      views: number;
    };
  };
  weeklyViews: number;
}

interface RisingCreator {
  id: string;
  name: string | null;
  image: string | null;
  role: string | null;
  stats: {
    currentMonthViews: number;
    previousMonthViews: number;
    currentMonthReactions: number;
    previousMonthReactions: number;
    growthRate: number;
  };
}

export default async function HomePage() {
  const {
    categories,
    latestArticles,
    featuredArticle,
    popularArticles,
    popularCreators,
    risingCreators,
  } = await getHomeData();

  return (
    <main className="min-h-screen bg-gray-50">
       {/* Popular This Week Section */}
       <section className="pt-12 mt-5 bg-white">
        <div className="max-w-[1400px] mx-auto lg:px-60 md:px-20 px-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Popular This Week</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the most engaging content that&apos;s making waves this week
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 border-b-2 border-gray-800 pb-12">
            {popularArticles.map((article: Article) => (
              <article
                key={article.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-48">
                  {article.image ? (
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-200" />
                  )}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {article.viewCount} views
                    </span>
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {article.reactionCount} reactions
                    </span>
                  </div>
                </div>
                <div className="p-2">
                  {article.categories[0] && (
                    <span className="text-sm text-blue-600 font-semibold">
                      {article.categories[0].name}
                    </span>
                  )}
                  <Link href={`/article/${article.slug}`}>
                    <h3 className="text-xl font-bold line-clamp-2 mt-2 mb-3 hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>
                  </Link>
                  <p className="text-gray-600 line-clamp-2 mb-4">
                    {article.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
       {/* Featured Article */}
       {featuredArticle && (
        <section className="bg-white">
          <div className="max-w-[1400px] mx-auto lg:px-60 md:px-20 px-10">
            <div className="grid md:grid-cols-2 gap-12 border-b-2 border-gray-800 items-center py-12">
              <div>
                <span className="text-blue-600 font-semibold">FEATURED</span>
                <Link href={`/article/${featuredArticle.slug}`}>
                  <h1 className="text-4xl line-clamp-3 font-bold mt-2 mb-4 hover:text-blue-600 transition-colors">
                    {featuredArticle.title}
                  </h1>
                </Link>
                <p className="text-gray-600  line-clamp-3  text-lg mb-6">
                  {featuredArticle.description}
                </p>
              </div>
              <div className="relative h-[400px]">
                {featuredArticle.image && (
                  <Image
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      )}
       {/* Categories Section */}
       <section className=" pt-12 bg-gray-50">
        <div className="max-w-[1400px] mx-auto lg:px-60 md:px-20 px-10">
          <div className="text-center  mb-12">
            <h2 className="text-3xl font-bold mb-4">Explore Categories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Dive deep into your favorite topics. From cutting-edge technology
              to business strategies, we&apos;ve got you covered with expert insights
              and analysis.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 border-b-2 border-gray-800 pb-12">
            {categories.map((category: Category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group block"
              >
                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative h-48">
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gray-200" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold mb-1">
                        {category.name}
                      </h3>
                      <span className="text-sm opacity-90">
                        {category.postCount} articles
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {/* Popular Creators Section */}
      <section className="pt-12 bg-gray-50">
        <div className="max-w-[1400px] mx-auto lg:px-60 md:px-20 px-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Popular Creators</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Meet our top content creators of the week
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 border-b-2 border-gray-800 pb-12">
            {popularCreators.map((creator: Creator) => (
              <div
                key={creator.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    {creator.image ? (
                      <Image
                        src={creator.image}
                        alt={creator.name || ""}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 font-medium text-lg">
                          {creator.name?.[0]?.toUpperCase()}
                        </span>
                      </div>
                    )}
                    {creator.role === "admin" && (
                      <div className="absolute -top-1 -right-1">
                        <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
                      </div>
                    )}
                  </div>
                  <div>
                    <Link href={`/authors/${creator.id}`}>
                      <h3 className="font-medium text-gray-900">
                        {creator.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500">
                      {creator.weeklyViews.toLocaleString()} views this week
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-2">Top Article</p>
                  <Link
                    href={`/article/${creator.topPost.slug}`}
                    className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
                  >
                    {creator.topPost.title}
                  </Link>
                  <p className="text-sm text-gray-500 mt-2">
                    {creator.topPost._count.views.toLocaleString()} views
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rising Stars Section */}
      <section className="py-12 bg-white">
        <div className="max-w-[1400px] mx-auto lg:px-60 md:px-20 px-10">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-semibold tracking-wider text-sm uppercase">
              Trending Creators
            </span>
            <h2 className="text-3xl font-bold mb-4 mt-2">Rising Stars</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Meet our fastest-growing creators making waves this month
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {risingCreators?.map((creator: RisingCreator) => (
              <div
                key={creator.id}
                className="group bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 border border-blue-100 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    {creator.image ? (
                      <Image
                        src={creator.image}
                        alt={creator.name || ""}
                        width={64}
                        height={64}
                        className="rounded-full ring-4 ring-white shadow-md group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center ring-4 ring-white shadow-md">
                        <span className="text-gray-500 font-medium text-xl">
                          {creator.name?.[0]?.toUpperCase()}
                        </span>
                      </div>
                    )}
                    {creator.role === "admin" && (
                      <div className="absolute -top-1 -right-1">
                        <ShieldCheckIcon className="w-5 h-5 text-blue-600 drop-shadow-sm" />
                      </div>
                    )}
                  </div>
                  <div>
                    <Link href={`/authors/${creator.id}`}>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                          {creator.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 rounded-full">
                            <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-700">
                              {creator.stats.growthRate.toFixed(1)}%
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            this month
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/60 rounded-lg p-4 backdrop-blur-sm group-hover:bg-white/80 transition-colors">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Monthly Stats
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-semibold text-gray-900">
                            {creator.stats.currentMonthViews.toLocaleString()}
                          </span>
                          {creator.stats.previousMonthViews > 0 && (
                            <span className="text-xs text-green-600">
                              +
                              {(
                                ((creator.stats.currentMonthViews -
                                  creator.stats.previousMonthViews) /
                                  creator.stats.previousMonthViews) *
                                100
                              ).toFixed(0)}
                              %
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">Views</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">
                          vs. last month
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-semibold text-gray-900">
                            {creator.stats.currentMonthReactions.toLocaleString()}
                          </span>
                          {creator.stats.previousMonthReactions > 0 && (
                            <span className="text-xs text-green-600">
                              +
                              {(
                                ((creator.stats.currentMonthReactions -
                                  creator.stats.previousMonthReactions) /
                                  creator.stats.previousMonthReactions) *
                                100
                              ).toFixed(0)}
                              %
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">Reactions</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

     

      {/* Latest Articles Grid */}
      <section className="">
        <div className="max-w-[1400px] mx-auto lg:px-60 md:px-20 px-10">
          <h2 className="text-2xl font-bold mb-8">Latest Stories</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 border-b-2 border-gray-800 pb-12">
            {latestArticles.map((article: Article) => (
              <article
                key={article.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-48">
                  {article.image ? (
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-200" />
                  )}
                </div>
                <div className="p-6">
                  {article.categories[0] && (
                    <span className="text-sm text-blue-600 font-semibold">
                      {article.categories[0].name}
                    </span>
                  )}
                  <Link href={`/article/${article.slug}`}>
                    <h3 className="text-xl font-bold line-clamp-2 mt-2 mb-3 hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>
                  </Link>
                  <p className="text-gray-600 line-clamp-2 mb-4">
                    {article.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
 {/* Add the accommodation section */}
 <AccommodationSection />
      {/* Add this before closing main tag */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Travel Wing",
            url: "https://travelwing.com",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: "https://travelwing.com/search?q={search_term_string}",
              },
              "query-input": "required name=search_term_string",
            },
            sameAs: [
              "https://twitter.com/travelwing",
              "https://linkedin.com/company/travelwing",
              "https://facebook.com/travelwing",
            ],
            publisher: {
              "@type": "Organization",
              name: "Travel Wing",
              logo: {
                "@type": "ImageObject",
                url: "https://travelwing.com/logo.png",
              },
              founder: {
                "@type": "Person",
                name: "Bwimba Mihandgo Dimer",
                jobTitle: "Founder & CEO",
                address: {
                  "@type": "PostalAddress",
                  addressRegion: "North Kivu",
                  addressCountry: "DRC",
                },
              },
            },
            about: {
              "@type": "Thing",
              description: "Travel Wing is a travel blog that shares travel stories, tips, and guides from around the world.",
            },
            offers: {
              "@type": "Offer",
              description: "Monetization program for content creators",
              price: "0.30",
              priceCurrency: "USD",
              priceSpecification: {
                "@type": "UnitPriceSpecification",
                price: "0.30",
                priceCurrency: "USD",
                unitText: "per 1,000 views",
              },
            },
          }),
        }}
      />

     
    </main>
  );
}
