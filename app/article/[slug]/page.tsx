import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { marked } from "marked";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/options"
import CommentSection from "@/components/CommentSection";
import PostReactions from "@/components/PostReactions";
import ViewCounter from "@/components/ViewCounter";
import NewsletterForm from "@/components/NewsletterForm";
import ReportArticleButton from '@/components/article/ReportArticleButton'
import SaveArticleButton from "@/components/article/SaveArticleButton";
import ArticleFAQs from '@/components/article/ArticleFAQs'

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Author {
  id: string;
  name: string;
  image?: string;
}

interface RelatedPost {
  id: string;
  slug: string;
  title: string;
  description?: string;
  image?: string;
  author: Author;
  categories: Category[];
}
interface FAQ {
  id: string;
  question: string;
  answer: string;
}
interface Post {
  id: string;
  title: string;
  seoTitle: string;
  description: string;
  slug: string;
  content: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  author: Author;
  comments: number;
  categories: Category[];
  relatedPosts: RelatedPost[];
  reactions: Record<string, number>;
  shares: Record<string, number>;
  viewCount: number;
  saved: boolean;
  faqs: FAQ[];
}

async function getArticle(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/articles/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error("Failed to fetch article");
    }

    const data = await res.json();
    return data.post as Post;
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
}

// Generate Metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug);

  if (!article) {
    return {
      title: "Article Not Found",
      description: "The requested article could not be found.",
    };
  }

  const authorName = article.author?.name || "Anonymous";
  const categories =
    article.categories?.map((c) => c.name).join(", ") || "General";

  return {
    title: `${article.seoTitle} `,
    description:
      article.description ||
      `Read ${article.title} by ${authorName}. Discover quality content about ${categories} on our travel blog.`,
    keywords: [
      ...(article.categories?.map((c) => c?.name?.toLowerCase()) || []),
      "travel blog",
      "expert insights",
      authorName.toLowerCase(),
      "quality content",
      "independent writers",
    ],
    authors: [{ name: authorName }],
    openGraph: {
      title: article.title,
      description:
        article.description || `Read ${article.title} by ${authorName}`,
      type: "article",
      url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/article/${article.slug}`,
      images: [
        {
          url: article.image || "/default-article-og.jpg",
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      publishedTime: article.createdAt,
      authors: [authorName],
      tags: article.categories?.map((c) => c.name) || [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description:
        article.description || `Read ${article.title} by ${authorName}`,
      images: [article.image || "/default-article-og.jpg"],
      creator: "@yourplatform",
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/article/${article.slug}`,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const session = await getServerSession(authOptions);
  const post = await getArticle(slug);

  if (!post) {
    notFound();
  }

  // Convert markdown to HTML
  const contentHtml = marked(post.content);

  return (
    <article className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="w-full bg-gray-100 hero-section">
        <div className="max-w-[1400px] mx-auto lg:px-80 md:px-20 px-10 py-12">
          <div className="max-w-3xl mx-auto ">
            {post.categories[0] && (
              <Link
                href={`/categories/${post.categories[0].slug}`}
                className="text-blue-600 font-semibold text-sm uppercase tracking-wider"
              >
                {post.categories[0].name}
              </Link>
            )}
            <h1 className="mt-4 text-4xl font-bold text-gray-900 sm:text-5xl">
              {post.title}
            </h1>
            {post.description && (
              <p className="mt-4 text-lg text-gray-600">{post.description}
              </p>

            )}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 items-center justify-start gap-6">
              <div className="flex items-center">
                {post.author.image ? (
                  <Image
                    src={post.author.image}
                    alt={post.author.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200" />
                )}
                <Link href={`/authors/${post.author.id}`}>
                  <div className="ml-3 text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {post.author.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </Link>
              </div>
              <ViewCounter postId={post.id} initialCount={post.viewCount} />
              <SaveArticleButton postId={post.id} initialSaved={post.saved} />
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-[1400px] mx-auto lg:px-80 md:px-20 px-10">
        {/* Sticky Reactions - Desktop */}
        <div className="absolute left-56 top-8 hidden lg:block">
          <div className="fixed top-24 z-10">
            <PostReactions
              postId={post.id}
              currentUser={session?.user}
              initialReactions={post.reactions}
              variant="desktop"
              description={post.description ?? ""}
              shares={{
                facebook: post.shares?.facebook ?? 0,
                twitter: post.shares?.twitter ?? 0,
                linkedin: post.shares?.linkedin ?? 0,
                whatsapp: post.shares?.whatsapp ?? 0,
              }}
            />
          </div>
        </div>

        {/* Mobile Reactions - Fixed at bottom */}
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-gray-100 px-4 py-2">
          <PostReactions
            postId={post.id}
            currentUser={session?.user}
            initialReactions={post.reactions}
            variant="mobile"
            description={post.description ?? ""}
            shares={{
              facebook: post.shares?.facebook ?? 0,
              twitter: post.shares?.twitter ?? 0,
              linkedin: post.shares?.linkedin ?? 0,
              whatsapp: post.shares?.whatsapp ?? 0,
            }}
          />
        </div>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto pb-16 lg:pb-0">
          {/* Featured Image */}
          {post.image && (
            <div className="py-8">
              <div className="relative aspect-[2/1] w-full overflow-hidden rounded-xl">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}
          <NewsletterForm variant="inline" />
          {/* Article Content */}
          <div className="py-12">
            <article
              className="prose prose-lg max-w-none
                prose-headings:text-gray-900 
                prose-h1:text-4xl prose-h1:font-bold prose-h1:mb-8
                prose-h2:text-3xl prose-h2:font-bold prose-h2:mb-6
                prose-h3:text-2xl prose-h3:font-bold prose-h3:mb-4
                prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                prose-blockquote:border-l-4 prose-blockquote:border-blue-500 
                prose-blockquote:pl-4 prose-blockquote:italic
                prose-ul:list-disc prose-ul:pl-6
                prose-ol:list-decimal prose-ol:pl-6
                prose-li:text-gray-600 prose-li:mb-2
                prose-img:rounded-lg prose-img:my-8
                prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-2 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-gray-800 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg
                prose-strong:font-bold prose-strong:text-gray-900
                prose-em:italic
              "
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          </div>
            <ArticleFAQs faqs={post.faqs} />
        </div>
      </div>

      <div
        id="comments"
        className="max-w-[1400px] mx-auto lg:px-96 md:px-20 px-10 py-4 border-t border-gray-100"
      >
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center">
            {/* Categories */}
            {post.categories?.length > 0 && (
              <div className=" py-4">
                <div className="max-w-3xl mx-auto">
                  <div className="flex flex-wrap gap-2">
                    {post.categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/categories/${cat.slug}`}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <ReportArticleButton postId={post.id} />
          </div>
          {/* Comments Section */}
          <CommentSection postId={post.id} currentUser={session?.user} />
        </div>
      </div>

      {/* Related Articles */}
      {post.relatedPosts?.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-[1400px] mx-auto lg:px-60 md:px-20 px-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Related Articles
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {post.relatedPosts.map((article) => (
                <Link
                  key={article.id}
                  href={`/article/${article.slug}`}
                  className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="relative h-48">
                    {article.image ? (
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-50" />
                    )}
                  </div>

                  <div className="p-6">
                    {article.categories[0] && (
                      <span className="text-sm text-blue-600 font-semibold">
                        {article.categories[0].name}
                      </span>
                    )}

                    <h3 className="mt-2 text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>

                    {article.description && (
                      <p className="mt-2 text-gray-600 line-clamp-2">
                        {article.description}
                      </p>
                    )}

                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <div className="flex items-center">
                        {article.author.image ? (
                          <Image
                            src={article.author.image}
                            alt={article.author.name}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gray-200" />
                        )}
                        <span className="ml-2">{article.author.name}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Add Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.description,
            image: post.image || "/default-article-og.jpg",
            datePublished: post.createdAt,
            dateModified: post.updatedAt || post.createdAt,
            author: {
              "@type": "Person",
              name: post.author.name,
              image: post.author.image,
            },
            publisher: {
              "@type": "Organization",
              name: "Independent Journalism Platform",
              logo: {
                "@type": "ImageObject",
                url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/logo.png`,
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/article/${post.slug}`,
            },
            articleSection: post.categories?.[0]?.name || "General",
            keywords: post.categories?.map((c) => c.name).join(", "),
            interactionStatistic: [
              {
                "@type": "InteractionCounter",
                interactionType: "https://schema.org/ReadAction",
                userInteractionCount: post.viewCount,
              },
              {
                "@type": "InteractionCounter",
                interactionType: "https://schema.org/LikeAction",
                userInteractionCount:
                  post.reactions.like +
                  post.reactions.love +
                  post.reactions.wow +
                  post.reactions.sad +
                  post.reactions.angry,
              },
              {
                "@type": "InteractionCounter",
                interactionType: "https://schema.org/CommentAction",
                userInteractionCount: post.comments,
              },
            ],
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}`,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: post.categories?.[0]?.name || "Articles",
                  item: post.categories?.[0]?.slug
                    ? `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/categories/${post.categories[0].slug}`
                    : `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/`,
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: post.title,
                  item: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/article/${post.slug}`,
                },
              ],
            },
            mainEntity: {
              "@type": "FAQPage",
              mainEntity: post.faqs.map(faq => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer
                }
              }))
            }
          }),
        }}
      />

    </article>
  );
}
