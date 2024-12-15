import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yourplatform.com'

  const manifest = {
    name: "Independent Journalism Platform",
    short_name: "Journal",
    description: "A platform for independent journalism and quality content creation",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb", // Blue-600 from Tailwind
    orientation: "portrait-primary",
    scope: "/",
    id: "indie-journalism-platform",
    icons: [
      {
        src: `${baseUrl}/icons/icon-72x72.png`,
        sizes: "72x72",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: `${baseUrl}/icons/icon-96x96.png`,
        sizes: "96x96",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: `${baseUrl}/icons/icon-128x128.png`,
        sizes: "128x128",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: `${baseUrl}/icons/icon-144x144.png`,
        sizes: "144x144",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: `${baseUrl}/icons/icon-152x152.png`,
        sizes: "152x152",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: `${baseUrl}/icons/icon-192x192.png`,
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: `${baseUrl}/icons/icon-384x384.png`,
        sizes: "384x384",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: `${baseUrl}/icons/icon-512x512.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable"
      }
    ],
    shortcuts: [
      {
        name: "Latest Articles",
        short_name: "Latest",
        description: "View the latest articles",
        url: "/latest",
        icons: [{ src: `${baseUrl}/icons/latest-articles.png`, sizes: "96x96" }]
      },
      {
        name: "Categories",
        short_name: "Categories",
        description: "Browse content categories",
        url: "/categories",
        icons: [{ src: `${baseUrl}/icons/categories.png`, sizes: "96x96" }]
      }
    ],
    screenshots: [
      {
        src: `${baseUrl}/screenshots/home-light.png`,
        sizes: "1280x720",
        type: "image/png",
        label: "Homepage in light mode"
      },
      {
        src: `${baseUrl}/screenshots/article-light.png`,
        sizes: "1280x720",
        type: "image/png",
        label: "Article view in light mode"
      }
    ],
    categories: ["news", "magazines", "books"],
    prefer_related_applications: false,
    related_applications: [],
    features: [
      "Cross Platform",
      "Offline Support",
      "Push Notifications",
      "Content Sharing"
    ],
    share_target: {
      action: "/share-target",
      method: "GET",
      params: {
        title: "title",
        text: "text",
        url: "url"
      }
    },
    protocol_handlers: [
      {
        protocol: "web+indie",
        url: "/protocol?type=%s"
      }
    ],
    iarc_rating_id: "e84b072d-71b3-4d3e-86ae-31a8ce4e53b7",
    lang: "en-US",
    dir: "ltr"
  }

  return new NextResponse(JSON.stringify(manifest, null, 2), {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=3600',
    },
  })
} 