export interface Bird {
  id: string;
  name: string;
  age: string;
  weight: string;
  color: string;
  line: string;
  price?: number;
  availability: 'Available' | 'Sold';
  isFeatured: boolean;
  images: string[];
  videos: string[];
  parents: {
    father: {
      images: string[];
      videos: string[];
    };
    mother: {
      images: string[];
      videos: string[];
    };
  };
}

const birdsData: Bird[] = [
  {
    id: 'rgf-m01-2025',
    name: 'Thunderstrike',
    age: '1 year 2 months',
    weight: '2.2 kg',
    color: 'Red Pyle',
    line: 'Kelso',
    price: 15000,
    availability: 'Available',
    isFeatured: true,
    images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
    videos: ['https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'],
    parents: {
      father: {
        images: ['https://placehold.co/600x400.png'],
        videos: [],
      },
      mother: {
        images: ['https://placehold.co/600x400.png'],
        videos: [],
      },
    },
  },
  {
    id: 'rgf-f02-2025',
    name: 'Ruby',
    age: '11 months',
    weight: '1.8 kg',
    color: 'Wheaten',
    line: 'Hatch',
    price: 12000,
    availability: 'Available',
    isFeatured: true,
    images: ['https://placehold.co/600x400.png'],
    videos: [],
    parents: {
      father: {
        images: ['https://placehold.co/600x400.png'],
        videos: [],
      },
      mother: {
        images: ['https://placehold.co/600x400.png'],
        videos: [],
      },
    },
  },
  {
    id: 'rgf-m03-2024',
    name: 'Blaze',
    age: '1 year 6 months',
    weight: '2.4 kg',
    color: 'Black Breasted Red',
    line: 'Roundhead',
    availability: 'Sold',
    isFeatured: true,
    images: ['https://placehold.co/600x400.png'],
    videos: [],
    parents: {
      father: {
        images: ['https://placehold.co/600x400.png'],
        videos: [],
      },
      mother: {
        images: ['https://placehold.co/600x400.png'],
        videos: [],
      },
    },
  },
   {
    id: 'rgf-m04-2025',
    name: 'Goliath',
    age: '1 year',
    weight: '2.5 kg',
    color: 'Grey',
    line: 'Albany',
    price: 18000,
    availability: 'Available',
    isFeatured: false,
    images: ['https://placehold.co/600x400.png'],
    videos: [],
    parents: {
      father: {
        images: ['https://placehold.co/600x400.png'],
        videos: [],
      },
      mother: {
        images: ['https://placehold.co/600x400.png'],
        videos: [],
      },
    },
  },
];

export function getBirds(): Bird[] {
  return birdsData;
}

export function getBirdById(id: string): Bird | undefined {
  return birdsData.find((bird) => bird.id === id);
}

export function getFeaturedBirds(): Bird[] {
  return birdsData.filter((bird) => bird.isFeatured);
}
