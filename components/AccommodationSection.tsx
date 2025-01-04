'use client';

import Link from "next/link";
import Image from "next/image";
import { getActiveCountries, getComingSoonCountries } from '@/data/countries';

export default function AccommodationSection() {
  const activeCountries = getActiveCountries();
  const comingSoonCountries = getComingSoonCountries();

  return (
    <section className="bg-white py-16">
      <div className="max-w-[1400px] mx-auto lg:px-60 md:px-20 px-10">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Find Your Perfect Stay
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Discover handpicked accommodations in top destinations
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Active Countries */}
          {activeCountries.map((country) => (
            <Link 
              key={country.id}
              href={`/travel-accomodation/${country.slug}`}
              className="relative group rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-white h-[300px]"
            >
              <div className="h-full w-full relative">
                <Image
                  src={country.image}
                  alt={`${country.name} Hotels`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={true}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3 className="text-2xl font-bold text-white drop-shadow-sm">{country.name}</h3>
                  <p className="text-sm text-white/90 mt-2 line-clamp-2 drop-shadow-sm">
                    {country.description}
                  </p>
                  {country.stats && (
                    <p className="text-sm text-white/90 mt-1 drop-shadow-sm">
                      {country.stats.totalAccommodations}+ accommodations · {country.stats.regions} regions
                    </p>
                  )}
                  <div className="mt-4 inline-flex items-center text-sm font-medium text-white translate-y-0 group-hover:translate-x-1 transition-all duration-300">
                    Browse Accommodations
                    <span className="ml-2">→</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {/* Coming Soon Countries */}
          {comingSoonCountries.map((country) => (
            <div 
              key={country.id}
              className="relative rounded-lg overflow-hidden shadow-lg bg-gray-50 border border-gray-100 hover:shadow-xl transition-all duration-300 h-[300px]"
            >
              <div className="h-full w-full relative">
                <Image
                  src={country.image}
                  alt={`${country.name} Hotels`}
                  fill
                  className="object-cover opacity-30"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <div className="bg-gray-200/80 px-4 py-1 rounded-full text-sm text-gray-600 mb-4">
                    Coming Soon
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700">{country.name}</h3>
                  <p className="text-sm text-gray-500 mt-2 max-w-xs">
                    {country.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}