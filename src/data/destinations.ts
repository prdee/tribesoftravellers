export interface Destination {
  id: string;
  name: string;
  slug: string;
  type: string[];
  image: string;
  packages: number;
  startingPrice: number;
  bestTime: string;
  rating: number;
  travelers: number;
  description: string;
  isInternational: boolean;
}

export interface Package {
  id: string;
  name: string;
  slug: string;
  destination: string;
  duration: string;
  nights: number;
  days: number;
  price: number;
  originalPrice?: number;
  inclusions: string[];
  image: string;
  images?: string[];
  rating: number;
  reviews: number;
  tags: string[];
  overview?: string;
  itinerary?: { day: number; title: string; description: string }[];
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  destination: string;
  image: string;
  rating: number;
  review: string;
  tags: string[];
  date: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  slug: string;
}

export const destinations: Destination[] = [
  // Existing Domestic
  {
    id: '1', name: 'Kerala', slug: 'kerala', type: ['honeymoon', 'family', 'nature'],
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800',
    packages: 1026, startingPrice: 8370, bestTime: 'OCT - MAR', rating: 4.3, travelers: 18588,
    description: 'One of India\'s most scenic states, Kerala is known for its palm-lined beaches, backwaters, and network of canals.',
    isInternational: false,
  },
  {
    id: '2', name: 'Himachal', slug: 'himachal', type: ['honeymoon', 'adventure', 'nature'],
    image: 'https://images.unsplash.com/photo-1626010448982-4d629b9c0223?w=800',
    packages: 403, startingPrice: 5000, bestTime: 'APR - JUL', rating: 4.2, travelers: 18502,
    description: 'With stunning snowy peaks and lush valleys, Himachal Pradesh offers breathtaking mountain views and adventure activities.',
    isInternational: false,
  },
  {
    id: '6', name: 'Uttarakhand', slug: 'uttarakhand', type: ['adventure', 'nature', 'religious'],
    image: 'https://images.unsplash.com/photo-1626010448982-4d629b9c0223?w=800',
    packages: 167, startingPrice: 8399, bestTime: 'JAN - JUL', rating: 4.3, travelers: 12000,
    description: 'Uttarakhand is a state in the northern part of India known for its Hindu pilgrimage sites, including the Char Dham.',
    isInternational: false,
  },
  {
    id: '9', name: 'Rajasthan', slug: 'rajasthan', type: ['family', 'culture', 'luxury'],
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800',
    packages: 150, startingPrice: 6000, bestTime: 'OCT - MAR', rating: 4.4, travelers: 11000,
    description: 'Rajasthan is known for its palaces, forts, and vibrant culture. It\'s a land of kings and queens.',
    isInternational: false,
  },
  {
    id: '11', name: 'Andaman', slug: 'andaman', type: ['honeymoon', 'water-activities', 'adventure'],
    image: 'https://images.unsplash.com/photo-1589793907316-d9f5f07e4e6c?w=800',
    packages: 72, startingPrice: 8999, bestTime: 'SEP - MAR', rating: 4.4, travelers: 8000,
    description: 'The unique islands of Andaman showcase the pristine beauty of nature with crystal clear waters.',
    isInternational: false,
  },
  {
    id: '12', name: 'Kashmir', slug: 'kashmir', type: ['honeymoon', 'nature', 'adventure'],
    image: 'https://images.unsplash.com/photo-1562696271-0580063e6b7c?w=800',
    packages: 119, startingPrice: 9000, bestTime: 'MAR - NOV', rating: 4.5, travelers: 9500,
    description: 'Kashmir is known as Paradise on Earth for its stunning valleys, lakes, and snow-capped mountains.',
    isInternational: false,
  },
  {
    id: '13', name: 'Goa', slug: 'goa', type: ['honeymoon', 'friends', 'water-activities'],
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800',
    packages: 300, startingPrice: 5000, bestTime: 'OCT - MAR', rating: 4.3, travelers: 20000,
    description: 'Goa is one of the most astounding holiday spots with beautiful beaches, vibrant nightlife, and Portuguese heritage.',
    isInternational: false,
  },
  // Existing International
  {
    id: '3', name: 'Maldives', slug: 'maldives', type: ['honeymoon', 'water-activities', 'luxury'],
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800',
    packages: 88, startingPrice: 45999, bestTime: 'JUL - APR', rating: 4.6, travelers: 6174,
    description: 'The whimsical beauty of Maldives invites tourists from all over the world to explore its turquoise waters and white sand beaches.',
    isInternational: true,
  },
  {
    id: '4', name: 'Dubai', slug: 'dubai', type: ['family', 'luxury', 'shopping'],
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
    packages: 128, startingPrice: 33999, bestTime: 'OCT - FEB', rating: 4.5, travelers: 6271,
    description: 'Dubai is located on the Eastern coast of the Arabian Peninsula and is known for its luxury shopping, ultramodern architecture, and nightlife.',
    isInternational: true,
  },
  {
    id: '5', name: 'Thailand', slug: 'thailand', type: ['honeymoon', 'family', 'adventure'],
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800',
    packages: 256, startingPrice: 22056, bestTime: 'APR - JUN', rating: 4.4, travelers: 15000,
    description: 'Thailand is known for its tropical beaches, opulent royal palaces, ancient ruins, and ornate temples displaying figures of Buddha.',
    isInternational: true,
  },
  {
    id: '14', name: 'Bali', slug: 'bali', type: ['honeymoon', 'nature', 'culture'],
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    packages: 150, startingPrice: 25999, bestTime: 'APR - OCT', rating: 4.5, travelers: 12000,
    description: 'Bali is known for its forested volcanic mountains, iconic rice paddies, beaches, and coral reefs.',
    isInternational: true,
  },
  // New Global Destinations
  {
    id: '15', name: 'Switzerland', slug: 'switzerland', type: ['honeymoon', 'nature', 'luxury'],
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800',
    packages: 45, startingPrice: 125000, bestTime: 'MAY - SEP', rating: 4.9, travelers: 8500,
    description: 'Switzerland offers majestic Alpine scenery, pristine lakes, charming villages, and world-class skiing and chocolate.',
    isInternational: true,
  },
  {
    id: '16', name: 'Japan', slug: 'japan', type: ['culture', 'nature', 'family'],
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
    packages: 62, startingPrice: 85000, bestTime: 'MAR - MAY', rating: 4.8, travelers: 11200,
    description: 'Japan is a unique blend of traditional and modern, featuring ancient temples, cherry blossoms, and neon-lit cities.',
    isInternational: true,
  },
  {
    id: '17', name: 'South Africa', slug: 'south-africa', type: ['wildlife', 'adventure', 'nature'],
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800',
    packages: 38, startingPrice: 75000, bestTime: 'MAY - OCT', rating: 4.7, travelers: 5400,
    description: 'South Africa is renowned for its diverse wildlife, stunning landscapes, vineyards, and the beautiful city of Cape Town.',
    isInternational: true,
  },
  {
    id: '18', name: 'New Zealand', slug: 'new-zealand', type: ['adventure', 'nature', 'honeymoon'],
    image: 'https://images.unsplash.com/photo-1469521669194-babbdf9ff9cb?w=800',
    packages: 55, startingPrice: 145000, bestTime: 'DEC - FEB', rating: 4.9, travelers: 6300,
    description: 'New Zealand boasts breathtaking fjords, mountains, and adrenaline-pumping adventure sports.',
    isInternational: true,
  },
  {
    id: '19', name: 'Italy', slug: 'italy', type: ['culture', 'honeymoon', 'luxury'],
    image: 'https://images.unsplash.com/photo-1515542622106-78b28af78158?w=800',
    packages: 85, startingPrice: 95000, bestTime: 'APR - JUN', rating: 4.8, travelers: 14500,
    description: 'Italy is home to rich history, incredible art, romantic canals in Venice, and world-renowned cuisine.',
    isInternational: true,
  },
  {
    id: '20', name: 'France', slug: 'france', type: ['culture', 'honeymoon', 'luxury'],
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    packages: 92, startingPrice: 90000, bestTime: 'APR - OCT', rating: 4.7, travelers: 16000,
    description: 'France offers iconic landmarks like the Eiffel Tower, beautiful countryside, and exquisite wine and dining.',
    isInternational: true,
  },
  {
    id: '21', name: 'Greece', slug: 'greece', type: ['honeymoon', 'beach', 'culture'],
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800',
    packages: 48, startingPrice: 85000, bestTime: 'MAY - OCT', rating: 4.8, travelers: 9200,
    description: 'Greece is famous for its ancient ruins, whitewashed villages, and crystal-clear Aegean waters.',
    isInternational: true,
  },
  {
    id: '22', name: 'Spain', slug: 'spain', type: ['culture', 'beach', 'family'],
    image: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=800',
    packages: 70, startingPrice: 80000, bestTime: 'APR - OCT', rating: 4.7, travelers: 12500,
    description: 'Spain offers vibrant festivals, historic architecture, beautiful beaches, and lively tapas culture.',
    isInternational: true,
  },
  {
    id: '23', name: 'Singapore', slug: 'singapore', type: ['family', 'shopping', 'luxury'],
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800',
    packages: 110, startingPrice: 35000, bestTime: 'FEB - APR', rating: 4.6, travelers: 22000,
    description: 'Singapore is a global financial center with a tropical climate, futuristic gardens, and diverse culinary scene.',
    isInternational: true,
  },
  {
    id: '24', name: 'Malaysia', slug: 'malaysia', type: ['family', 'nature', 'shopping'],
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800',
    packages: 95, startingPrice: 28000, bestTime: 'MAR - OCT', rating: 4.5, travelers: 18000,
    description: 'Malaysia features bustling cities, colonial architecture, lush rainforests, and beautiful islands.',
    isInternational: true,
  },
  {
    id: '25', name: 'Turkey', slug: 'turkey', type: ['culture', 'adventure', 'family'],
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800',
    packages: 65, startingPrice: 65000, bestTime: 'APR - MAY', rating: 4.7, travelers: 10500,
    description: 'Turkey straddles Europe and Asia, offering ancient ruins, hot air balloons in Cappadocia, and rich bazaars.',
    isInternational: true,
  },
  {
    id: '26', name: 'Egypt', slug: 'egypt', type: ['culture', 'adventure'],
    image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2b50?w=800',
    packages: 40, startingPrice: 70000, bestTime: 'OCT - APR', rating: 4.6, travelers: 7800,
    description: 'Egypt is the land of Pharaohs, featuring the Great Pyramids, the Sphinx, and Nile River cruises.',
    isInternational: true,
  },
  {
    id: '27', name: 'Australia', slug: 'australia', type: ['adventure', 'nature', 'family'],
    image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800',
    packages: 55, startingPrice: 130000, bestTime: 'SEP - NOV', rating: 4.8, travelers: 8900,
    description: 'Australia offers the Great Barrier Reef, Outback wilderness, and iconic cities like Sydney and Melbourne.',
    isInternational: true,
  },
  {
    id: '28', name: 'United Kingdom', slug: 'uk', type: ['culture', 'family', 'luxury'],
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800',
    packages: 75, startingPrice: 110000, bestTime: 'MAY - SEP', rating: 4.7, travelers: 13400,
    description: 'The UK is steeped in history, featuring medieval castles, the vibrant city of London, and scenic countrysides.',
    isInternational: true,
  },
  {
    id: '29', name: 'USA', slug: 'usa', type: ['family', 'adventure', 'luxury'],
    image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800',
    packages: 120, startingPrice: 150000, bestTime: 'MAY - SEP', rating: 4.8, travelers: 15600,
    description: 'The USA offers immense diversity, from the Grand Canyon and Yellowstone to bustling metropolises like New York.',
    isInternational: true,
  }
];

export const packages: Package[] = [
  {
    id: '1', name: 'Maldives South Palm Resort Package With Flights', slug: 'maldives-south-palm-resort-package', destination: 'Maldives',
    duration: '4 Nights/5 Days', nights: 4, days: 5, price: 73999, originalPrice: 85000,
    inclusions: ['4 Stars', 'Flights', 'Meals', 'Transfers', 'Sightseeing'],
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800',
    images: [
      'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800',
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800',
      'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800'
    ],
    rating: 4.8, reviews: 245, tags: ['honeymoon', 'luxury'],
    overview: 'Spend an evening on the beach with your beloved in the stunning Maldives. Experience crystal clear waters and luxurious resort living.',
    itinerary: [
      { day: 1, title: 'Arrival in Maldives', description: 'Arrive at Male International Airport and transfer to your resort via speedboat. Enjoy the rest of the day at leisure.' },
      { day: 2, title: 'Water Sports & Leisure', description: 'After breakfast, indulge in thrilling water sports or relax by the pristine beaches.' },
      { day: 3, title: 'Spa & Wellness', description: 'Treat yourself to a rejuvenating spa session overlooking the ocean.' },
      { day: 4, title: 'Sunset Cruise', description: 'Embark on a romantic sunset cruise and enjoy a special dinner on the beach.' },
      { day: 5, title: 'Departure', description: 'Check out and transfer back to the airport for your onward journey.' }
    ]
  },
  {
    id: '2', name: 'Exclusive Bali Honeymoon Tour Packages', slug: 'exclusive-bali-honeymoon', destination: 'Bali',
    duration: '6 Nights/7 Days', nights: 6, days: 7, price: 49000, originalPrice: 60000,
    inclusions: ['4 Stars', 'Meals', 'Sightseeing', 'Watersports', 'Transfers'],
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    images: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800',
      'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800'
    ],
    rating: 4.7, reviews: 189, tags: ['honeymoon', 'adventure'],
    overview: 'Immerse yourself in the cultural and natural beauty of Bali. From ancient temples and lush rice terraces to pristine beaches, this package offers a perfect romantic getaway. Destinations Covered: Ubud, Seminyak, Kuta.',
    itinerary: [
      { day: 1, title: 'Arrival in Bali', description: 'Arrive at Ngurah Rai International Airport. Transfer to your hotel in Ubud and relax.' },
      { day: 2, title: 'Ubud Tour', description: 'Visit the Sacred Monkey Forest, Tegalalang Rice Terrace, and Goa Gajah.' },
      { day: 3, title: 'Transfer to Seminyak & Sunset at Tanah Lot', description: 'Check in to Seminyak hotel. Visit Tanah Lot temple in the evening.' },
      { day: 4, title: 'Water Sports at Tanjung Benoa', description: 'Enjoy thrilling water sports activities. Evening at leisure.' },
      { day: 5, title: 'Nusa Penida Island Tour', description: 'Full day tour to Nusa Penida exploring Kelingking Beach and Broken Beach.' },
      { day: 6, title: 'Leisure Day', description: 'Spend the day shopping or relaxing at the beach.' },
      { day: 7, title: 'Departure', description: 'Transfer to the airport for your flight back home.' }
    ]
  },
  {
    id: '3', name: 'Budget-Friendly Dubai Packages From Atlantis', slug: 'budget-friendly-dubai', destination: 'Dubai',
    duration: '5 Nights/6 Days', nights: 5, days: 6, price: 56990,
    inclusions: ['3 Stars', 'Meals', 'Sightseeing', 'Transfers'],
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
    rating: 4.6, reviews: 278, tags: ['family', 'luxury'],
  },
  {
    id: '4', name: 'Romantic Swiss Alps Retreat', slug: 'romantic-swiss-alps-retreat', destination: 'Switzerland',
    duration: '6 Nights/7 Days', nights: 6, days: 7, price: 145000,
    inclusions: ['4 Stars', 'Meals', 'Sightseeing', 'Transfers'],
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800',
    rating: 4.9, reviews: 156, tags: ['honeymoon', 'luxury', 'nature'],
  },
  {
    id: '5', name: 'Classic Golden Route Japan', slug: 'classic-golden-route-japan', destination: 'Japan',
    duration: '7 Nights/8 Days', nights: 7, days: 8, price: 115000,
    inclusions: ['3 Stars', 'Meals', 'Guided Tours', 'Transfers'],
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
    rating: 4.8, reviews: 210, tags: ['culture', 'family'],
  },
  {
    id: '6', name: 'South African Safari & Cape Town', slug: 'south-african-safari', destination: 'South Africa',
    duration: '8 Nights/9 Days', nights: 8, days: 9, price: 135000,
    inclusions: ['4 Stars', 'Safari Drives', 'Meals', 'Flights'],
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800',
    rating: 4.7, reviews: 142, tags: ['wildlife', 'adventure'],
  },
  {
    id: '7', name: 'New Zealand Adrenaline Rush', slug: 'new-zealand-adrenaline-rush', destination: 'New Zealand',
    duration: '9 Nights/10 Days', nights: 9, days: 10, price: 175000,
    inclusions: ['4 Stars', 'Adventure Activities', 'Breakfast', 'Transfers'],
    image: 'https://images.unsplash.com/photo-1469521669194-babbdf9ff9cb?w=800',
    rating: 4.9, reviews: 98, tags: ['adventure', 'nature'],
  },
  {
    id: '8', name: 'Taste of Italy: Rome, Florence & Venice', slug: 'taste-of-italy', destination: 'Italy',
    duration: '7 Nights/8 Days', nights: 7, days: 8, price: 125000,
    inclusions: ['4 Stars', 'Breakfast', 'City Tours', 'Transfers'],
    image: 'https://images.unsplash.com/photo-1515542622106-78b28af78158?w=800',
    rating: 4.8, reviews: 315, tags: ['culture', 'honeymoon'],
  },
  {
    id: '9', name: 'Paris & French Riviera', slug: 'paris-and-french-riviera', destination: 'France',
    duration: '6 Nights/7 Days', nights: 6, days: 7, price: 110000,
    inclusions: ['4 Stars', 'Breakfast', 'Sightseeing', 'Transfers'],
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    rating: 4.7, reviews: 264, tags: ['culture', 'honeymoon'],
  },
  {
    id: '10', name: 'Greek Island Hopper: Athens, Mykonos, Santorini', slug: 'greek-island-hopper', destination: 'Greece',
    duration: '8 Nights/9 Days', nights: 8, days: 9, price: 130000,
    inclusions: ['4 Stars', 'Breakfast', 'Sightseeing', 'Transfers'],
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800',
    rating: 4.9, reviews: 187, tags: ['beach', 'honeymoon'],
  },
  {
    id: '11', name: 'Best of Spain: Madrid, Seville, Barcelona', slug: 'best-of-spain', destination: 'Spain',
    duration: '7 Nights/8 Days', nights: 7, days: 8, price: 105000,
    inclusions: ['4 Stars', 'Breakfast', 'Sightseeing', 'Transfers'],
    image: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=800',
    rating: 4.6, reviews: 220, tags: ['culture', 'family'],
  },
  {
    id: '12', name: 'Singapore Sensations with Universal Studios', slug: 'singapore-sensations', destination: 'Singapore',
    duration: '4 Nights/5 Days', nights: 4, days: 5, price: 45000,
    inclusions: ['4 Stars', 'Breakfast', 'Sightseeing', 'Transfers'],
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800',
    rating: 4.5, reviews: 412, tags: ['family', 'shopping'],
  },
  {
    id: '13', name: 'Magical Malaysia: KL & Langkawi', slug: 'magical-malaysia', destination: 'Malaysia',
    duration: '5 Nights/6 Days', nights: 5, days: 6, price: 38000,
    inclusions: ['3 Stars', 'Breakfast', 'Sightseeing', 'Transfers'],
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800',
    rating: 4.4, reviews: 350, tags: ['family', 'nature'],
  },
  {
    id: '14', name: 'Turkish Delight: Istanbul & Cappadocia', slug: 'turkish-delight', destination: 'Turkey',
    duration: '6 Nights/7 Days', nights: 6, days: 7, price: 85000,
    inclusions: ['4 Stars', 'Breakfast', 'Sightseeing', 'Transfers'],
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800',
    rating: 4.7, reviews: 198, tags: ['culture', 'adventure'],
  },
  {
    id: '15', name: 'Wonders of Egypt: Cairo & Nile Cruise', slug: 'wonders-of-egypt', destination: 'Egypt',
    duration: '7 Nights/8 Days', nights: 7, days: 8, price: 95000,
    inclusions: ['4 Stars', 'Meals', 'Sightseeing', 'Transfers'],
    image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2b50?w=800',
    rating: 4.6, reviews: 165, tags: ['culture', 'adventure'],
  },
  {
    id: '16', name: 'Australian Highlights: Sydney, Gold Coast, Melbourne', slug: 'australian-highlights', destination: 'Australia',
    duration: '9 Nights/10 Days', nights: 9, days: 10, price: 185000,
    inclusions: ['4 Stars', 'Breakfast', 'Sightseeing', 'Transfers'],
    image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800',
    rating: 4.8, reviews: 145, tags: ['family', 'adventure'],
  },
  {
    id: '17', name: 'London & Scottish Highlands Explorer', slug: 'london-scottish-highlands', destination: 'UK',
    duration: '7 Nights/8 Days', nights: 7, days: 8, price: 140000,
    inclusions: ['4 Stars', 'Breakfast', 'Sightseeing', 'Transfers'],
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800',
    rating: 4.7, reviews: 180, tags: ['culture', 'family'],
  },
  {
    id: '18', name: 'USA West Coast Road Trip', slug: 'usa-west-coast', destination: 'USA',
    duration: '10 Nights/11 Days', nights: 10, days: 11, price: 220000,
    inclusions: ['3 Stars', 'Breakfast', 'Sightseeing', 'Transfers'],
    image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800',
    rating: 4.9, reviews: 120, tags: ['adventure', 'family'],
  },
  {
    id: '19', name: 'Fascinating Kerala Honeymoon Tour', slug: 'fascinating-kerala-honeymoon', destination: 'Kerala',
    duration: '4 Nights/5 Days', nights: 4, days: 5, price: 18500,
    inclusions: ['3 Stars', 'Breakfast', 'Sightseeing', 'Transfers'],
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800',
    rating: 4.6, reviews: 540, tags: ['honeymoon', 'nature'],
  },
  {
    id: '20', name: 'Himachal Adventure Retreat', slug: 'himachal-adventure-retreat', destination: 'Himachal',
    duration: '5 Nights/6 Days', nights: 5, days: 6, price: 15000,
    inclusions: ['3 Stars', 'Breakfast', 'Sightseeing', 'Transfers'],
    image: 'https://images.unsplash.com/photo-1626010448982-4d629b9c0223?w=800',
    rating: 4.5, reviews: 320, tags: ['adventure', 'nature'],
  },
  {
    id: '21', name: 'Best Selling Weeklong Goa Tour Packages For A Fun-Filled Vacay', slug: '5nights-6days-goa-trip', destination: 'Goa',
    duration: '5 Nights/6 Days', nights: 5, days: 6, price: 16199, originalPrice: 17608,
    inclusions: ['3 Stars', 'Breakfast', 'Sightseeing', 'Stay Included', 'Transfers'],
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800',
    images: [
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800',
      'https://images.unsplash.com/photo-1560179406-1c6c60e0dc26?w=800',
      'https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?w=800'
    ],
    rating: 4.3, reviews: 2407, tags: ['beach', 'friends', 'family'],
    overview: 'Spend an evening on the beach with your beloved in Goa. Enjoy the nightlife, stunning beaches, and thrilling water sports. Trip Location: Goa. Destinations Covered: 5N Goa. Start Point: Goa airplane terminal/railroad station. End Point: Goa airplane terminal/railroad station. Accommodation: Hotel, resort. Things To Do: Adventure tours, sightseeing, beaches, culinary experiences.',
    itinerary: [
      { day: 1, title: 'Arrival in Goa & Day at Leisure', description: 'Arrive at the Goa airport or railway station and transfer to your hotel. Spend the evening exploring the local markets or relaxing by the beach.' },
      { day: 2, title: 'North Goa Sightseeing Tour', description: 'Explore the famous beaches of North Goa including Baga, Calangute, and Anjuna. Visit the historic Fort Aguada.' },
      { day: 3, title: 'South Goa Tour & Boat Cruise', description: 'Visit the serene beaches of South Goa, historic churches in Old Goa, and enjoy an evening Mandovi River cruise.' },
      { day: 4, title: 'Dudhsagar Waterfalls Trip', description: 'Take a thrilling jeep safari to the majestic Dudhsagar Waterfalls and explore the spice plantations.' },
      { day: 5, title: 'Water Sports & Beach Hopping', description: 'Indulge in exciting water sports like parasailing and jet skiing, followed by a relaxing evening.' },
      { day: 6, title: 'Departure', description: 'Check out from the hotel and transfer to the airport or railway station with beautiful memories.' }
    ]
  }
];

export const testimonials: Testimonial[] = [
  {
    id: '1', name: 'Mr Devarukhkar', location: 'Mumbai', destination: 'Himachal',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    rating: 5, review: 'Mr Devarukhkar and his wife enjoyed snow-covered rooftops, misty mornings, and scenic hill roads. It was a perfect blend of romance and winter charm.',
    tags: ['honeymoon', 'snowfall', 'romantic', 'mountains'], date: '3 days ago',
  },
  {
    id: '2', name: 'Prakhar & Priya', location: 'Delhi', destination: 'Switzerland',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    rating: 5, review: 'Our honeymoon in Switzerland was absolutely magical. The Alps were breathtaking. Highly recommended The Tribes of Travellers!',
    tags: ['honeymoon', 'romantic', 'mountains'], date: '1 week ago',
  },
  {
    id: '3', name: 'Balram & Family', location: 'Bangalore', destination: 'Japan',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    rating: 5, review: 'Japan exceeded all our expectations. The temples, sushi, and bullet trains made our family vacation unforgettable.',
    tags: ['family', 'culture', 'food'], date: '2 weeks ago',
  }
];

export const blogPosts: BlogPost[] = [
  {
    id: '1', title: '7 Stunning Bioluminescent Beaches in India in 2026',
    excerpt: 'Imagine walking alone at night, the gentle soothing sound of waves, the cool sand under your feet, and suddenly the water starts glowing with a magical blue light...',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    category: 'Destinations', date: '2026-01-15', slug: 'bioluminescence-beaches',
  },
  {
    id: '2', title: 'Swiss Alps: A Complete Travel Guide',
    excerpt: 'The Swiss Alps prove you don\'t always need remote expeditions to find natural beauty. From Zermatt to Interlaken...',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800',
    category: 'Destinations', date: '2026-01-12', slug: 'swiss-alps-guide',
  },
  {
    id: '3', title: 'Top 8 Cruises to Antarctica in 2026',
    excerpt: 'Let dreams set sail as you embrace the tides, for icy blue waters tend to longings and send the right vibes...',
    image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800',
    category: 'Travel Guide', date: '2026-01-03', slug: 'antarctica-cruises',
  },
];

export const themeCategories = [
  { id: 'honeymoon', name: 'Honeymoon / Romantic', destinations: 60, image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600', color: 'from-pink-500 to-rose-500' },
  { id: 'family', name: 'Family', destinations: 70, image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600', color: 'from-blue-500 to-cyan-500' },
  { id: 'friends', name: 'Friends / Group', destinations: 10, image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600', color: 'from-green-500 to-emerald-500' },
  { id: 'solo', name: 'Solo', destinations: 130, image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=600', color: 'from-orange-500 to-amber-500' },
  { id: 'adventure', name: 'Adventure', destinations: 30, image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=600', color: 'from-red-500 to-orange-500' },
  { id: 'nature', name: 'Nature', destinations: 100, image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600', color: 'from-emerald-500 to-green-500' },
  { id: 'religious', name: 'Religious', destinations: 60, image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600', color: 'from-purple-500 to-indigo-500' },
  { id: 'wildlife', name: 'Wildlife', destinations: 20, image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=600', color: 'from-yellow-600 to-amber-600' },
  { id: 'water', name: 'Water Activities', destinations: 20, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600', color: 'from-cyan-500 to-blue-500' },
];

export const getDestinationsByType = (type: string) => {
  return destinations.filter(d => d.type.includes(type));
};

export const getDestinationBySlug = (slug: string) => {
  return destinations.find(d => d.slug === slug);
};

const normalizeDestinationValue = (value: string) => {
  return value.trim().toLowerCase().replace(/[-_]+/g, ' ').replace(/\s+/g, ' ');
};

export const findDestinationByValue = (value: string) => {
  const normalizedValue = normalizeDestinationValue(value);

  if (!normalizedValue) {
    return undefined;
  }

  return destinations.find((destination) => {
    return normalizeDestinationValue(destination.name) === normalizedValue
      || normalizeDestinationValue(destination.slug) === normalizedValue;
  });
};

export const packageMatchesDestination = (pkg: Package, destinationValue: string) => {
  const normalizedValue = normalizeDestinationValue(destinationValue);

  if (!normalizedValue) {
    return false;
  }

  const matchedDestination = findDestinationByValue(destinationValue);
  const matchedPackageDestination = findDestinationByValue(pkg.destination);

  if (matchedDestination && matchedPackageDestination) {
    return matchedDestination.id === matchedPackageDestination.id;
  }

  return normalizeDestinationValue(pkg.destination) === normalizedValue;
};

export const getPackagesByDestination = (destinationValue: string) => {
  return packages.filter((pkg) => packageMatchesDestination(pkg, destinationValue));
};
