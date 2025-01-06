import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  MapPinIcon,
  BuildingOfficeIcon,
  StarIcon,
  CurrencyDollarIcon,
  QuestionMarkCircleIcon,
  ChevronRightIcon,
  InformationCircleIcon,
  GlobeAmericasIcon
} from '@heroicons/react/24/outline'
import CountryArticles from '@/components/CountryArticles'

interface Hotel {
  name: string
  url: string
  image?: string
  rating?: string
  rating_detail?: string
  description?: string
  number_of_review?: string
  price?: string
}

interface LocationData {
  name: string
  accomodation: string
  image?: string
  top_hotels: Hotel[]
  most_booked_hotels: Hotel[]
  budget_options: Hotel[]
  airbnbs: {
    name: string
    url: string
    image?: string
    rating?: string
    rating_detail?: string
    description?: string
  }[]
  faqs?: {
    name: string
    answer: string
  }[]
  close_to_the_city?: Hotel[]
}

interface CountryData {
  region_hotels: LocationData[]
}

// Helper function to extract numerical rating
function extractRating(rating: string) {
  const match = rating?.match(/(\d+(\.\d+)?)/);
  return match ? match[1] : null;
}

// Add new helper functions
function getTopHotels(hotels: Hotel[] = [], limit = 9) {
  return hotels?.sort((a, b) => {
    const ratingA = extractRating(a.rating || '0') || '0';
    const ratingB = extractRating(b.rating || '0') || '0';
    return parseFloat(ratingB) - parseFloat(ratingA);
  }).slice(0, limit);
}

function getHotelsByRating(hotels: Hotel[] = [], minRating = 9.0) {
  return hotels?.filter(hotel => {
    const rating = extractRating(hotel.rating || '0');
    return rating && parseFloat(rating) >= minRating;
  });
}

export async function generateStaticParams() {
  try {
    // Get list of available country data files
    const countries = ['costa-rica']; // Add more countries as they become available
    
    const params = [];

    for (const country of countries) {
      const countryData = await import(`@/data/${country.toLowerCase().replace("-","_")}_data.json`);
      const countryKey = `${country.toLowerCase().replace(/-/g, "_")}`;
      const regionData = countryData[countryKey] as CountryData;
      
      if (regionData?.region_hotels) {
        const countryParams = regionData.region_hotels.map((locationData) => ({
          country: country,
          location: locationData.name?.toLowerCase().replace(/\s+/g, '-')
        }));
        params.push(...countryParams);
      }
    }

    return params;
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ location: string, country: string }> }): Promise<Metadata> {
  const {location, country} = await params;
  const countryData = await import(`@/data/${country.toLowerCase().replace("-","_")}_data.json`);
  const countryKey = `${country.toLowerCase().replace(/-/g, "_")}`;
  const regionData = countryData[countryKey] as CountryData;

  if (!regionData?.region_hotels) {
    return {
      title: 'Not Found',
      description: 'The requested location could not be found'
    };
  }

  const locationData = regionData.region_hotels.find(
    (loc) => loc.name.toLowerCase().replace(/\s+/g, '-') === location
  );

  if (!locationData) {
    return {
      title: 'Location Not Found',
      description: 'The requested location could not be found'
    };
  }

  return {
    title: `Best Hotels in ${locationData.name}, ${country} | Top-Rated Accommodations`,
    description: `Find and compare ${locationData.accomodation} in ${locationData.name}, ${country}. Book top-rated hotels, resorts and vacation rentals. Best price guarantee.`,
    keywords: [
      `${locationData.name} hotels`,
      `where to stay in ${locationData.name}`,
      `${country.toLowerCase()} accommodations`,
      `best hotels ${country.toLowerCase()}`,
      `${locationData.name} resorts`,
      `luxury hotels ${country.toLowerCase()}`,
      `beach hotels ${country.toLowerCase()}`
    ],
    openGraph: {
      title: `Best Hotels in ${locationData.name}, ${country}`,
      description: `Discover and book from ${locationData.accomodation} in ${locationData.name}. Compare prices, read reviews, and find your perfect stay.`,
      images: locationData.image ? [{
        url: locationData.image,
        width: 1200,
        height: 630,
        alt: `Hotels in ${locationData.name}, ${country}`
      }] : undefined,
      type: 'website',
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title: `Best Hotels in ${locationData.name}, ${country}`,
      description: `Find and book from ${locationData.accomodation} in ${locationData.name}. Best rates guaranteed.`
    },
    alternates: {
      canonical: `https://yoursite.com/hotels/${location}`
    }
  };
}

export default async function LocationPage({ params }: { params: Promise<{ location: string, country: string }> }) {
  const {location, country} = await params;

  try {
    const countryData = await import(`@/data/${country.toLowerCase().replace("-","_")}_data.json`);
    const countryKey = `${country.toLowerCase().replace(/-/g, "_")}`;
    const regionData = countryData[countryKey] as CountryData;

    if (!regionData?.region_hotels) {
      notFound();
    }
    
    const locationData = regionData.region_hotels.find(
      (loc) => loc.name.toLowerCase().replace(/\s+/g, '-') === location
    );

    if (!locationData) {
      notFound();
    }

    const topHotels = getTopHotels(locationData.top_hotels);
    const highlyRatedHotels = getHotelsByRating(locationData.most_booked_hotels);
    const budgetHotels = locationData.budget_options;
    
    // Get nearby locations for internal linking
    const nearbyLocations = regionData.region_hotels
      .filter((loc) => loc.name !== locationData.name)
      .slice(0, 3);

    return (
      <div className="min-h-screen bg-gray-50">    
        <div className="">
          {/* Hero Section */}
          <div className="bg-white border-b">
            <div className="max-w-[1400px] mx-auto lg:px-60 md:px-20 px-10 py-16">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                  Best hotels in {locationData.name} {country}
                </h1>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                  Discover {locationData.accomodation} in {locationData.name}, {country}. From luxury resorts to boutique hotels, find the perfect accommodation for your stay. Compare prices, read verified reviews, and book with confidence. Whether you&apos;re looking for beachfront views, jungle adventures, or city convenience, we&apos;ll help you find the ideal hotel in {locationData.name} at the best rates.
                </p>
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
                    <Link href={`/travel-accomodation/${country}`} className="text-gray-500 hover:text-gray-700">
                      {country.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, l => l.toUpperCase())}
                    </Link>
                  </li>
                  <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                  <li className="text-gray-900 font-medium">{locationData.name}</li>
                </ol>
              </nav>
            </div>
          </div>
          {/* Enhanced Quick Info */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex items-start">
                <BuildingOfficeIcon className="h-6 w-6 text-blue-500 mt-1" />
                <div className="ml-3">
                  <h3 className="font-semibold">Total Accommodations</h3>
                  <p className="text-sm text-gray-600">{locationData.accomodation}</p>
                </div>
              </div>
              {topHotels[0] && (
                <div className="flex items-start">
                  <StarIcon className="h-6 w-6 text-yellow-400 mt-1" />
                  <div className="ml-3">
                    <h3 className="font-semibold">Highest Rated</h3>
                    <p className="text-sm text-gray-600">
                      {extractRating(topHotels[0].rating || '')} ({topHotels[0].rating_detail?.split('\n')[1]})
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-start">
                <MapPinIcon className="h-6 w-6 text-blue-500 mt-1" />
                <div className="ml-3">
                  <h3 className="font-semibold">Location</h3>
                  <p className="text-sm text-gray-600">{country}</p>
                </div>
              </div>
              <div className="flex items-start">
                <InformationCircleIcon className="h-6 w-6 text-blue-500 mt-1" />
                <div className="ml-3">
                  <h3 className="font-semibold">Booking Info</h3>
                  <p className="text-sm text-gray-600">Instant confirmation</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <section className="space-y-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Featured Hotels Section */}
            {topHotels.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Featured Hotels in {locationData.name}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {topHotels.map((hotel) => (
                    <Link
                      key={hotel.name}
                      href={hotel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
                    >
                      {hotel.image && (
                        <div className="relative h-48">
                          <Image
                            src={hotel.image}
                            alt={hotel.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {hotel.rating && (
                            <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-sm font-semibold">
                              {extractRating(hotel.rating)}
                            </div>
                          )}
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                          {hotel.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {hotel.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-600">
                            <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                            <span>{hotel.rating_detail?.split('\n')[1]}</span>
                          </div>
                          <span className="text-sm text-gray-600">
                            {hotel.number_of_review}
                          </span>
                        </div>
                        <div className="flex items-center justify-center mt-2">
                          <div  className="bg-blue-500 flex items-center justify-center text-white px-4 py-1 rounded hover:bg-blue-600 transition-colors w-full text-center"> 
                            <CurrencyDollarIcon className="h-4 w-4 inline-block mr-1" />
                            <span>Price: {hotel.price}</span>
                          </div>
                        </div>

                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            <CountryArticles country={country}/>
            {/* Location Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Why Choose {locationData.name}?
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <BuildingOfficeIcon className="h-5 w-5 text-blue-500 mt-1 mr-3" />
                    <span className="text-gray-600">
                      {locationData.accomodation} to choose from
                    </span>
                  </li>
                  {highlyRatedHotels.length > 0 && (
                    <li className="flex items-start">
                      <StarIcon className="h-5 w-5 text-yellow-400 mt-1 mr-3" />
                      <span className="text-gray-600">
                        {highlyRatedHotels.length} highly-rated properties
                      </span>
                    </li>
                  )}
                  <li className="flex items-start">
                    <CurrencyDollarIcon className="h-5 w-5 text-green-500 mt-1 mr-3" />
                    <span className="text-gray-600">
                      Options for every budget
                    </span>
                  </li>
                </ul>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Explore More Destinations
                </h3>
                <ul className="space-y-3">
                  {nearbyLocations.map(location => (
                    <li key={location.name}>
                      <Link
                        href={`/travel-accomodation/hotels/${location.name?.toLowerCase().replace(/\s+/g, '-')}?country=${country}`}
                        className="flex items-center text-gray-600 hover:text-blue-600"
                      >
                        <MapPinIcon className="h-5 w-5 mr-2" />
                        <span>{location.name}</span>
                        <span className="text-sm text-gray-500 ml-auto">
                          {location.accomodation}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {budgetHotels.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Top Budget Hotels in {locationData.name}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {budgetHotels.map((hotel) => (
                    <Link
                      key={hotel.name}
                      href={hotel.url+"?ss="+locationData.name}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
                    >
                      {hotel.image && (
                        <div className="relative h-48">
                          <Image
                            src={hotel.image}
                            alt={hotel.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {hotel.rating && (
                            <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-sm font-semibold">
                              {extractRating(hotel.rating)}
                            </div>
                          )}
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                          {hotel.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {hotel.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-600">
                            <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                            <span>{hotel.rating_detail?.split('\n')[1]}</span>
                          </div>
                          <span className="text-sm text-gray-600">
                            {hotel.number_of_review}
                          </span>
                        </div>
                        <div className="flex items-center justify-center mt-2">
                          <p  className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition-colors w-full text-center"> 
                            View the full price
                          </p>
                        
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Travel Resources */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Travel Resources to {locationData.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <a
                  href="https://www.visitcostarica.com/en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <GlobeAmericasIcon className="h-6 w-6 text-blue-500 mt-1" />
                  <div className="ml-3">
                    <h3 className="font-semibold">Official Tourism Website</h3>
                    <p className="text-sm text-gray-600">Visit Costa Rica</p>
                  </div>
                </a>
                <Link
                  href={`/article/${country?.toLowerCase().replace(/\s+/g, '-')}-travel-guides`}
                  className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <QuestionMarkCircleIcon className="h-6 w-6 text-blue-500 mt-1" />
                  <div className="ml-3">
                    <h3 className="font-semibold">Travel Guide</h3>
                    <p className="text-sm text-gray-600">Costa Rica Tips & Info</p>
                  </div>
                </Link>
               
                <a
                  href="https://www.weather.com/weather/today/l/Costa+Rica"
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <GlobeAmericasIcon className="h-6 w-6 text-blue-500 mt-1" />
                  <div className="ml-3">
                    <h3 className="font-semibold">Weather Forecast</h3>
                    <p className="text-sm text-gray-600">Local Weather Updates</p>
                  </div>
                </a>
                <a
                  href="https://www.xe.com/currencyconverter/convert/?Amount=1&From=USD&To=CRC"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <CurrencyDollarIcon className="h-6 w-6 text-blue-500 mt-1" />
                  <div className="ml-3">
                    <h3 className="font-semibold">Currency Converter</h3>
                    <p className="text-sm text-gray-600">Check Exchange Rates</p>
                  </div>
                </a>
                
              </div>
            </div>
            {/* Airbnb Listings Section */}
            {locationData.airbnbs.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Popular Airbnb Stays in {locationData.name}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {locationData.airbnbs.map((listing,index) => (
                    <Link
                      key={index}
                      href={listing.url+"?ss="+listing.name}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
                    >
                      {listing.image && (
                        <div className="relative h-48">
                          <Image
                            src={listing.image}
                            alt={listing.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {listing.rating_detail && (
                            <div className="absolute top-2 left-2 bg-rose-500 text-white px-2 py-1 rounded text-sm font-medium">
                              {listing.rating_detail}
                            </div>
                          )}
                          
                          {listing.rating && (
                            <div className="absolute top-2 right-2 bg-black/75 text-white px-2 py-1 rounded text-sm font-medium flex items-center">
                              <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                              {listing.rating.split('\n')[1]}
                            </div>
                          )}
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-rose-500 transition-colors">
                          {listing.name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {listing.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {/* Additional SEO Content */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About {locationData.name}
              </h2>
              <div className="prose max-w-none">
                <p className="text-gray-600">
                  Discover the perfect stay in {locationData.name}, {country}. From luxury resorts to cozy boutique hotels,
                  find accommodations that match your style and budget. With {locationData.accomodation} to choose from,
                  you&apos;ll find the ideal base for exploring this beautiful destination.
                </p>
                <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">
                  Why Stay in {locationData.name}?
                </h3>
                <ul className="list-disc pl-5 text-gray-600">
                  <li>Wide range of accommodation options</li>
                  <li>Convenient location for exploring {country}</li>
                  <li>High-quality hotels with excellent ratings</li>
                  <li>Beautiful surroundings and attractions nearby</li>
                </ul>
              </div>
            </div>
          </section>
          {/* FAQs Section */}
          {locationData.faqs && locationData.faqs.length > 0 && (
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Frequently Asked Questions about {locationData.name}
                </h2>
                <div className="space-y-6">
                  {locationData.faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {faq.name}
                      </h3>
                      <p className="text-gray-600">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}


          {/* Schema.org structured data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Place",
                name: `${locationData.name}, ${country}`,
                description: `Find and book from ${locationData.accomodation} in ${locationData.name}. Compare prices, read reviews, and find your perfect stay.`,
                image: locationData.image,
                url: process.env.NEXT_PUBLIC_URL+`/travel-accomodation/hotels/${location}?country=${country}`,
                aggregateRating: locationData.close_to_the_city?.[0]?.rating ? {
                  "@type": "AggregateRating",
                  ratingValue: extractRating(locationData.close_to_the_city[0].rating || ''),
                  bestRating: "10",
                  worstRating: "1"
                } : undefined,
                mainEntity: locationData.faqs?.map(faq => ({
                  "@type": "Question",
                  name: faq.name,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: faq.answer
                  }
                }))
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