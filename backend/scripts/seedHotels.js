require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Hotel = require('../models/Hotel');

const hotels = [
  {
    name: 'The Leela Palace Udaipur',
    location: { lat: 24.5854, lng: 73.6836, address: 'Lake Pichola, Udaipur', city: 'Udaipur', state: 'Rajasthan', country: 'India' },
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
    pricePerNight: 25000,
    rating: 4.9,
    amenities: ['Pool', 'Spa', 'WiFi', 'Restaurant', 'Bar', 'Gym', 'Lake View', 'Butler Service'],
    description: 'A palatial luxury hotel on the banks of Lake Pichola offering stunning views and world-class service.',
    stars: 5,
    isActive: true,
  },
  {
    name: 'Taj Mahal Palace Mumbai',
    location: { lat: 18.9220, lng: 72.8332, address: 'Apollo Bunder, Colaba, Mumbai', city: 'Mumbai', state: 'Maharashtra', country: 'India' },
    images: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800'],
    pricePerNight: 30000,
    rating: 4.8,
    amenities: ['Pool', 'Spa', 'WiFi', 'Multiple Restaurants', 'Bar', 'Gym', 'Sea View', 'Concierge'],
    description: 'An iconic heritage hotel overlooking the Gateway of India, blending Moorish, Oriental, and Florentine styles.',
    stars: 5,
    isActive: true,
  },
  {
    name: 'The Oberoi Amarvilas Agra',
    location: { lat: 27.1751, lng: 78.0421, address: 'Taj East Gate Road, Agra', city: 'Agra', state: 'Uttar Pradesh', country: 'India' },
    images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800'],
    pricePerNight: 45000,
    rating: 4.9,
    amenities: ['Pool', 'Spa', 'WiFi', 'Restaurant', 'Bar', 'Gym', 'Taj Mahal View', 'Butler Service'],
    description: 'Every room and suite at Amarvilas offers uninterrupted views of the Taj Mahal, just 600 metres away.',
    stars: 5,
    isActive: true,
  },
  {
    name: 'Kumarakom Lake Resort',
    location: { lat: 9.6167, lng: 76.4333, address: 'Kumarakom, Kottayam', city: 'Kumarakom', state: 'Kerala', country: 'India' },
    images: ['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800'],
    pricePerNight: 18000,
    rating: 4.7,
    amenities: ['Pool', 'Spa', 'WiFi', 'Restaurant', 'Ayurveda', 'Backwater View', 'Houseboat', 'Yoga'],
    description: 'A heritage resort spread across 25 acres on the banks of Vembanad Lake, offering authentic Kerala experiences.',
    stars: 5,
    isActive: true,
  },
  {
    name: 'The Claridges New Delhi',
    location: { lat: 28.5994, lng: 77.2090, address: '12 Dr APJ Abdul Kalam Road, New Delhi', city: 'New Delhi', state: 'Delhi', country: 'India' },
    images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'],
    pricePerNight: 12000,
    rating: 4.5,
    amenities: ['Pool', 'Spa', 'WiFi', 'Restaurant', 'Bar', 'Gym', 'Business Center', 'Concierge'],
    description: 'A colonial-era luxury hotel in the heart of New Delhi, known for its timeless elegance and impeccable service.',
    stars: 5,
    isActive: true,
  },
  {
    name: 'Wildflower Hall Shimla',
    location: { lat: 31.1048, lng: 77.1734, address: 'Chharabra, Shimla', city: 'Shimla', state: 'Himachal Pradesh', country: 'India' },
    images: ['https://images.unsplash.com/photo-1626010448982-4d629b9c0223?w=800'],
    pricePerNight: 22000,
    rating: 4.8,
    amenities: ['Spa', 'WiFi', 'Restaurant', 'Bar', 'Gym', 'Mountain View', 'Trekking', 'Skiing'],
    description: 'Perched at 8,250 feet in the Himalayas, this former residence of Lord Kitchener offers breathtaking mountain views.',
    stars: 5,
    isActive: true,
  },
  {
    name: 'Goa Marriott Resort & Spa',
    location: { lat: 15.4909, lng: 73.8278, address: 'Miramar Beach, Panaji, Goa', city: 'Panaji', state: 'Goa', country: 'India' },
    images: ['https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800'],
    pricePerNight: 8500,
    rating: 4.4,
    amenities: ['Pool', 'Spa', 'WiFi', 'Restaurant', 'Bar', 'Gym', 'Beach Access', 'Water Sports'],
    description: 'A beachfront resort in Goa offering stunning views of the Arabian Sea with world-class amenities.',
    stars: 5,
    isActive: true,
  },
  {
    name: 'Ananda in the Himalayas',
    location: { lat: 30.1290, lng: 78.3200, address: 'The Palace Estate, Narendra Nagar, Tehri Garhwal', city: 'Rishikesh', state: 'Uttarakhand', country: 'India' },
    images: ['https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800'],
    pricePerNight: 35000,
    rating: 4.9,
    amenities: ['Spa', 'Yoga', 'WiFi', 'Restaurant', 'Pool', 'Gym', 'Ayurveda', 'Meditation', 'Himalayan View'],
    description: 'A destination spa resort in the Himalayan foothills, offering transformative wellness experiences.',
    stars: 5,
    isActive: true,
  },
  {
    name: 'Radisson Blu Resort Maldives',
    location: { lat: 4.1755, lng: 73.5093, address: 'Fonimagoodhoo Island, South Ari Atoll', city: 'South Ari Atoll', state: '', country: 'Maldives' },
    images: ['https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800'],
    pricePerNight: 55000,
    rating: 4.8,
    amenities: ['Overwater Villas', 'Pool', 'Spa', 'WiFi', 'Restaurant', 'Bar', 'Diving', 'Snorkeling', 'Water Sports'],
    description: 'A stunning overwater resort in the Maldives offering crystal-clear lagoons and vibrant coral reefs.',
    stars: 5,
    isActive: true,
  },
  {
    name: 'Aloft Dubai Creek',
    location: { lat: 25.2048, lng: 55.2708, address: 'Festival City, Dubai', city: 'Dubai', state: '', country: 'UAE' },
    images: ['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800'],
    pricePerNight: 12000,
    rating: 4.3,
    amenities: ['Pool', 'Gym', 'WiFi', 'Restaurant', 'Bar', 'Creek View', 'Business Center'],
    description: 'A modern hotel in Dubai Festival City with stunning views of the Dubai Creek and city skyline.',
    stars: 4,
    isActive: true,
  },
];

async function seedHotels() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  await Hotel.deleteMany({});
  await Hotel.insertMany(hotels);
  console.log(`✓ Seeded ${hotels.length} hotels`);

  console.log('Hotel seed complete!');
  process.exit(0);
}

seedHotels().catch(err => { console.error(err); process.exit(1); });
