import { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Banner {
  _id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

// Fallback banners if API not available
const FALLBACK_BANNERS: Banner[] = [
  { _id: '1', imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600', title: "Discover India's Hidden Gems", subtitle: '650+ Travel Agents · 65+ Destinations · Best Prices Guaranteed', ctaText: 'Explore Packages', ctaLink: '/tour-packages' },
  { _id: '2', imageUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1600', title: 'Maldives Honeymoon Packages', subtitle: 'Starting from ₹73,999 per person · All Inclusive', ctaText: 'Book Now', ctaLink: '/packages/maldives-south-palm-resort-package' },
  { _id: '3', imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1600', title: 'Bali — Island of the Gods', subtitle: 'Exclusive 7-day packages from ₹49,000', ctaText: 'View Packages', ctaLink: '/destination/bali' },
];

export default function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>(FALLBACK_BANNERS);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    api.get('/banners?active=true').then(data => {
      if (Array.isArray(data) && data.length > 0) setBanners(data);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => emblaApi.scrollNext(), 4000);
    emblaApi.on('select', () => setCurrent(emblaApi.selectedScrollSnap()));
    return () => clearInterval(interval);
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative w-full overflow-hidden" style={{ height: '520px' }}>
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {banners.map((banner) => (
            <div key={banner._id} className="relative flex-none w-full h-full">
              <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-xl">
                    <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4 leading-tight font-heading">
                      {banner.title}
                    </h1>
                    <p className="text-lg text-white/90 mb-8">{banner.subtitle}</p>
                    {banner.ctaText && (
                      <Link
                        to={banner.ctaLink || '/tour-packages'}
                        className="inline-block bg-[#FF6B00] hover:bg-[#E55A00] text-white font-semibold px-8 py-3 rounded-lg transition shadow-lg"
                      >
                        {banner.ctaText}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button onClick={scrollPrev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition backdrop-blur-sm">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button onClick={scrollNext} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition backdrop-blur-sm">
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-white w-6' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
}
