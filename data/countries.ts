import { StaticImageData } from 'next/image';
import costaRicaImage from '@/public/images/destinations/costa-rica.webp';

export interface CountryData {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | StaticImageData;
  status: 'active' | 'coming_soon';
  stats?: {
    totalAccommodations?: number;
    averageRating?: number;
    regions?: number;
  };
  metadata: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export const countries: CountryData[] = [
  {
    id: 'costa-rica',
    name: 'Costa Rica',
    slug: 'costa-rica',
    description: 'Explore tropical paradise with our curated selection of hotels and resorts',
    image: 'https://i.ibb.co/ZSdWQGp/Designer-8.webp',
    status: 'active',
    stats: {
      totalAccommodations: 280,
      averageRating: 8.9,
      regions: 14,
    },
    metadata: {
      title: 'Best Hotels in Costa Rica | Top-Rated Accommodations',
      description: 'Find and compare the best hotels in Costa Rica. From luxury resorts to boutique hotels, discover perfect stays in tropical paradise.',
      keywords: [
        'costa rica hotels',
        'costa rica resorts',
        'where to stay in costa rica',
        'best hotels costa rica',
        'luxury resorts costa rica',
        'beach hotels costa rica'
      ]
    }
  },
  {
    id: 'thailand',
    name: 'Thailand',
    slug: 'thailand',
    description: 'Coming soon - Discover amazing stays in the Land of Smiles',
    image: 'https://i.ibb.co/Dt3nDPk/Designer-14.webp', // Replace with actual image
    status: 'coming_soon',
    metadata: {
      title: 'Thailand Hotels & Resorts | Coming Soon',
      description: 'Soon you\'ll be able to discover the best accommodations in Thailand.',
      keywords: ['thailand hotels', 'thailand resorts', 'where to stay thailand']
    }
  },
  // Add more countries as needed
];

export function getActiveCountries() {
  return countries.filter(country => country.status === 'active');
}

export function getComingSoonCountries() {
  return countries.filter(country => country.status === 'coming_soon');
}

export function getCountryBySlug(slug: string) {
  return countries.find(country => country.slug === slug);
}

export function getAllCountrySlugs() {
  return countries.map(country => country.slug);
} 