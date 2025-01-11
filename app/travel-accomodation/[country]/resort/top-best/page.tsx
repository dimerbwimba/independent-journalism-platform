import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { StarIcon, MapPinIcon, ChevronRightIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import CountryArticles from "@/components/CountryArticles";

interface Resort {
    name: string;
    url: string;
    images: { image: string }[];
    price: string;
    title: string;
    rating?: string;
    star?: string;
    location: string;
    things_to_do?: string[];
    about_this_place?: string;
}

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
    const { country } = await params;
    const formattedCountry = country.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, (l: string) => l.toUpperCase());
    const allResorts = await import(`@/data/${country.toLowerCase().replace("-", "_")}_data.json`);
    const data = allResorts[country.toLowerCase().replace(/-/g, "_")];
    const resorts = data.all_inclusive_resorts?.slice(0, 18) || [];
    return {
        title: `${resorts.length} Best Resorts in ${formattedCountry} | Ultimate Guide ${new Date().getFullYear()}`,
        description: `The top ${resorts.length} luxury resorts in ${formattedCountry}. From all-inclusive beachfront properties to boutique mountain retreats. Expert reviews and recommendations.`,
        keywords: [
            `best resorts in ${formattedCountry}`,
            `luxury hotels ${formattedCountry}`,
            `where to stay in ${formattedCountry}`,
            `${formattedCountry} accommodation guide`,
            `top rated resorts ${formattedCountry}`,
            'all inclusive resorts',
            'luxury accommodation',
            'beach resorts',
            'family resorts',
            'boutique hotels'
        ],
        openGraph: {
            title: `${resorts.length} Best Resorts in ${formattedCountry} | Ultimate Guide ${new Date().getFullYear()}`,
            description: `The top ${resorts.length} luxury resorts in ${formattedCountry}. From all-inclusive beachfront properties to boutique mountain retreats. Expert reviews and recommendations.`,
            images: [resorts[0]?.images[0]?.image],
        },
        twitter: {
            title: `${resorts.length} Best Resorts in ${formattedCountry} | Ultimate Guide ${new Date().getFullYear()}`,
            description: `The top ${resorts.length} luxury resorts in ${formattedCountry}. From all-inclusive beachfront properties to boutique mountain retreats. Expert reviews and recommendations.`,
            images: [resorts[0]?.images[0]?.image],
        },
        robots: {
            index: true,
            follow: true,
        },
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_URL}/travel-accomodation/${country.toLowerCase().replace("-", "_")}/resort/top-best`,
        },
    };
}

export default async function TopResortsPage({ params }: { params: Promise<{ country: string }> }) {
    const { country } = await params;

    try {
        const countryData = await import(`@/data/${country.toLowerCase().replace("-", "_")}_data.json`);
        const data = countryData[country.toLowerCase().replace(/-/g, "_")];
        const resorts = data.all_inclusive_resorts?.slice(0, 15) || [];

        if (!resorts.length) {
            notFound();
        }

        const formattedCountry = country.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, (l: string) => l.toUpperCase());

        return (
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <div className="bg-white border-b">
                    <div className="max-w-[1400px] mx-auto lg:px-80 md:px-20 px-10 py-16">
                        <div className="">
                            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                                {resorts.length} Best Resorts in {formattedCountry}: Ultimate Guide {new Date().getFullYear()}
                            </h1>
                            <p className="mt-4 text-lg text-gray-600">
                                The most luxurious and highly-rated resorts in {formattedCountry}. From beachfront paradises to mountain retreats, find your perfect stay.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-[1400px] mx-auto lg:px-80 md:px-20 px-10 py-16">
                    {/* Introduction */}
                    <div className="prose max-w-none mb-16">
                        <p className="text-xl leading-relaxed text-gray-700">
                            {formattedCountry} offers an incredible variety of world-class resorts, each providing unique experiences and unforgettable stays. Whether you&apos;re seeking a romantic getaway, family adventure, or luxury retreat, our carefully curated list of the top 15 resorts will help you find your perfect accommodation.
                        </p>
                    </div>
                    {/* Introduction */}


                    {/* Key Stats Section - WSJ Style */}
                    <div className="bg-white border border-gray-800 rounded-lg p-8 mb-16">
                        <h2 className="text-lg  mb-6 text-gray-900">The Numbers: {formattedCountry}&apos;s Luxury Resort Market</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="border-l-2 border-gray-800 pl-6">
                                <p className="text-4xl  font-bold text-gray-900">
                                    ${Math.round(data.all_inclusive_resorts.reduce((acc: number, resort: Resort) => {
                                        if (!resort.price) return acc;
                                        return acc + parseInt(resort.price.replace(/[^0-9]/g, '') || '0');
                                    }, 0) / data.all_inclusive_resorts.filter((r: Resort) => r.price).length)}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">Average nightly rate at luxury resorts</p>
                                <p className="text-xs text-gray-500 mt-2">Based on {data.all_inclusive_resorts.filter((r: Resort) => r.price).length} top resorts</p>
                            </div>
                            <div className="border-l-2 border-gray-800 pl-6">
                                <p className="text-4xl  font-bold text-gray-900">
                                    {(data.all_inclusive_resorts.filter((r: Resort) => r.rating).length / data.all_inclusive_resorts.length * 100).toFixed(0)}%
                                </p>
                                <p className="text-sm text-gray-600 mt-1">Resorts with exceptional ratings</p>
                                <p className="text-xs text-emerald-600 mt-2">Top-rated destination</p>
                            </div>
                            <div className="border-l-2 border-gray-800 pl-6">
                                <p className="text-4xl  font-bold text-gray-900">
                                    {(data.all_inclusive_resorts.reduce((acc: number, resort: Resort) =>
                                        acc + (resort.rating ? parseFloat(resort.rating) : 0),
                                        0) / data.all_inclusive_resorts.filter((r: Resort) => r.rating).length).toFixed(1)}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">Average guest rating</p>
                                <p className="text-xs text-gray-500 mt-2">Out of 5 stars</p>
                            </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div>
                                    <p className="text-2xl  font-bold text-gray-900">
                                        {(data.all_inclusive_resorts.filter((r: Resort) =>
                                            r.location.toLowerCase().includes('beach') ||
                                            r.location.toLowerCase().includes('costa')).length /
                                            data.all_inclusive_resorts.length * 100).toFixed(0)}%
                                    </p>
                                    <p className="text-sm text-gray-600">beachfront locations</p>
                                </div>
                                <div>
                                    <p className="text-2xl  font-bold text-gray-900">
                                        {data.all_inclusive_resorts.filter((r: Resort) =>
                                            parseFloat(r.star?.split(' ')[0] || '0') >= 4).length}
                                    </p>
                                    <p className="text-sm text-gray-600">4+ star resorts</p>
                                </div>
                                <div>
                                    <p className="text-2xl  font-bold text-gray-900">
                                        {Object.keys(data.region_hotels || {}).length}
                                    </p>
                                    <p className="text-sm text-gray-600">unique locations</p>
                                </div>
                                <div>
                                    <p className="text-2xl  font-bold text-gray-900">
                                        {data.all_inclusive_resorts.reduce((acc: number, resort: Resort) =>
                                            acc + (resort.things_to_do?.length || 0), 0)}
                                    </p>
                                    <p className="text-sm text-gray-600">activities available</p>
                                </div>
                            </div>
                        </div>
                        <p className="mt-6 text-xs text-gray-500">
                            Source: Analysis of 399 top resorts in {formattedCountry}, {new Date().getFullYear()}
                        </p>
                    </div>


                    {/* Resort List */}
                    <div className="space-y-24">
                        {resorts.map((resort: Resort, idx: number) => (
                            <article key={idx} className="prose max-w-none">
                                <h2 className="text-4xl  mb-8">
                                    {idx + 1}. {resort.title}
                                </h2>
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    {resort.images
                                        .filter(img => img && img.image) // Filter out empty images
                                        .slice(0, 4)
                                        .map((image, idx) => (
                                            <div key={idx} className="relative h-[300px]">
                                                <Image
                                                    src={image.image}
                                                    alt={`${resort.title} - Image ${idx + 1}`}
                                                    fill
                                                    className="object-cover rounded-lg"
                                                />

                                            </div>
                                        ))}
                                </div>

                                <div className="grid grid-cols-3 gap-8">
                                    <div className="col-span-2">

                                        <div className="mb-8">
                                            <p className="text-gray-700 leading-relaxed" itemProp="description">
                                                {resort.about_this_place}
                                            </p>
                                        </div>
                                        <p className="text-gray-800 leading-relaxed mb-8">
                                            {resort.title} stands as a testament to luxury hospitality in {resort.location}.
                                            The property masterfully combines elegant accommodations with world-class amenities,
                                            creating an atmosphere of refined comfort and sophistication. Guests can expect
                                            an exceptional level of service that has become synonymous with the resort&apos;s reputation
                                            for excellence.
                                        </p>
                                        <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm mb-6" aria-label="Resort details">
                                            {resort.star && (
                                                <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full" aria-label="Star rating">
                                                    <StarIcon className="h-4 w-4 text-yellow-400" aria-hidden="true" />
                                                    <span className="ml-1 font-medium">{resort.star}</span>
                                                </div>
                                            )}
                                            {resort.location && (
                                                <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full" aria-label="Location">
                                                    <MapPinIcon className="h-4 w-4 text-gray-500" aria-hidden="true" />
                                                    <span className="ml-1 font-medium" itemProp="address">{resort.location}</span>
                                                </div>
                                            )}
                                            {resort.rating && (
                                                <div className="flex items-center bg-green-50 px-3 py-1 rounded-full" aria-label="Guest rating">
                                                    <span className="font-medium text-green-600" itemProp="aggregateRating">
                                                        {resort.rating} / 5
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <Link
                                            href={`/travel-accomodation/${country}/resort/${resort.title
                                                .toLowerCase()
                                                .replace(/[^\w\s-]/g, '')
                                                .replace(/\s+/g, '-')
                                                .trim()}`}
                                            className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                                        >
                                            Read full review
                                            <ChevronRightIcon className="h-4 w-4 ml-1" />
                                        </Link>
                                    </div>

                                    <div className="border-l border-gray-200 pl-8">
                                        <div className="mb-6">
                                            <p className="text-sm text-gray-500">Starting from</p>
                                            <p className="text-3xl ">{resort.price}</p>
                                        </div>

                                        <div className="space-y-3 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                                <span>All-inclusive packages</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                                <span>Luxury amenities</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                                <span>Prime location</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                    <CountryArticles country={country} />
                    {/* Frequently Asked Questions */}
                    <div className="prose max-w-none mt-16">
                        <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions about {formattedCountry} Resorts</h2>
                        <div className="space-y-6">
                            <div className="border-b border-gray-200 pb-4">
                                <h3 className="text-lg font-semibold mb-2">What are the best resorts in {formattedCountry}?</h3>
                                <p>Our guide features the top 15 resorts in {formattedCountry}, each with unique amenities and experiences.</p>
                            </div>
                            <div className="border-b border-gray-200 pb-4">
                                <h3 className="text-lg font-semibold mb-2">How do I choose the right resort for my vacation?</h3>
                                <p>Consider location, amenities, budget, and guest reviews to find the best fit for your needs.</p>
                            </div>
                            <div className="border-b border-gray-200 pb-4">
                                <h3 className="text-lg font-semibold mb-2">What amenities should I look for in a resort?</h3>
                                <p>Look for pools, restaurants, spas, fitness centers, and family activities that suit your preferences.</p>
                            </div>
                            <div className="border-b border-gray-200 pb-4">
                                <h3 className="text-lg font-semibold mb-2">Are there all-inclusive resorts in {formattedCountry}?</h3>
                                <p>Yes, many resorts offer all-inclusive packages covering meals, drinks, and activities.</p>
                            </div>
                            <div className="border-b border-gray-200 pb-4">
                                <h3 className="text-lg font-semibold mb-2">What is the best time to visit {formattedCountry} for a resort vacation?</h3>
                                <p>The best time varies by region; peak seasons typically offer great weather but higher prices.</p>
                            </div>
                            <div className="border-b border-gray-200 pb-4">
                                <h3 className="text-lg font-semibold mb-2">How can I book a resort at the best price?</h3>
                                <p>Book during off-peak seasons, use price comparison sites, and look for special promotions.</p>
                            </div>
                            <div className="border-b border-gray-200 pb-4">
                                <h3 className="text-lg font-semibold mb-2">Do resorts in {formattedCountry} cater to families?</h3>
                                <p>Many resorts offer family-friendly amenities like kids clubs and recreational activities.</p>
                            </div>
                            <div className="border-b border-gray-200 pb-4">
                                <h3 className="text-lg font-semibold mb-2">What safety measures do resorts implement?</h3>
                                <p>Resorts prioritize safety with health guidelines, security personnel, and clean facilities.</p>
                            </div>
                            <div className="border-b border-gray-200 pb-4">
                                <h3 className="text-lg font-semibold mb-2">Can I find eco-friendly resorts in {formattedCountry}?</h3>
                                <p>Yes, many eco-friendly resorts focus on sustainability and conservation practices.</p>
                            </div>
                            <div className="border-b border-gray-200 pb-4">
                                <h3 className="text-lg font-semibold mb-2">What should I pack for a stay at a resort?</h3>
                                <p>Pack swimwear, sunscreen, casual and formal clothing, and any gear needed for activities.</p>
                            </div>
                        </div>
                    </div>
                    {/* Conclusion */}
                    <div className="prose max-w-none mt-16">
                        <h2 className="text-3xl font-bold mb-6">Final Thoughts</h2>
                        <p className="text-xl leading-relaxed text-gray-700">
                            {formattedCountry}&apos;s resorts offer something for every type of traveler. Whether you&apos;re looking for
                            an all-inclusive beachfront experience or a boutique mountain retreat, these top 15 resorts
                            represent the very best in luxury accommodation. Each property has been carefully selected based
                            on location, amenities, service quality, and guest reviews.
                        </p>
                    </div>

                    {/* FAQ Section */}
                  

                    {/* Schema.org Article Markup */}
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                "@context": "https://schema.org",
                                "@type": "Article",
                                headline: `15 Best Resorts in ${formattedCountry}: Ultimate Guide 2024`,
                                description: `Discover the top 15 luxury resorts in ${formattedCountry}. From all-inclusive beachfront properties to boutique mountain retreats.`,
                                image: resorts[0]?.images[0]?.image,
                                datePublished: new Date().toISOString(),
                                author: {
                                    "@type": "Organization",
                                    name: "Travel Wing"
                                },
                                publisher: {
                                    "@type": "Organization",
                                    name: "Travel Wing",
                                    logo: {
                                        "@type": "ImageObject",
                                        url: "/logo.png"
                                    }
                                }
                            })
                        }}
                    />
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error loading resort data:', error);
        notFound();
    }
} 