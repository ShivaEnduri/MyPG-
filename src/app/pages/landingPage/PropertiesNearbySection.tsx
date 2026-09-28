


import React, { useEffect, useState } from "react";
import { usePgInfoStore } from "../../shared/store/pgInfoStore";
import { usePgInfoMediaStore } from "../../shared/store/mediaStore";
import { useAuth, useAuthModal } from "@/hooks/context/AuthContext";

import Modal from "../../shared/components/Modal";
import { usePgLocationStore } from "../../shared/store/pgLocationStore";
import { usePgDescriptionStore } from "../../shared/store/descriptionsStore";

export interface Property {
  id: string | number;
  images: string[];
  videos: string[];
  title: string;
  location: string;
  features: string;
  price: string;
}

export interface SearchFilters {
  stateId?: string;
  cityId?: string;
  pgType?: string;
  pgCategory?: string;
  pgAmenity?: string;
}

export interface PropertiesNearbySectionProps {
  title?: string;
  exploreMoreText?: string;
  onBookNow?: (propertyId: string | number) => void;
  onExploreMore?: () => void;
  maxProperties?: number;
  searchFilters?: SearchFilters | null;
}

// Carousel component for each property
const PropertyCarousel: React.FC<{
  images: string[];
  videos: string[];
  title: string;
  location: string;
}> = ({ images, videos, title, location }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const allMedia = [...images, ...videos];
  const totalSlides = allMedia.length;

  

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const isVideo = (index: number) => {
    return index >= images.length;
  };

  if (totalSlides === 0) {
    return (
      <div className="w-full h-48 sm:h-56 bg-gray-200 flex items-center justify-center">
        <span className="text-gray-400">No Media Available</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-48 sm:h-56 overflow-hidden bg-gray-900 group">
      {/* Media Display */}
      <div className="relative w-full h-full">
        {allMedia.map((media, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            {isVideo(index) ? (
              <video
                src={media}
                className="w-full h-full object-cover"
                controls
                controlsList="nodownload"
                onError={(e) => {
                  console.error("Video load error:", media);
                }}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={media}
                alt={`${title} - ${location} - ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/400x300?text=Image+Not+Found";
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Only show if more than 1 media */}
      {totalSlides > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
            aria-label="Previous media"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
            aria-label="Next media"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.5 15L12.5 10L7.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {totalSlides > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {allMedia.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? "bg-white w-6"
                  : "bg-white/60 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Media Type Indicator */}
      <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded z-10">
        {currentIndex + 1} / {totalSlides}
        {isVideo(currentIndex) && " (Video)"}
      </div>
    </div>
  );
};

export const PropertiesNearbySection: React.FC<PropertiesNearbySectionProps> = ({
  title = "MyPG Properties",
  exploreMoreText = "Explore More",
  onBookNow,
  onExploreMore,
  maxProperties = 6,
  searchFilters,
}) => {
  const { pgInfoList, loading, error, fetchPgInfo } = usePgInfoStore();
  const { mediaList, fetchPgInfoMedia, getMediaByPgId } = usePgInfoMediaStore();

  const { user } = useAuth();
const { openModal } = useAuthModal();

const [isBookingOpen, setIsBookingOpen] = useState(false);
const [selectedPropertyId, setSelectedPropertyId] = useState<string | number | null>(null);

const { states, cities, fetchStates, fetchCities, clearCities } =
  usePgLocationStore();

const { descriptions, fetchDescriptions } = usePgDescriptionStore();


const [bookingForm, setBookingForm] = useState({
  name: "",
  mobile: "",
  state_id: "",
  city_id: "",
  occupation_id: "",
});

  useEffect(() => {
    // Fetch media on mount
    fetchPgInfoMedia();
  }, [fetchPgInfoMedia]);

  // Fetch PG info based on filters
  useEffect(() => {
  const hasFilters =
    searchFilters && Object.values(searchFilters).some((val) => val);

  if (hasFilters && searchFilters) {
    const params: Record<string, string> = {};

    if (searchFilters.stateId)
      params.pg_state = searchFilters.stateId;

    if (searchFilters.cityId)
      params.pg_city = searchFilters.cityId;

    if (searchFilters.pgType)
      params.pg_type_id = searchFilters.pgType;

    if (searchFilters.pgCategory)
      params.pg_cat = searchFilters.pgCategory;

    if (searchFilters.pgAmenity)
  params.amns_info = searchFilters.pgAmenity;

   

    fetchPgInfo(params); 
  } else {
    fetchPgInfo(); // fetch all
  }
}, [searchFilters, fetchPgInfo]);

useEffect(() => {
  if (isBookingOpen) {
    fetchStates();
    fetchDescriptions();

    if (user) {
      setBookingForm((prev) => ({
        ...prev,
        name: user.name || "",
        mobile: user.mobile || "",
      }));
    }
  }
}, [isBookingOpen]);

 // Transform API data to Property format
const properties: Property[] = pgInfoList.slice(0, maxProperties).map((pg) => {
  const media = getMediaByPgId(pg.pg_id);

  return {
    id: pg.pg_id,
    images: media?.images || [],      
    videos: media?.videos || [], 
    title: pg.pg_name,
    location: `${pg.pg_major_area || pg.pg_address}, ${pg.pg_name}`,
features: `${pg.pg_desc} | ${pg.pg_type} | ${pg.pg_cat}`,
    price: "₹5000/mo",
  };
});

  // Update title based on search filters
  const displayTitle = searchFilters && Object.values(searchFilters).some(val => val)
    ? "Search Results"
    : title;

     

  if (loading) {
    return (
      <section className="w-full py-16 sm:py-20 px-4">
        <div className="max-w-6xl md:max-w-2xl lg:max-w-6xl mx-auto">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-gray-600 font-poppins text-lg">Loading properties...</div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full py-16 sm:py-20 px-4">
        <div className="max-w-6xl md:max-w-2xl lg:max-w-6xl mx-auto">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-red-600 font-poppins text-lg">{error}</div>
          </div>
        </div>
      </section>
    );
  }

  if (properties.length === 0) {
    return (
      <section className="w-full py-16 sm:py-20 px-4">
        <div className="max-w-6xl md:max-w-2xl lg:max-w-6xl mx-auto">
          <h2 className="text-gray font-poppins font-bold text-3xl sm:text-2xl md:text-5xl text-center mb-12 md:mb-16">
            {displayTitle}
          </h2>
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="text-gray-600 font-poppins text-lg">
              {searchFilters ? "No properties found matching your criteria" : "No properties available"}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-16 sm:py-20 px-4">
      <div className="max-w-6xl md:max-w-2xl lg:max-w-6xl mx-auto">
        {/* Section Title */}
        <h2 className="text-gray font-poppins font-bold text-3xl sm:text-2xl md:text-5xl text-center mb-12 md:mb-16">
          {displayTitle}
        </h2>

        {/* Active Filters Display */}
        {searchFilters && Object.values(searchFilters).some(val => val) && (
          <div className="mb-8 flex flex-wrap gap-2 justify-center">
            {searchFilters.stateId && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                State Filter Applied
              </span>
            )}
            {searchFilters.cityId && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                City Filter Applied
              </span>
            )}
            {searchFilters.pgType && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                PG Type Filter Applied
              </span>
            )}
            {searchFilters.pgCategory && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                Category Filter Applied
              </span>
            )}
            {searchFilters.pgAmenity && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                Amenity Filter Applied
              </span>
            )}
          </div>
        )}

        {/* Properties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {properties.map((property) => (

           
            <div
              key={property.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {/* Property Carousel */}
              <PropertyCarousel
                images={property.images}
                videos={property.videos}
                title={property.title}
                location={property.location}
              />

              {/* Property Details */}
              <div className="p-5 sm:p-6">
                {/* Title and Location */}
                <h3 className="text-gray-900 font-poppins font-semibold text-lg sm:text-xl mb-2">
                  {property.title}, {property.location}
                </h3>

                {/* Features */}
                <p className="text-gray-600 font-poppins text-sm sm:text-base mb-4">
                  {property.features}
                </p>

                {/* Price and Book Now Button */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 font-poppins font-bold text-lg sm:text-xl">
                    {property.price}
                  </span>
                  <button
                   onClick={() => {
  if (!user) {
    openModal(); // open login modal
    return;
  }

  setSelectedPropertyId(property.id);
  setIsBookingOpen(true);
}}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-poppins font-semibold text-sm sm:text-base px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg transition-colors duration-200"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

       
      </div>
      <Modal
  open={isBookingOpen}
  onClose={() => {
    setIsBookingOpen(false);
    clearCities();
  }}
  title="Book PG"
  size="md"
>
  <div className="space-y-4">

    {/* Name */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Full Name
      </label>
      <input
        type="text"
        value={bookingForm.name}
        onChange={(e) =>
          setBookingForm({ ...bookingForm, name: e.target.value })
        }
        className="w-full border rounded-lg px-3 py-2"
      />
    </div>

    {/* Mobile */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Mobile
      </label>
      <input
        type="text"
        value={bookingForm.mobile}
        onChange={(e) =>
          setBookingForm({ ...bookingForm, mobile: e.target.value })
        }
        className="w-full border rounded-lg px-3 py-2"
      />
    </div>

    {/* State */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Your State
      </label>
      <select
        value={bookingForm.state_id}
        onChange={(e) => {
          const stateId = e.target.value;
          setBookingForm({
            ...bookingForm,
            state_id: stateId,
            city_id: "",
          });
          fetchCities(Number(stateId));
        }}
        className="w-full border rounded-lg px-3 py-2"
      >
        <option value="">Select State</option>
        {states.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
    </div>

    {/* City */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Your City
      </label>
      <select
        value={bookingForm.city_id}
        onChange={(e) =>
          setBookingForm({ ...bookingForm, city_id: e.target.value })
        }
        className="w-full border rounded-lg px-3 py-2"
      >
        <option value="">Select City</option>
        {cities.map((c) => (
          <option key={c.id} value={c.id}>
            {c.city}
          </option>
        ))}
      </select>
    </div>

   

    {/* Submit */}
    <div className="pt-4">
      <button
        onClick={() => {
          console.log("Booking Data:", {
            propertyId: selectedPropertyId,
            ...bookingForm,
          });

          // 🔥 Call API here later

          setIsBookingOpen(false);
        }}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg"
      >
        Confirm Booking
      </button>
    </div>
  </div>
</Modal>
    </section>
  );
};