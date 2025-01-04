import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

interface RegionHotel {
  name: string;
  url: string;
  image: string;
  image_url: string;
  accomodation: string;
  accomodation_url: string;
  close_to_the_city: any[];
}

// Generate metadata dynamically based on country
export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country } = await params;
  const formattedCountry = country.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, l => l.toUpperCase());

  try {
    const countryData = await import(`@/data/${country.toLowerCase().replace("-","_")}_data.json`);
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
        canonical: `https://yoursite.com/travel-accommodation/${country}`
      }
    };
  } catch {
    return {
      title: 'Error loading data from '+{formattedCountry},
      description: 'There was an error loading the data from'+{formattedCountry}
    };
  }
}

export default async function CountryPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;

  let data;
  try {
    // Dynamically import data based on country parameter
    const countryData = await import(`@/data/${country.toLowerCase().replace("-","_")}_data.json`);
    data = countryData[country.toLowerCase().replace(/-/g, "_")];

    if (!data?.region_hotels?.length) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-[1400px] mx-auto lg:px-60 md:px-20 px-10 py-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Hotels in {country.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, l => l.toUpperCase())}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.region_hotels.map((hotel: RegionHotel, index: number) => (
              <Link 
                href={`/travel-accomodation/${country}/${hotel.name.toLowerCase().replace(/\s+/g, '-')}`}
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
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading data:', error);
    notFound();
  }
}