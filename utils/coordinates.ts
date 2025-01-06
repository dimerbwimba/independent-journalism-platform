export interface Coordinates {
  [key: string]: {
    lat: number;
    lng: number;
    name: string;
    x: number; // Percentage position on map image (0-100)
    y: number; // Percentage position on map image (0-100)
  };
}

// Simplified coordinates with x,y positions relative to the map image
export const COSTA_RICA_COORDINATES: Coordinates = {
  'san-jose': {
    lat: 9.9281,
    lng: -84.0907,
    name: 'San Jose',
    x: 55,
    y: 40
  },
  'puerto-viejo': {
    lat: 9.9281,
    lng: -84.0907,
    name: 'Puerto Viejo',
    x: 80,
    y: 49
  },
  'fortuna': {
    lat: 9.9281,
    lng: -84.0907,
    name: 'Fortuna',
    x: 43,
    y: 20
  },
  'liberia': {
    lat: 10.6357,
    lng: -85.4377,
    name: 'Liberia',
    x: 25,
    y: 20
  },
  'guanacaste': {
    lat: 10.6357,
    lng: -85.4377,
    name: 'Guanacaste',
    x: 25,
    y: 20
  },
  'tamarindo': {
    lat: 10.2992,
    lng: -85.8416,
    name: 'Tamarindo',
    x: 18,
    y: 30
  },
  'jaco': {
    lat: 9.6141,
    lng: -84.6282,
    name: 'Jaco',
    x: 42,
    y: 50
  },
  'quepos': {
    lat: 9.4316,
    lng: -84.1616,
    name: 'Quepos',
    x: 58,
    y: 60
  },
  'heredia': {
    lat: 9.9907,
    lng: -83.0359,
    name: 'Heredia',
    x: 55,
    y: 25
  },
  'turrialba': {
    lat: 9.3436,
    lng: -83.7043,
    name: 'Turrialba',
    x: 65,
    y: 55
  },
  'puntarenas': {
    lat: 10.2612,
    lng: -85.5856,
    name: 'Puntarenas',
    x: 38,
    y: 39
  },
  'playa-hermosa': {
    lat: 9.9281,
    lng: -84.0907,
    name: 'Playa Hermosa',
    x: 18,
    y: 22
  },
  'san-gerardo-de-dota': {
    lat: 9.9281,
    lng: -84.0907,
    name: 'San Gerardo de Dota',
    x: 62,
    y: 45
  } 
};

export function getCoordinatesForLocation(country: string, location: string): { x: number; y: number } | null {
  const coordinates = getCoordinatesForCountry(country);
  const normalizedLocation = location.toLowerCase().replace(/\s+/g, '-')

  // Try direct match first
  if (coordinates[normalizedLocation]) {
    return {
      x: coordinates[normalizedLocation].x,
      y: coordinates[normalizedLocation].y
    };
  }

  // Try to find a partial match
  const matchingKey = Object.keys(coordinates).find(key => 
    key.includes(normalizedLocation) || normalizedLocation.includes(key)
  );

  if (matchingKey) {
    return {
      x: coordinates[matchingKey].x,
      y: coordinates[matchingKey].y
    };
  }

  return null;
}

export function getCoordinatesForCountry(country: string): Coordinates {
  switch (country.toLowerCase()) {
    case 'costa-rica':
      return COSTA_RICA_COORDINATES;
    default:
      return {};
  }
} 