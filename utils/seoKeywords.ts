interface LocationData {
    name: string;
    region: string;
    description?: string;
    activities?: string[];
    amenities?: string[];
    priceRange?: string;
  }
  
  export function generateLongTailKeywords(location: LocationData): string[] {
    const keywords = [
      // Location-based combinations
      `best hotels in ${location.name.toLowerCase()} costa rica`,
      `where to stay in ${location.name.toLowerCase()} costa rica`,
      `${location.name.toLowerCase()} costa rica accommodation`,
      `cheap hotels in ${location.name.toLowerCase()} costa rica`,
      `luxury resorts ${location.name.toLowerCase()} costa rica`,
      
      // Region-specific combinations
      `${location.region.toLowerCase()} costa rica hotels`,
      `best area to stay in ${location.region.toLowerCase()} costa rica`,
      `${location.region.toLowerCase()} costa rica vacation rentals`,
      
      // Price-based combinations
      `affordable hotels ${location.name.toLowerCase()} costa rica`,
      `budget friendly accommodation ${location.name.toLowerCase()}`,
      `5 star hotels in ${location.name.toLowerCase()} costa rica`,
      
      // Activity-based combinations
      ...(location.activities?.map(activity => 
        `hotels near ${activity.toLowerCase()} in ${location.name.toLowerCase()}`
      ) || []),
      
      // Amenity-based combinations
      ...(location.amenities?.map(amenity =>
        `${location.name.toLowerCase()} hotels with ${amenity.toLowerCase()}`
      ) || []),
      
      // Seasonal combinations
      `${location.name.toLowerCase()} hotels in rainy season`,
      `${location.name.toLowerCase()} hotels in dry season`,
      `best time to visit ${location.name.toLowerCase()} costa rica`,
      
      // Purpose-based combinations
      `${location.name.toLowerCase()} hotels for families`,
      `romantic hotels in ${location.name.toLowerCase()} costa rica`,
      `${location.name.toLowerCase()} hotels for backpackers`,
      
      // Experience-based combinations
      `${location.name.toLowerCase()} beachfront hotels`,
      `jungle lodges in ${location.name.toLowerCase()} costa rica`,
      `eco resorts ${location.name.toLowerCase()} costa rica`,
      
      // Comparison-based keywords
      `${location.name.toLowerCase()} vs tamarindo hotels`,
      `best areas to stay ${location.region.toLowerCase()} costa rica`,
      
      // Question-based keywords
      `is ${location.name.toLowerCase()} good for families`,
      `which hotels in ${location.name.toLowerCase()} have ocean view`,
      `how far is ${location.name.toLowerCase()} from airport`
    ];
  
    // Filter out any empty or undefined values
    return keywords.filter(Boolean);
  }
  
  // Usage example:
  export function generateMetadata(location: LocationData) {
    const longTailKeywords = generateLongTailKeywords(location);
    
    return {
      title: `${location.name} Hotels & Resorts | Best Places to Stay in Costa Rica`,
      description: `Find the perfect ${location.name} hotel. Compare prices, read reviews, and book your stay in ${location.region}, Costa Rica. From luxury resorts to budget-friendly options.`,
      keywords: longTailKeywords.join(', '),
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_APP_URL}/travel-accommodation/hotels/${location.name.toLowerCase()}`
      }
    };
  }