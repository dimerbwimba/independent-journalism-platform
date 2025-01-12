import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { StarIcon, MapPinIcon, CheckCircleIcon, ChevronRightIcon, PhoneIcon, GlobeAltIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

interface Resort {
    name: string;
    url: string;
    images: {
        image: string;
    }[];
    price: string;
    price_url: string;
    price_detail?: string;
    title: string;
    rating?: string;
    star?: string;
    location: string;
    phone_number?: string;
    website?: string;
    website_url?: string;
    featured_options: {
        name: string;
        url: string;
        price?: string;
        price_url?: string;
        member_rating?: string;
        member_rating_url?: string;
    }[];
    things_to_do: {
        name: string;
        url?: string;
        visite_site?: string;
        visite_site_url?: string;
        single_review?: string;
        single_review_author_photo?: string;
    }[];
    nearby_places: {
        name: string;
        url: string;
        offerings?: string;
        offerings_url?: string;
        distance_from_this_resort: string;
        distance_from_this_resort_url: string;
        image?: string;
        image_url?: string;
        rating?: string;
        rating_url?: string;
        number_of_reviews?: string;
        number_of_reviews_url?: string;
    }[];
}

export async function generateMetadata({ params }: { params: Promise<{ country: string, name: string }> }): Promise<Metadata> {
    const { country, name } = await params;

    try {
        const countryData = await import(`@/data/${country.toLowerCase().replace("-", "_")}_data.json`);
        const data = countryData[country.toLowerCase().replace(/-/g, "_")];

        const resort = data.all_inclusive_resorts?.find((r: Resort) =>
            r.title.toLowerCase().replace(/\s+/g, '-') === name
        );

        if (!resort) {
            return {
                title: 'Resort Not Found',
                description: 'The requested resort could not be found'
            };
        }

        const formattedCountry = country.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, l => l.toUpperCase());

        return {
            title: `${resort.title} | All inclusive ${resort.star} Resort in ${formattedCountry}`,
            description: `Experience luxury at ${resort.title}, a ${resort.star} resort in ${formattedCountry}. Enjoy all-inclusive packages, stunning views, and world-class amenities. Book your stay today!`,
            keywords: [
                `${resort.title}`,
                `${formattedCountry} resorts`,
                `${formattedCountry} all inclusive`,
                `luxury resorts ${formattedCountry}`,
                `${resort.star} resort`,
                'beach resort',
                'all inclusive resort',
                'luxury accommodation',
                'family resort',
                'beach vacation'
            ],
            authors: [{ name: "Travel Wing" }],
            
            creator: "Travel Wing",
            publisher: "Travel Wing",
            openGraph: {
                type: "website",
                locale: "en_US",
                url: `${process.env.NEXT_PUBLIC_APP_URL}/travel/${country}/resort/${name}`,
                siteName: "Travel Wing",
                title: `${resort.title} - Luxury Resort in ${formattedCountry}`,
                description: `Discover ${resort.title}, a ${resort.star} resort in ${formattedCountry}. Book your all-inclusive stay now!`,
                images: [
                    {
                        url: resort.images[0].image,
                        width: 1200,
                        height: 630,
                        alt: resort.title,
                    }
                ],
            },
            twitter: {
                card: "summary_large_image",
                title: `${resort.title} - Luxury Resort in ${formattedCountry}`,
                description: `Experience luxury at ${resort.title}, a ${resort.star} resort in ${formattedCountry}`,
                images: [resort.images[0].image],
                creator: "@travelwing",
                site: "@travelwing",
            },
            alternates: {
                canonical: `${process.env.NEXT_PUBLIC_APP_URL}/travel/${country}/resort/${name}`,
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
                google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
            },
            other: {
                "og:price:amount": resort.price,
                "og:price:currency": "USD",
                "og:availability": "instock",
                "og:priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                "og:brand": resort.title,
                "og:rating": resort.rating,
                "og:rating_scale": "5",
            },
        };
    } catch  {
        return {
            title: 'Error',
            description: 'Error loading resort data'
        };
    }
}

export default async function ResortPage({ params }: { params: Promise<{ country: string, name: string }> }) {
    const { country, name } = await params;

    try {
        // 1. Import data correctly
        const countryData = await import(`@/data/${country.toLowerCase().replace("-", "_")}_data.json`);

        // 2. Access the data using the correct key structure
        const data = countryData[country.toLowerCase().replace(/-/g, "_")];

        // 4. Find resort using name property
        const resort = data.all_inclusive_resorts?.find((r: Resort) =>
            r.title.toLowerCase().replace(/\s+/g, '-') === name
        );

        if (!resort) {
            notFound();
        }

        return (
            <div className="min-h-screen bg-gray-50">

                <div className="bg-white border-b">
                    <div className="max-w-[1400px] mx-auto lg:px-60 md:px-20 px-10 py-16">
                        <div className="">
                            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                                {resort.title}: Luxury All-Inclusive Resort in {country.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, l => l.toUpperCase())} | {resort.star} Experience
                            </h1>
                            <p className="mt-4 text-lg text-gray-600 mx-auto">
                                Experience luxury at {resort.title}, a {resort.star} all-inclusive resort in {country.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, l => l.toUpperCase())}. Enjoy world-class amenities, gourmet dining, and stunning ocean views. Book your dream vacation today!
                            </p>
                        </div>
                    </div>
                </div>
                {/* Main Content */}
                <div className="max-w-[1400px] mx-auto lg:px-60 md:px-20 px-10 py-16">
                    {/* Hero Section with Gallery */}
                     {/* Breadcrumb */}
                     <div className="bg-white rounded-lg border border-gray-800 px-10 mb-8">
                        <div className="max-w-[1400px] mx-auto  py-4">
                            <nav className="flex" aria-label="Breadcrumb">
                                <ol className="flex items-center space-x-2">
                                    <li>
                                        <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
                                    </li>
                                    <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                                    <li>
                                        <Link href={`/travel/${country}`} className="text-gray-500 hover:text-gray-700">
                                            {country.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, l => l.toUpperCase())}
                                        </Link>
                                    </li>
                                    <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                                    <li className="text-gray-900 font-medium">{resort.title}</li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                    <div className="bg-white  rounded-lg border border-gray-800 overflow-hidden mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
                            {/* Main Large Image */}
                            <div className="relative h-[600px] md:h-[500px] col-span-1">
                                <Image
                                    src={resort.images[0].image}
                                    alt={resort.title}
                                    fill
                                    className="object-cover rounded-lg"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg" />
                                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                                    <h2 className="text-4xl font-bold mb-2">{resort.title}</h2>
                                    <div className="flex items-center space-x-4">
                                        {resort.star && (
                                            <div className="flex items-center">
                                                <StarIcon className="h-5 w-5 text-yellow-400" />
                                                <span className="ml-1">{resort.star}</span>
                                            </div>
                                        )}
                                        {resort.rating && (
                                            <div className="flex items-center">
                                                <StarIcon className="h-5 w-5 text-yellow-400" />
                                                <span className="ml-1">{resort.rating} rating</span>
                                            </div>
                                        )}

                                    </div>
                                </div>
                            </div>

                            {/* Side Gallery Grid */}
                            <div className="grid grid-cols-2 gap-2">
                                {resort.images && resort.images.length > 1 && resort.images
                                    .slice(1)
                                    .filter((img: { image: string }) => img && img.image)
                                    .map((image: { image: string }, idx: number) => (
                                        <div key={idx} className="relative h-[245px]">
                                            <Image
                                                src={image.image}
                                                alt={`${resort.title} view ${idx + 2}`}
                                                fill
                                                className="object-cover rounded-lg hover:opacity-90 transition-opacity"
                                            />
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                   
                    {/* Booking Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        {/* Booking Options Section */}
                        <div className="bg-white rounded-xl border border-gray-800 hover:shadow-xl transition-shadow duration-300 p-8">
                            <div className="flex flex-col h-full justify-center">
                                <div className="">

                                    {(resort.featured_options && resort.featured_options.length > 0) ?
                                        resort.featured_options
                                            .slice(0, 3)
                                            .map((option: { url: string, name: string }, idx: number) => (
                                                <div key={idx} className="mb-4">
                                                    <div className="relative">
                                                        <a
                                                            href={option.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="w-full inline-flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all duration-200 shadow-md hover:shadow-lg"
                                                        >
                                                            <span>Book on {option.name}</span>
                                                            <span className="text-lg font-bold text-white">
                                                                ${(parseInt(resort.price.replace('$', '')) + (idx * 20)).toString()}
                                                            </span>
                                                        </a>
                                                    </div>
                                                </div>
                                            )) : (
                                            <div className="mb-4">
                                                <div className="relative">

                                                    <div className="mb-4">

                                                        {[

                                                            {
                                                                url: "https://www.booking.com/hotel/cr/barcelo-tambor.en-gb.html?aid=356985;label=gog235jc-1FCAEoggI46AdIM1gEaH2IAQGYASG4ARfIAQzYAQHoAQH4AQGoAgM;sid=711111111111111111111111111111;dist=0;group_adults=2;group_children=0;hapos=1;hpos=1;no_rooms=1;room1=A%2CA;sb_price_type=total;sr_order=popularity;sr_pri_type=total;ss=Barcelo%20Tambor%20Resort%20%26%20Spa%20%28All%20Inclusive%29;srepoch=1720367200;st_rooms=1;st_room_count=1;type=total;ucfs=1&",
                                                                name: "Booking.com",
                                                                price: "20% off"
                                                            },
                                                            {
                                                                url: "https://www.expedia.com/Hotel-Search?adults=2&children=0&checkIn=2025-01-10&destination=CR-Puntarenas&endDate=2025-01-17&isBundleOrAllIncluded=false&rooms=1&selectedRoomType=1&sort=RECOMMENDED&startDate=2025-01-10&theme=standard&useRewards=false&userIntent=true&userLegacy=false&selectedDay=2025-01-10&selectedMonth=1&selectedYear=2025",
                                                                name: "Expedia",
                                                                price: "25% off"
                                                            },
                                                            {
                                                                url: "https://www.hotels.com/search?destination=Costa%20Rica&startDate=2025-01-10&endDate=2025-01-17&rooms=1&adults=2&children=0",
                                                                name: "Hotels.com",
                                                                price: "30% off"
                                                            }


                                                        ].map((option: { url: string, name: string, price: string }, idx: number) => (
                                                            <a
                                                                href={option.url}
                                                                key={idx}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="w-full mb-4 inline-flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all duration-200 shadow-md hover:shadow-lg"
                                                            >
                                                                <span>Book on {option.name}</span>
                                                                <span className="text-lg font-bold text-white">
                                                                    {option.price}
                                                                </span>
                                                            </a>
                                                        ))}
                                                    </div>

                                                </div>
                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>
                        {/* Pricing Section */}
                        <div className="bg-white rounded-xl border border-gray-800 hover:shadow-xl transition-shadow duration-300 p-8">
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">Special Offer</p>
                                    <p className="text-sm font-medium text-gray-600">All-Inclusive Package Starting From</p>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                        {resort.price || `$${Math.floor(Math.random() * (800 - 300) + 300)}`}
                                    </p>
                                    <span className="text-lg font-medium text-gray-600">/night</span>
                                </div>
                                {resort.price_detail && (
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm text-emerald-600 font-semibold bg-emerald-50 px-4 py-1.5 rounded-full inline-block">
                                            {resort.price_detail}
                                        </p>
                                        <span className="text-sm font-medium text-gray-500">Limited Time Only!</span>
                                    </div>
                                )}
                                <p className="text-sm text-gray-600">Includes all meals, drinks & activities</p>
                            </div>
                        </div>


                    </div>
                    {/* Contact Information */}
                    <div className="space-y-8 mb-8">

                        {(resort.phone_number || resort.website_url) && (
                            <div className=" grid grid-cols-2 bg-white rounded-xl border border-gray-800 p-8 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-indigo-50 rounded-lg">
                                        <EnvelopeIcon className="h-6 w-6 text-indigo-600" />
                                    </div>
                                    <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                                        Get in Touch
                                    </h2>
                                </div>
                                <div className="space-y-4">
                                    {resort.phone_number && (
                                        <div className="group flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                            <PhoneIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-600 mr-3" />
                                            <a
                                                href={`tel:${resort.phone_number}`}
                                                className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200"
                                                aria-label={`Call us at ${resort.phone_number}`}
                                            >
                                                {resort.phone_number}
                                            </a>
                                        </div>
                                    )}
                                    {resort.website_url && (
                                        <div className="group flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                            <GlobeAltIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-600 mr-3" />
                                            <a
                                                href={resort.website_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200"
                                                aria-label="Visit our website"
                                            >
                                                Visit Our Official Website
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Similar Resorts */}
                    {data.all_inclusive_resorts && data.all_inclusive_resorts.length > 1 && (
                        <div className="mt-8 mb-8 bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-2xl font-bold mb-6">Similar Resorts</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {data.all_inclusive_resorts
                                    .filter((r: Resort) => r.title !== resort.title)
                                    .slice(0, 3)
                                    .map((similarResort: Resort, idx: number) => (
                                        <Link
                                            key={idx}
                                            href={`/travel/${country}/resort/${similarResort.title
                                                .toLowerCase()
                                                .replace(/[^\w\s-]/g, '')
                                                .replace(/\s+/g, '-')
                                                .trim()}`}
                                            className="group bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                                        >
                                            <div className="relative h-48">
                                                <Image
                                                    src={similarResort.images[0].image}
                                                    alt={similarResort.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-semibold group-hover:text-blue-600 transition-colors">
                                                    {similarResort.title}
                                                </h3>
                                                {similarResort.star && (
                                                    <div className="flex items-center mt-1">
                                                        <StarIcon className="h-4 w-4 text-yellow-400" />
                                                        <span className="ml-1 text-sm text-gray-600">{similarResort.star}</span>
                                                    </div>
                                                )}
                                                <p className="mt-2 text-sm text-gray-500">From {similarResort.price}</p>
                                            </div>
                                        </Link>
                                    ))}
                            </div>
                        </div>
                    )}
                    <div className="mt-8 mb-8 bg-white rounded-lg border border-gray-800 p-6 text-center">
                        <h2 className="text-2xl font-bold mb-6">
                            Visit Our 15 Top Best Resort in {country.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, l => l.toUpperCase())}
                        </h2>
                        <p className="text-lg text-gray-700 mb-4">Experience the ultimate luxury getaway at our top-rated resort. Enjoy world-class amenities, gourmet dining, and breathtaking views.</p>
                        <Link href={`/travel/${country}/resort/top-best`} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Explore Our Top Resort
                        </Link>
                    </div>
                    {/* Resort Policies */}
                    <section className="bg-white rounded-lg border border-gray-800 p-6 mb-8">
                        <h2 className="text-2xl font-bold mb-6">Resort Policies</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="font-semibold text-lg mb-4">Check-in & Check-out</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start">
                                        <div className="flex-shrink-0 w-5 h-5 mt-1">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-gray-700">Check-in: 3:00 PM - 11:00 PM</p>
                                            <p className="text-sm text-gray-500">Early check-in subject to availability</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="flex-shrink-0 w-5 h-5 mt-1">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-gray-700">Check-out: Before 12:00 PM</p>
                                            <p className="text-sm text-gray-500">Late check-out subject to availability</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-4">Important Information</h3>
                                <ul className="space-y-3">
                                    {[
                                        "Government-issued photo ID required",
                                        "Minimum check-in age is 18",
                                        "Credit card required for incidental charges",
                                        "Cash not accepted"
                                    ].map((info, idx) => (
                                        <li key={idx} className="flex items-start">
                                            <div className="flex-shrink-0 w-5 h-5 mt-1">
                                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <span className="ml-3 text-gray-700">{info}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>
                    {/* More Booking Options */}
                    {resort.featured_options && resort.featured_options.slice(3).length > 0 && (
                        <div className="bg-white rounded-lg border border-gray-800 p-6 mb-8">
                            <h2 className="text-lg font-semibold mb-4">More Booking Options</h2>
                            <div className="space-y-3 grid md:grid-cols-4">
                                {resort.featured_options.slice(3).map((option: { url: string, name: string, price: string, member_rating: string }, idx: number) => (
                                    <a
                                        key={idx}
                                        href={option.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full border rounded-lg p-4 hover:border-blue-500 transition-colors"
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">{option.name}</span>
                                            {option.price && <span className="text-blue-600">{option.price}</span>}
                                        </div>
                                        {option.member_rating && (
                                            <div className="text-sm text-gray-500 mt-1">{option.member_rating}</div>
                                        )}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className=" gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            {/* Guest Reviews & Amenities Section */}
                            {resort.things_to_do && resort.things_to_do.length > 0 && (
                                <div className="bg-white rounded-lg border border-gray-200 p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold">Guest Reviews & Experiences</h2>
                                        <Link
                                            href="#all-reviews"
                                            className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                                        >
                                            View all reviews & amenities →
                                        </Link>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        {resort.things_to_do
                                            .sort((a: { single_review: string }, b: { single_review: string }) => {
                                                if (a.single_review && !b.single_review) return 1;
                                                if (!a.single_review && b.single_review) return -1;
                                                return 0;
                                            })
                                            .map((item: { single_review: string, name: string, single_review_author_photo: string, single_review_author_name: string, visite_site_url: string, visite_site: string }, idx: number) => (
                                                <div
                                                    key={idx}
                                                    className="flex flex-col bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
                                                >
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                                                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                                                    </div>
                                                    {item.single_review && (
                                                        <div className="mt-2 flex-1">
                                                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                                                <p className="text-gray-700 italic">&quot;{item.single_review}&quot;</p>
                                                                {item.single_review_author_photo && (
                                                                    <div className="mt-3 flex items-center gap-2">
                                                                        <Image
                                                                            src={item.single_review_author_photo}
                                                                            alt={`Review by guest for ${resort.title}`}
                                                                            width={32}
                                                                            height={32}
                                                                            className="rounded-full border-2 border-white shadow"
                                                                        />
                                                                        <span className="text-sm text-gray-500">{item.single_review_author_name}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {item.visite_site_url && (
                                                        <a
                                                            href={item.visite_site_url}
                                                            className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 self-end"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            {item.visite_site} →
                                                        </a>
                                                    )}
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {/* Nearby Places */}
                            {resort.nearby_places && resort.nearby_places.length > 0 && (
                                <div className="bg-white rounded-lg border border-gray-800 p-6">
                                    <h2 className="text-2xl font-bold mb-6">Nearby Attractions</h2>
                                    <div className="space-y-6">
                                        {resort.nearby_places.map((place: { url: string, name: string, offerings: string, distance_from_this_resort: string, rating: string, number_of_reviews: string }, idx: number) => (
                                            <div key={idx} className="flex items-start border-b last:border-0 pb-6 last:pb-0">
                                                <div className="flex-grow">
                                                    <h3 className="font-semibold">
                                                        <a href={place.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                                                            {place.name}
                                                        </a>
                                                    </h3>
                                                    {place.offerings && <p className="text-sm text-gray-600 mt-1">{place.offerings}</p>}
                                                    <div className="flex items-center mt-2">
                                                        <MapPinIcon className="h-4 w-4 text-gray-400" />
                                                        <span className="text-sm text-gray-500 ml-1">{place.distance_from_this_resort}</span>
                                                        {place.rating && (
                                                            <>
                                                                <StarIcon className="h-4 w-4 text-yellow-400 ml-4" />
                                                                <span className="text-sm text-gray-500 ml-1">{place.rating}</span>
                                                                <span className="text-sm text-gray-400 ml-1">{place.number_of_reviews}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>





                    {/* Weather & Best Time to Visit */}
                    <section className="bg-white my-8 rounded-lg border border-gray-800 p-6 mb-8">
                        <h2 className="text-2xl font-bold mb-6">Weather & Best Time to Visit</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="font-semibold text-lg mb-4">Seasonal Overview</h3>
                                <div className="space-y-4">
                                    {[
                                        {
                                            season: "High Season (Dec-Apr)",
                                            description: "Dry season with perfect beach weather. Expect higher rates and crowds.",
                                            temp: "75°F - 90°F"
                                        },
                                        {
                                            season: "Green Season (May-Nov)",
                                            description: "Occasional afternoon showers with lush landscapes. Better rates available.",
                                            temp: "70°F - 85°F"
                                        }
                                    ].map((season, idx) => (
                                        <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                                            <h4 className="font-medium text-blue-600">{season.season}</h4>
                                            <p className="text-gray-600 mt-1">{season.description}</p>
                                            <p className="text-sm text-gray-500 mt-2">Average temperatures: {season.temp}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-4">Activities by Season</h3>
                                <div className="space-y-4">
                                    <div className="border-l-4 border-blue-600 pl-4">
                                        <h4 className="font-medium">Dry Season Activities</h4>
                                        <ul className="mt-2 space-y-2 text-gray-600">
                                            <li>• Beach activities and sunbathing</li>
                                            <li>• Snorkeling and diving</li>
                                            <li>• Hiking and nature tours</li>
                                            <li>• Outdoor dining</li>
                                        </ul>
                                    </div>
                                    <div className="border-l-4 border-green-600 pl-4">
                                        <h4 className="font-medium">Green Season Activities</h4>
                                        <ul className="mt-2 space-y-2 text-gray-600">
                                            <li>• Waterfall visits</li>
                                            <li>• Rainforest exploration</li>
                                            <li>• Spa treatments</li>
                                            <li>• Cultural tours</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Getting There */}
                    <section className="bg-white rounded-lg border border-gray-800 p-6 mb-8">
                        <h2 className="text-2xl font-bold mb-6">Getting There</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="font-semibold text-lg mb-4">Transportation Options</h3>
                                <div className="space-y-4">
                                    {[
                                        {
                                            type: "Airport Transfer",
                                            details: "Available through the resort (additional fee)",
                                            icon: "🚙"
                                        },
                                        {
                                            type: "Rental Car",
                                            details: "Recommended for flexibility in exploring",
                                            icon: "🚗"
                                        },
                                        {
                                            type: "Shuttle Service",
                                            details: "Shared and private options available",
                                            icon: "🚐"
                                        }
                                    ].map((transport, idx) => (
                                        <div key={idx} className="flex items-start">
                                            <span className="text-2xl mr-4">{transport.icon}</span>
                                            <div>
                                                <h4 className="font-medium">{transport.type}</h4>
                                                <p className="text-gray-600">{transport.details}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-4">Distances</h3>
                                <div className="space-y-3">
                                    {[
                                        { place: "Nearest Airport", distance: "45 minutes drive" },
                                        { place: "City Center", distance: "15 minutes drive" },
                                        { place: "Beach", distance: "Beachfront" },
                                        { place: "National Park", distance: "30 minutes drive" }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex justify-between py-2 border-b last:border-0">
                                            <span className="text-gray-600">{item.place}</span>
                                            <span className="font-medium">{item.distance}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Local Area Guide */}
                    <section className="bg-white rounded-lg border border-gray-800 p-6 mb-8">
                        <h2 className="text-2xl font-bold mb-6">Local Area Guide - {country.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, l => l.toUpperCase())}</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="font-semibold text-lg mb-4">Local Highlights</h3>
                                <div className="space-y-4">
                                    {[
                                        {
                                            title: "Culture & Heritage",
                                            description: `Immerse yourself in the rich ${country.replace(/-/g, ' ')} culture through local festivals, traditional cuisine, and authentic experiences.`,
                                            icon: "🏺"
                                        },
                                        {
                                            title: "Natural Wonders",
                                            description: "Explore pristine beaches, lush rainforests, and diverse wildlife in their natural habitat.",
                                            icon: "🌴"
                                        },
                                        {
                                            title: "Local Cuisine",
                                            description: "Savor authentic dishes and fresh tropical fruits from local markets and restaurants.",
                                            icon: "🍽️"
                                        }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-start p-4 bg-gray-50 rounded-lg">
                                            <span className="text-2xl mr-4">{item.icon}</span>
                                            <div>
                                                <h4 className="font-medium text-gray-900">{item.title}</h4>
                                                <p className="text-gray-600 mt-1">{item.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-4">Travel Tips</h3>
                                <div className="bg-blue-50 p-6 rounded-lg">
                                    <ul className="space-y-4">
                                        <li className="flex items-start">
                                            <span className="text-blue-600 mr-2">✓</span>
                                            <p className="text-gray-700">Best time to visit: December to April for optimal weather conditions</p>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-blue-600 mr-2">✓</span>
                                            <p className="text-gray-700">Local currency: USD widely accepted alongside local currency</p>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-blue-600 mr-2">✓</span>
                                            <p className="text-gray-700">Language: English widely spoken in tourist areas</p>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-blue-600 mr-2">✓</span>
                                            <p className="text-gray-700">Transportation: Car rental recommended for exploring</p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Eco-Tourism & Sustainability */}
                    <section className="bg-white rounded-lg border border-gray-800 p-6 mb-8">
                        <h2 className="text-2xl font-bold mb-6">Eco-Tourism & Sustainability</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold text-lg mb-3">Environmental Initiatives</h3>
                                    <ul className="space-y-3">
                                        {[
                                            "Solar power and energy-efficient lighting systems",
                                            "Water conservation and recycling programs",
                                            "Organic waste composting",
                                            "Local sourcing of food and materials",
                                            "Wildlife protection and habitat conservation"
                                        ].map((item, idx) => (
                                            <li key={idx} className="flex items-center">
                                                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-700">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="bg-green-50 p-6 rounded-lg">
                                <h3 className="font-semibold text-lg mb-4">Sustainable Tourism Practices</h3>
                                <div className="space-y-4">
                                    <p className="text-gray-700">
                                        Our resort is committed to preserving the natural beauty of {country.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, l => l.toUpperCase())} while providing an exceptional guest experience.
                                    </p>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { label: "Renewable Energy", value: "40%" },
                                            { label: "Water Recycled", value: "60%" },
                                            { label: "Local Staff", value: "90%" },
                                            { label: "Local Sourcing", value: "75%" }
                                        ].map((stat, idx) => (
                                            <div key={idx} className="bg-white p-4 rounded-lg">
                                                <div className="text-2xl font-bold text-green-600">{stat.value}</div>
                                                <div className="text-sm text-gray-600">{stat.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Adventure & Activities */}
                    <section className="bg-white rounded-lg border border-gray-800 p-6 mb-8">
                        <h2 className="text-2xl font-bold mb-6">Adventure & Activities in {country.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, l => l.toUpperCase())}</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                {
                                    title: "Water Sports",
                                    activities: ["Surfing", "Snorkeling", "Kayaking", "Paddleboarding"],
                                    icon: "🏄‍♂️"
                                },
                                {
                                    title: "Nature Exploration",
                                    activities: ["Hiking", "Bird Watching", "Waterfall Tours", "Night Walks"],
                                    icon: "🥾"
                                },
                                {
                                    title: "Cultural Experiences",
                                    activities: ["Cooking Classes", "Local Markets", "Art Workshops", "Dance Lessons"],
                                    icon: "🎨"
                                }
                            ].map((category, idx) => (
                                <div key={idx} className="bg-gray-50 rounded-lg p-6">
                                    <div className="text-3xl mb-4">{category.icon}</div>
                                    <h3 className="font-semibold text-lg mb-3">{category.title}</h3>
                                    <ul className="space-y-2">
                                        {category.activities.map((activity, actIdx) => (
                                            <li key={actIdx} className="flex items-center text-gray-700">
                                                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                                                {activity}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                All activities can be arranged through our concierge service. Special packages and group rates available.
                            </p>
                        </div>
                    </section>

                    {/* FAQs Section */}
                    <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                        <div className="space-y-6">
                            {[
                                {
                                    question: `Does ${resort.title} offer free cancellation for a full refund?`,
                                    answer: `Absolutely! ${resort.title} provides fully refundable room rates, giving you peace of mind. Cancel up to a few days before check-in, depending on their straightforward cancellation policy. Just check the terms when booking!`
                                },
                                {
                                    question: `Is there a pool at ${resort.title}?`,
                                    answer: `Dive in! ${resort.title} boasts not one but two pools—an outdoor pool for adults and a safe, fun children's pool for the little ones.`
                                },
                                {
                                    question: `Are pets allowed at ${resort.title}?`,
                                    answer: `Sorry, animal lovers—no pets or service animals are allowed at ${resort.title}. It's all about creating a comfortable stay for everyone.`
                                },
                                {
                                    question: `Is parking offered on-site at ${resort.title}?`,
                                    answer: `Yes, and it's free! Drive up and park with ease thanks to ${resort.title}'s complimentary self-parking service.`
                                },
                                {
                                    question: `What are the check-in and check-out times at ${resort.title}?`,
                                    answer: `Check-in opens at 2 PM and wraps up by 3 PM, while check-out is a crisp noon. Perfect for maximizing your stay!`
                                },
                                {
                                    question: `What activities and amenities are available at ${resort.title} and nearby?`,
                                    answer: "Get ready for action! Play tennis, basketball, or volleyball, pamper yourself at the spa, or dance the night away at the nightclub. There's also a fitness center, outdoor pool, spa services, and lush gardens. Venture out for a scenic walk to Parque Nacional Curu, just 14 minutes away!"
                                },
                                {
                                    question: `Are there dining options at or near ${resort.title}?`,
                                    answer: "Yes, the on-site restaurant serves up delicious meals. Plus, you'll find plenty of local flavors nearby to satisfy every craving."
                                },
                                {
                                    question: `Does ${resort.title} have private outdoor spaces for guests?`,
                                    answer: "Absolutely! Each room comes with a private balcony or patio—your own little slice of paradise."
                                },
                                {
                                    question: `What is the surrounding area like at ${resort.title}?`,
                                    answer: "It's a dream location! Barceló Tambor is nestled close to Parque Nacional Curu, a stunning reserve where nature lovers can explore, relax, and connect with wildlife."
                                }
                            ].map((faq, idx) => (
                                <div key={idx} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                                    <p className="text-gray-600">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Schema.org data */}
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                "@context": "https://schema.org",
                                "@type": "LodgingBusiness",
                                name: resort.title,
                                image: resort.images.map((img: { image: string }) => img.image),
                                description: resort.about_this_place,
                                starRating: {
                                    "@type": "Rating",
                                    ratingValue: resort.star ? parseInt(resort.star.split(' ')[0]) : undefined
                                },
                                address: {
                                    "@type": "PostalAddress",
                                    addressLocality: resort.location,
                                    addressCountry: country.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, l => l.toUpperCase())
                                },
                                priceRange: resort.price,
                                amenityFeature: [
                                    {
                                        "@type": "LocationFeatureSpecification",
                                        name: "Swimming Pool"
                                    },
                                    {
                                        "@type": "LocationFeatureSpecification",
                                        name: "Restaurant"
                                    },
                                    {
                                        "@type": "LocationFeatureSpecification",
                                        name: "Free WiFi"
                                    },
                                    {
                                        "@type": "LocationFeatureSpecification",
                                        name: "Spa Services"
                                    },
                                    {
                                        "@type": "LocationFeatureSpecification",
                                        name: "Fitness Center"
                                    },
                                    {
                                        "@type": "LocationFeatureSpecification",
                                        name: "Private Beach Access"
                                    },
                                    {
                                        "@type": "LocationFeatureSpecification",
                                        name: "Room Service"
                                    },
                                    {
                                        "@type": "LocationFeatureSpecification",
                                        name: "Air Conditioning"
                                    }
                                ],
                                review: resort.things_to_do?.map((review: { single_review?: string }) => ({
                                    "@type": "Review",
                                    datePublished: Date.now(),
                                    reviewBody: review.single_review
                                }))
                            })
                        }}
                    />


                    {/* BreadcrumbList Schema */}
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                "@context": "https://schema.org",
                                "@type": "BreadcrumbList",
                                itemListElement: [
                                    {
                                        "@type": "ListItem",
                                        position: 1,
                                        item: {
                                            "@id": process.env.NEXT_PUBLIC_APP_URL,
                                            name: "Home"
                                        }
                                    },
                                    {
                                        "@type": "ListItem",
                                        position: 2,
                                        item: {
                                            "@id": `${process.env.NEXT_PUBLIC_APP_URL}/accomodation/${country}`,
                                            name: country.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, l => l.toUpperCase())
                                        }
                                    },
                                    {
                                        "@type": "ListItem",
                                        position: 3,
                                        item: {
                                            "@id": `${process.env.NEXT_PUBLIC_APP_URL}/travel/${country}/resort/${name}`,
                                            name: resort.title
                                        }
                                    }
                                ]
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