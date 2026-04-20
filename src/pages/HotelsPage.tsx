import { useEffect, useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { api } from '../lib/api';
import { Star, MapPin, IndianRupee } from 'lucide-react';

interface Hotel {
  _id: string;
  name: string;
  location: { lat: number; lng: number; address: string; city: string; state: string; country: string };
  images: string[];
  pricePerNight: number;
  rating: number;
  amenities: string[];
  description: string;
  stars: number;
}

const INDIA_CENTER = { lat: 20.5937, lng: 78.9629 };

// Sample hotels for when API is not connected
const SAMPLE_HOTELS: Hotel[] = [
  { _id: '1', name: 'The Leela Palace Goa', location: { lat: 15.2993, lng: 74.1240, address: 'Cavelossim Beach', city: 'Goa', state: 'Goa', country: 'India' }, images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'], pricePerNight: 18000, rating: 4.8, amenities: ['Pool', 'Spa', 'Beach Access', 'Restaurant'], description: 'Luxury beachfront resort in South Goa.', stars: 5 },
  { _id: '2', name: 'Taj Lake Palace Udaipur', location: { lat: 24.5764, lng: 73.6831, address: 'Lake Pichola', city: 'Udaipur', state: 'Rajasthan', country: 'India' }, images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'], pricePerNight: 35000, rating: 4.9, amenities: ['Pool', 'Spa', 'Lake View', 'Fine Dining'], description: 'Iconic palace hotel on Lake Pichola.', stars: 5 },
  { _id: '3', name: 'Wildflower Hall Shimla', location: { lat: 31.1048, lng: 77.1734, address: 'Chharabra', city: 'Shimla', state: 'Himachal Pradesh', country: 'India' }, images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'], pricePerNight: 22000, rating: 4.7, amenities: ['Spa', 'Mountain View', 'Trekking', 'Restaurant'], description: 'Luxury mountain retreat in the Himalayas.', stars: 5 },
  { _id: '4', name: 'Houseboat Stay Kerala', location: { lat: 9.4981, lng: 76.3388, address: 'Alleppey Backwaters', city: 'Alleppey', state: 'Kerala', country: 'India' }, images: ['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800'], pricePerNight: 8500, rating: 4.6, amenities: ['Backwater View', 'Meals Included', 'AC', 'Guided Tour'], description: 'Traditional Kerala houseboat experience.', stars: 4 },
];

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>(SAMPLE_HOTELS);
  const [filtered, setFiltered] = useState<Hotel[]>(SAMPLE_HOTELS);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [filters, setFilters] = useState({ state: '', country: '', minPrice: '', maxPrice: '' });
  const [_map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  useEffect(() => {
    api.get('/hotels').then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setHotels(data);
        setFiltered(data);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    let result = hotels;
    if (filters.state) result = result.filter(h => h.location.state?.toLowerCase().includes(filters.state.toLowerCase()));
    if (filters.country) result = result.filter(h => h.location.country?.toLowerCase().includes(filters.country.toLowerCase()));
    if (filters.minPrice) result = result.filter(h => h.pricePerNight >= Number(filters.minPrice));
    if (filters.maxPrice) result = result.filter(h => h.pricePerNight <= Number(filters.maxPrice));
    setFiltered(result);
  }, [filters, hotels]);

  const onLoad = useCallback((m: google.maps.Map) => setMap(m), []);

  const handleMarkerClick = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setHighlightedId(hotel._id);
    document.getElementById(`hotel-${hotel._id}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <div className="bg-[#FF6B00] text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold font-heading mb-2">Hotels & Stays</h1>
          <p className="text-white/80">Find the perfect stay across India and beyond</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap gap-4">
          {[
            { key: 'state', placeholder: 'Filter by State (e.g. Goa)' },
            { key: 'country', placeholder: 'Filter by Country' },
            { key: 'minPrice', placeholder: 'Min Price/Night (₹)' },
            { key: 'maxPrice', placeholder: 'Max Price/Night (₹)' },
          ].map(({ key, placeholder }) => (
            <input
              key={key}
              type={key.includes('Price') ? 'number' : 'text'}
              placeholder={placeholder}
              value={filters[key as keyof typeof filters]}
              onChange={e => setFilters(f => ({ ...f, [key]: e.target.value }))}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00] flex-1 min-w-[180px]"
            />
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Hotel Cards */}
          <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
            {filtered.map(hotel => (
              <div
                key={hotel._id}
                id={`hotel-${hotel._id}`}
                onClick={() => { setHighlightedId(hotel._id); setSelectedHotel(hotel); }}
                className={`bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer transition-all hover:shadow-md ${highlightedId === hotel._id ? 'ring-2 ring-[#FF6B00]' : ''}`}
              >
                <div className="flex">
                  <img src={hotel.images[0]} alt={hotel.name} className="w-36 h-28 object-cover shrink-0" />
                  <div className="p-4 flex-1">
                    <h3 className="font-semibold font-heading text-[#1A1A1A] mb-1">{hotel.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                      <MapPin className="w-3 h-3" />
                      <span>{hotel.location.city}, {hotel.location.state}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{hotel.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#FF6B00] font-bold">
                        <IndianRupee className="w-4 h-4" />
                        <span>{hotel.pricePerNight.toLocaleString()}/night</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {hotel.amenities.slice(0, 3).map(a => (
                        <span key={a} className="text-xs bg-orange-50 text-[#FF6B00] px-2 py-0.5 rounded-full">{a}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <p className="text-center text-gray-400 py-12">No hotels match your filters.</p>}
          </div>

          {/* Google Map */}
          <div className="rounded-xl overflow-hidden shadow-sm h-[700px] sticky top-4">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={filtered[0]?.location ? { lat: filtered[0].location.lat, lng: filtered[0].location.lng } : INDIA_CENTER}
                zoom={filtered.length === 1 ? 12 : 5}
                onLoad={onLoad}
                options={{ styles: [{ featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] }] }}
              >
                {filtered.map(hotel => (
                  <Marker
                    key={hotel._id}
                    position={{ lat: hotel.location.lat, lng: hotel.location.lng }}
                    onClick={() => handleMarkerClick(hotel)}
                    icon={{
                      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="${highlightedId === hotel._id ? '#FF6B00' : '#1A1A1A'}" stroke="white" stroke-width="2"/><text x="16" y="21" text-anchor="middle" fill="white" font-size="12" font-family="Arial">H</text></svg>`)}`,
                      scaledSize: new window.google.maps.Size(32, 32),
                    }}
                  />
                ))}
                {selectedHotel && (
                  <InfoWindow
                    position={{ lat: selectedHotel.location.lat, lng: selectedHotel.location.lng }}
                    onCloseClick={() => setSelectedHotel(null)}
                  >
                    <div className="p-1 max-w-[200px]">
                      <img src={selectedHotel.images[0]} alt="" className="w-full h-24 object-cover rounded mb-2" />
                      <p className="font-semibold text-sm">{selectedHotel.name}</p>
                      <p className="text-xs text-gray-500">{selectedHotel.location.city}</p>
                      <p className="text-xs font-bold text-[#FF6B00] mt-1">₹{selectedHotel.pricePerNight.toLocaleString()}/night</p>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500 text-sm">Loading map...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
