import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { StarIcon, MapPinIcon, ShieldCheckIcon, InformationCircleIcon, CheckCircleIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import NewsletterForm from "@/components/NewsletterForm";
import { getCoordinatesForLocation } from '@/utils/coordinates';
import CountryArticles from "@/components/CountryArticles";
import CountryCost from "@/components/CountryCost";

interface RegionHotel {
  name: string;
  url: string;
  image: string;
  image_url: string;
  accomodation: string;
  accomodation_url: string;
  close_to_the_city: any[];
}

interface Resort {
  name: string;
  title: string;
  star: string;
  url: string;
  image: string;
  rating?: string;
  rating_detail?: string;
  description?: string;
  price?: string;
  about_this_place?: string;
  images: {
    image: string;
  }[];
}

// Generate metadata dynamically based on country
export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country } = await params;
  const formattedCountry = country.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, l => l.toUpperCase());

  try {
    const countryData = await import(`@/data/${country.toLowerCase().replace("-", "_")}_data.json`);
    const data = countryData[country.toLowerCase().replace(/-/g, "_")];

    if (!data?.region_hotels?.length) {
      return {
        title: 'Not Found',
        description: 'The requested country could not be found'
      };
    }

    const totalAccommodations = data.region_hotels.reduce((acc: number, hotel: RegionHotel) => {
      const numAccommodations = parseInt(hotel.accomodation.split(' ')[0]) || 0;
      return acc + numAccommodations;
    }, 0);

    return {
      title: `Best Hotels in ${formattedCountry} | Top-Rated Accommodations`,
      description: `Find and compare ${totalAccommodations}+ accommodations in ${formattedCountry}. Book top-rated hotels, resorts and vacation rentals. Best price guarantee.`,
      keywords: [
        `best region to visit in ${formattedCountry}`,
        `${formattedCountry} hotels`,
        `where to stay in ${formattedCountry}`,
        `${formattedCountry} accommodations`,
        'best hotels',
        `${formattedCountry} resorts`,
        'top region for luxury hotels',
        'beach hotels'
      ],
      openGraph: {
        title: `Best Hotels in ${formattedCountry}`,
        description: `Discover and book from ${totalAccommodations}+ accommodations in ${formattedCountry}. Compare prices, read reviews, and find your perfect stay.`,
        type: 'website',
        locale: 'en_US'
      },
      twitter: {
        card: 'summary_large_image',
        title: `Best Hotels in ${formattedCountry}`,
        description: `Find and book from ${totalAccommodations}+ accommodations in ${formattedCountry}. Best rates guaranteed.`
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_URL}/travel/${country}`
      }
    };
  } catch {
    return {
      title: 'Error loading data from ' + { formattedCountry },
      description: 'There was an error loading the data from' + { formattedCountry }
    };
  }
}

export default async function CountryPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;

  try {
    const countryData = await import(`@/data/${country.toLowerCase().replace("-", "_")}_data.json`);
    const data = countryData[country.toLowerCase().replace(/-/g, "_")];

    if (!data?.region_hotels?.length) {
      notFound();
    }

    // Calculate total accommodations and average rating
    const totalAccommodations = data.region_hotels.reduce((acc: number, region: any) => {
      return acc + parseInt(region.accomodation.split(' ')[0] || '0');
    }, 0);

    const allRatings = data.all_inclusive_resorts?.map((resort: Resort) =>
      parseFloat(resort.rating?.split(' ')[0] || '0')
    ).filter((rating: number) => rating > 0);

    const averageRating = allRatings?.length
      ? (allRatings.reduce((a: number, b: number) => a + b, 0) / allRatings.length).toFixed(1)
      : null;

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-white border-b">
          <div className="max-w-[1400px] mx-auto lg:px-60 md:px-20 px-10 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                {country.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, l => l.toUpperCase())}&apos;s Best Hotels: From All-Inclusive Resorts to Hidden Gems
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Ready to uncover the hidden treasures of {country.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, l => l.toUpperCase())}?
                Whether you dream of lounging at a luxurious all-inclusive resort or cozying up in a charming boutique hotel,
                we&apos;ve handpicked the most extraordinary stays just for you. Let&apos;s make your perfect getaway a reality!
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats Section */}
        <div className="bg-white border-b">
          <div className="max-w-[1400px] mx-auto lg:px-60 md:px-20 px-10 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{totalAccommodations}+</div>
                  <div className="text-sm text-gray-600">Accommodations</div>
                </div>
              </div>
              {averageRating && (
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{averageRating}</div>
                    <div className="text-sm text-gray-600">Average Rating</div>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{data.region_hotels.length}</div>
                  <div className="text-sm text-gray-600">Regions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
                </li>
                <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                <li>
                  {country.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, l => l.toUpperCase())}
                </li>

              </ol>
            </nav>
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto lg:px-60 md:px-20 px-10 py-16">
          {/* Interactive Map Preview */}
          <section className=" mb-10 bg-white rounded-lg border border-gray-800 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Interactive Map: Discover {country.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, l => l.toUpperCase())}&apos;s Top Travel Destinations & Accommodations
            </h2>
            <div className="relative w-full h-[500px] rounded-lg overflow-hidden">
              <Image
                src={`/maps/${country.toLowerCase()}.png`}
                alt={`Map of ${country}`}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {data.region_hotels.map((region: RegionHotel) => {

                const position = getCoordinatesForLocation(country, region.name);


                if (!position) return null;

                return (
                  <Link
                    key={region.name}
                    href={`/travel/${country}/${region.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="absolute group hover:z-10"
                    style={{
                      left: `${position.x}%`,
                      top: `${position.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <div className="relative">
                      <div className="w-5 h-5 bg-blue-600 rounded-full border-2 border-white shadow-lg" />
                      <div className="absolute left-1/2 bottom-full mb-1 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-2 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 whitespace-nowrap">
                        <p className="font-medium text-sm">{region.name}</p>
                        <p className="text-xs text-gray-600">{region.accomodation}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="mt-4 text-sm text-gray-500 text-center">
              Click on any marker to explore hotels and resorts in that region
            </div>
          </section>
          {/* Existing Region Hotels Grid */}
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Best Places to Stay in {country.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, l => l.toUpperCase())}: Top Regions & Destinations for {new Date().getFullYear()}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.region_hotels.map((hotel: RegionHotel, index: number) => (
              <Link
                href={`/travel/${country}/${hotel.name.toLowerCase().replace(/\s+/g, '-')}`}
                key={`${hotel.name}-${index}`}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="aspect-[4/3] relative">
                  <Image
                    src={hotel.image}
                    alt={hotel.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 px-4 py-4 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300">
                        {hotel.name}
                      </h3>
                      {/* <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                        <BookOpenIcon className="h-4 w-4 text-white" />
                        <span className="text-sm font-medium text-white">{hotel.accomodation}</span>
                      </div> */}
                    </div>

                    <span className="inline-flex items-center text-sm font-medium text-blue-300 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      Explore Hotels
                      <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </span>
                  </div>

                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </Link>
            ))}
          </div>

          <CountryArticles country={country} />
          <div className="mt-8 mb-8 bg-white rounded-lg border border-gray-800 p-6 text-center">
            <h2 className="text-2xl font-bold mb-6">
              Visit Our 15 Top Best Resort in {country.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, l => l.toUpperCase())}
            </h2>
            <p className="text-lg text-gray-700 mb-4">Experience the ultimate luxury getaway at our top-rated resort. Enjoy world-class amenities, gourmet dining, and breathtaking views.</p>
            <Link href={`/travel/${country}/resort/top-best`} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Explore Our Top Resort
            </Link>
          </div>
          <CountryCost country={country} />
          {/* All-Inclusive Resorts Section */}
          {data.all_inclusive_resorts && data.all_inclusive_resorts.length > 0 && (
            <section className="mt-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                All-Inclusive Resorts in {country.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, l => l.toUpperCase())}
              </h2>
              <div className="space-y-8">
                {data.all_inclusive_resorts.map((resort: Resort, index: number) => (
                  <Link
                    key={`${resort.name}-${index}`}
                    href={`/travel/${country}/resort/${resort.title.toLowerCase().replace(/\s+/g, '-')}`}
                    rel="noopener noreferrer"
                    className="group flex flex-col md:flex-row bg-white rounded-lg overflow-hidden border border-gray-800 shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative w-full md:w-64 h-64 md:h-auto flex-shrink-0">
                      <Image
                        src={resort.images[0].image}
                        alt={resort.name}
                        className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300"
                        fill
                      />
                      {resort.rating && (
                        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-sm font-semibold">
                          {resort.rating}
                        </div>
                      )}
                      <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-sm font-medium">
                        All-Inclusive
                      </div>
                    </div>
                    <div className="flex flex-col flex-grow p-6">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-2">
                        <h3 className="font-semibold text-xl group-hover:text-blue-600 transition-colors">
                          {resort.title}
                        </h3>
                        {resort.price && (
                          <p className="text-lg font-medium text-gray-900 whitespace-nowrap">
                            From {resort.price}
                          </p>
                        )}
                      </div>
                      {resort.about_this_place && (
                        <p className="text-gray-600 mb-4">
                          {resort.about_this_place}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        {resort.rating_detail && (
                          <p className="text-sm text-gray-500">
                            {resort.rating_detail}
                          </p>
                        )}
                        {resort.star && (
                          <div className="flex items-center text-sm text-gray-600">
                            <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                            <span>{resort.star.split(' ')[0] + ' Resort'}</span>
                          </div>
                        )}
                      </div>
                      {resort.images.length > 1 && (
                        <div className="mt-4 flex gap-2">
                          {resort.images.slice(1, 4).map((image, idx) => (
                            image.image && (
                              <div key={idx} className="relative h-16 w-16 rounded-md overflow-hidden">
                                <Image
                                  src={image.image}
                                  alt={`${resort.name} view ${idx + 2}`}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )
                          ))}
                          {resort.images.length > 4 && (
                            <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-900 cursor-pointer hover:bg-gray-800 transition-colors">
                              <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-medium">
                                +{resort.images.length - 4}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Travel Tips Section */}
          <section className="mt-16 bg-white rounded-lg border border-gray-800 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Travel Tips for {country.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, l => l.toUpperCase())}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Best Time to Visit</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                    <span>High Season: December to April (Dry Season)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                    <span>Low Season: May to November (Green Season)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                    <span>Best Weather: January to March</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Accommodation Tips</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                    <span>Book in advance for high season</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                    <span>Consider all-inclusive resorts for better value</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                    <span>Check for package deals including tours</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Why Book With Us Section */}
          <section className="mt-16 bg-white rounded-lg border border-gray-800 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Why Book With Us
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <ShieldCheckIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Best Price Guarantee</h3>
                <p className="text-sm text-gray-600">We match any comparable price you find elsewhere.</p>
              </div>
              <div className="text-center">
                <InformationCircleIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Expert Support</h3>
                <p className="text-sm text-gray-600">Our travel experts are here to help 24/7.</p>
              </div>
              <div className="text-center">
                <MapPinIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Local Knowledge</h3>
                <p className="text-sm text-gray-600">Get insider tips and recommendations.</p>
              </div>
            </div>
          </section>

          {/* Travel Resources Section */}
          <section className="mt-16 bg-white rounded-lg  border border-gray-800 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Essential Travel Resources in {country.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, l => l.toUpperCase())}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
              <a
                href={`https://www.weather.com/weather/today/l/${country.replace(/-/g, '+')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900">Weather Forecast</h3>
                <p className="text-sm text-gray-500 text-center mt-1">Check local weather conditions</p>
              </a>

              <a
                href="https://www.xe.com/currencyconverter/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900">Currency Converter</h3>
                <p className="text-sm text-gray-500 text-center mt-1">Check exchange rates</p>
              </a>

              <a
                href={`https://www.google.com/maps/place/${country.replace(/-/g, '+')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                  <MapPinIcon className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="font-medium text-gray-900">Interactive Map</h3>
                <p className="text-sm text-gray-500 text-center mt-1">Explore locations</p>
              </a>

              <Link
                href={`/article/${country}-travel-guides`}
                className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                  <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900">Travel Guide to {country.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, l => l.toUpperCase())}</h3>
                <p className="text-sm text-gray-500 text-center mt-1">Essential tips & info</p>
              </Link>
            </div>
          </section>

          {/* Safety & Travel Tips */}
          <section className="mt-16 bg-white rounded-lg border border-gray-800 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Safety & Travel Tips in {country.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, l => l.toUpperCase())}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Health & Safety in {country.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, l => l.toUpperCase())}</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                    <span>Travel insurance is recommended</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                    <span>Check vaccination requirements</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                    <span>Keep important documents safe</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Local Customs</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                    <span>Respect local dress codes</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                    <span>Learn basic local phrases</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                    <span>Be mindful of cultural norms</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>


          {/* Price Range Filter */}
          <section className="mt-16 bg-white rounded-lg border border-gray-800 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Browse by Price Range
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {['Budget', 'Mid-Range', 'Luxury', 'Ultra-Luxury'].map((range, index) => {
                const priceSymbol = '💰'.repeat(index + 1);
                return (
                  <div
                    key={range}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 cursor-pointer transition-colors"
                  >
                    <div className="text-2xl mb-2">{priceSymbol}</div>
                    <h3 className="font-medium text-gray-900">{range}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {index === 0 && 'Under $100/night'}
                      {index === 1 && '$100-$200/night'}
                      {index === 2 && '$200-$500/night'}
                      {index === 3 && '$500+/night'}
                    </p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Popular Amenities */}
          <section className="mt-16 bg-white rounded-lg border border-gray-800 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Popular Amenities
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Swimming Pool', icon: '🏊‍♂️' },
                { name: 'Free WiFi', icon: '📶' },
                { name: 'Spa Services', icon: '💆‍♀️' },
                { name: 'Restaurant', icon: '🍽️' },
                { name: 'Fitness Center', icon: '💪' },
                { name: 'Beach Access', icon: '🏖️' },
                { name: 'Room Service', icon: '🛎️' },
                { name: 'Airport Shuttle', icon: '🚐' }
              ].map((amenity) => (
                <div
                  key={amenity.name}
                  className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg"
                >
                  <span className="text-xl">{amenity.icon}</span>
                  <span className="text-sm text-gray-700">{amenity.name}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Seasonal Travel Guide */}
          <section className="mt-16 bg-white rounded-lg border border-gray-800 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              What is the best time to visit {country.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, l => l.toUpperCase())}?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  season: 'Spring',
                  months: 'Mar-May',
                  weather: '🌤️ Mild',
                  pricing: 'Moderate',
                  highlights: ['Perfect hiking weather', 'Fewer tourists', 'Lower rates']
                },
                {
                  season: 'Summer',
                  months: 'Jun-Aug',
                  weather: '☀️ Warm',
                  pricing: 'Peak',
                  highlights: ['Beach season', 'Festivals', 'Busy period']
                },
                {
                  season: 'Fall',
                  months: 'Sep-Nov',
                  weather: '🍂 Cool',
                  pricing: 'Low',
                  highlights: ['Best deals', 'Fall colors', 'Less crowded']
                },
                {
                  season: 'Winter',
                  months: 'Dec-Feb',
                  weather: '❄️ Cold',
                  pricing: 'Mixed',
                  highlights: ['Holiday events', 'Winter sports', 'Cozy stays']
                }
              ].map((season) => (
                <div
                  key={season.season}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <h3 className="font-semibold text-lg mb-2">{season.season}</h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600">📅 {season.months}</p>
                    <p className="text-gray-600">{season.weather}</p>
                    <p className="text-gray-600">💰 {season.pricing} Season</p>
                    <ul className="mt-2 space-y-1">
                      {season.highlights.map((highlight, index) => (
                        <li key={index} className="text-gray-600 flex items-center">
                          <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>


          {/* FAQ Section */}
          <section className="mt-16 bg-white rounded-lg border border-gray-800 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">What&apos;s the best area to stay in {country.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, l => l.toUpperCase())}?</h3>
                <p className="text-gray-600">It depends on your preferences. Each region offers unique experiences, from beach resorts to mountain lodges.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">When should I book my accommodation?</h3>
                <p className="text-gray-600">We recommend booking at least 3-4 months in advance, especially during high season (December to April).</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Are all-inclusive resorts worth it?</h3>
                <p className="text-gray-600">All-inclusive resorts can offer great value, especially if you plan to stay at the resort and enjoy multiple meals and activities.</p>
              </div>
            </div>
          </section>
          {/* Newsletter Signup */}
          <NewsletterForm />
          {/* Update the Rich Snippets to include more structured data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "TravelAgency",
                name: `Best Hotels in ${country.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, l => l.toUpperCase())}`,
                description: `Find and compare ${totalAccommodations}+ accommodations in ${country}. Book top-rated hotels, resorts and vacation rentals.`,
                areaServed: {
                  "@type": "Country",
                  name: country.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, l => l.toUpperCase())
                },
                aggregateRating: averageRating ? {
                  "@type": "AggregateRating",
                  ratingValue: averageRating,
                  reviewCount: allRatings?.length || 0
                } : undefined,
                makesOffer: {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Hotel Booking Service",
                    description: "Book hotels and resorts with best price guarantee"
                  }
                },
                hasOfferCatalog: {
                  "@type": "OfferCatalog",
                  name: "Hotel Accommodations",
                  itemListElement: data.region_hotels.map((region: RegionHotel) => ({
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "LodgingBusiness",
                      name: region.name,
                      image: region.image,
                      description: `Hotels and accommodations in ${region.name}`
                    }
                  }))
                }
              })
            }}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading data:', error);
    notFound();
  }
}