import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  Heart,
  Share2,
  Check,
  Phone,
  MessageCircle,
  Mail,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Instagram,
  Twitter,
  Facebook,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useProperties } from "../context/PropertyContext";
import { useFavorites } from "../context/FavoritesContext";
import { useToast } from "../context/ToastContext";
import PropertyCard from "../components/PropertyCard";
import { cn } from "../utils/cn";
import { trackPropertyClick, getUser } from "../lib/supabase";

// Custom Marker Icon
const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const PropertyDetail = () => {
  const { id } = useParams();
  const { getPropertyById, properties } = useProperties();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { showToast } = useToast();
  const [activeImage, setActiveImage] = useState(0);
  const [property, setProperty] = useState(null);
  const [isAdminView, setIsAdminView] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
      } = await getUser();
      if (user) setIsAdminView(true);
    };
    checkAdmin();

    const found = getPropertyById(id);
    if (found) {
      setProperty(found);
      window.scrollTo(0, 0);
      trackPropertyClick(id);
    }
  }, [id, getPropertyById]);

  const handleShare = async () => {
    if (!property) return;
    const shareData = {
      title: property.title,
      text: property.description,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Link copied to clipboard!", "success");
      }
    } catch (err) {
      console.error("Error sharing:", err);
      showToast("Failed to share property", "error");
    }
  };

  if (!property)
    return (
      <div className="pt-32 pb-20 text-center">
        <h2 className="text-2xl font-playfair text-text-primary">
          Property not found
        </h2>
        <Link
          to="/listings"
          className="text-primary-gold hover:underline mt-4 inline-block"
        >
          Back to Listings
        </Link>
      </div>
    );

  const favorite = isFavorite(property.id);
  const similarListings = properties
    .filter(
      (p) =>
        p.id !== property.id &&
        (p.location.city === property.location.city ||
          p.type === property.type),
    )
    .slice(0, 3);

  return (
    <div key={id} className="bg-background min-h-screen">
      {/* Top Bar */}
      <div className="pt-24 md:pt-32 px-6 md:px-12 mb-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(isAdminView ? "/admin" : "/listings")}
            className="flex items-center gap-2 text-text-secondary hover:text-primary-gold transition-colors font-inter text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            {isAdminView ? "Back to Dashboard" : "Back to Collection"}
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={() => toggleFavorite(property.id)}
              className="p-2 border border-border rounded-full text-text-primary hover:text-primary-gold transition-colors"
            >
              <Heart
                className={cn(
                  "w-4 h-4",
                  favorite && "fill-primary-gold text-primary-gold",
                )}
              />
            </button>
            <div className="relative">
              <button
                onClick={handleShare}
                className="p-2 border border-border rounded-full text-text-primary hover:text-primary-gold transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <section className="px-6 md:px-12 mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-sm mb-4">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                src={property.images[activeImage]}
                alt={property.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Gallery Controls */}
            <button
              onClick={() =>
                setActiveImage((prev) =>
                  prev === 0 ? property.images.length - 1 : prev - 1,
                )
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-background/50 backdrop-blur-md text-text-primary hover:text-primary-gold transition-colors rounded-full"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() =>
                setActiveImage((prev) =>
                  prev === property.images.length - 1 ? 0 : prev + 1,
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-background/50 backdrop-blur-md text-text-primary hover:text-primary-gold transition-colors rounded-full"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Status Badge */}
            <div className="absolute top-6 left-6">
              <span
                className={cn(
                  "label-caps px-4 py-1.5 text-xs font-bold text-background",
                  property.status === "sale"
                    ? "bg-primary-gold"
                    : "bg-status-success",
                )}
              >
                For {property.status === "sale" ? "Sale" : "Rent"}
              </span>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {property.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={cn(
                  "flex-shrink-0 w-24 h-16 md:w-32 md:h-20 rounded-sm overflow-hidden border-2 transition-all",
                  activeImage === idx
                    ? "border-primary-gold scale-95"
                    : "border-transparent opacity-60 hover:opacity-100",
                )}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-6 md:px-12 pb-32">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Left Column - Details */}
          <div className="lg:col-span-2">
            <div className="mb-12">
              <div className="flex items-center gap-2 text-text-secondary text-xs uppercase tracking-[0.2em] font-cormorant mb-4">
                <MapPin className="w-3 h-3 text-primary-gold" />
                <span>
                  {property.location.area}, {property.location.city}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-text-primary mb-6">
                {property.title}
              </h1>
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-6 md:gap-12 py-8 border-y border-border">
                <div className="flex flex-col gap-1 w-full sm:w-auto">
                  <span className="label-caps text-[10px] text-text-secondary">
                    Price
                  </span>
                  <span className="price-tag text-2xl md:text-3xl font-bold">
                    ₦{property.price.toLocaleString()}
                    {property.status === "rent" && (
                      <span className="text-sm font-normal text-text-secondary ml-1">
                        / year
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-6 sm:gap-12">
                  <div className="flex flex-col gap-1">
                    <span className="label-caps text-[10px] text-text-secondary">
                      Bedrooms
                    </span>
                    <div className="flex items-center gap-2">
                      <Bed className="w-5 h-5 text-primary-gold" />
                      <span className="text-xl font-playfair font-bold text-text-primary">
                        {property.bedrooms}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="label-caps text-[10px] text-text-secondary">
                      Bathrooms
                    </span>
                    <div className="flex items-center gap-2">
                      <Bath className="w-5 h-5 text-primary-gold" />
                      <span className="text-xl font-playfair font-bold text-text-primary">
                        {property.bathrooms}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="label-caps text-[10px] text-text-secondary">
                      Property Size
                    </span>
                    <div className="flex items-center gap-2">
                      <Maximize className="w-5 h-5 text-primary-gold" />
                      <span className="text-xl font-playfair font-bold text-text-primary">
                        {property.size} sqm
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-16">
              <h3 className="text-2xl font-playfair font-bold text-text-primary mb-6">
                Description
              </h3>
              <p className="text-text-secondary leading-relaxed font-inter text-lg">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="mb-16">
              <h3 className="text-2xl font-playfair font-bold text-text-primary mb-6">
                Amenities
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {property.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 text-text-secondary"
                  >
                    <div className="w-5 h-5 bg-primary-gold/10 border border-primary-gold/20 flex items-center justify-center rounded-sm">
                      <Check className="w-3 h-3 text-primary-gold" />
                    </div>
                    <span className="text-sm font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div>
              <h3 className="text-2xl font-playfair font-bold text-text-primary mb-6">
                Location
              </h3>
              <div className="h-96 w-full rounded-sm overflow-hidden border border-border">
                <MapContainer
                  center={[
                    property.location.coordinates.lat,
                    property.location.coordinates.lng,
                  ]}
                  zoom={15}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker
                    position={[
                      property.location.coordinates.lat,
                      property.location.coordinates.lng,
                    ]}
                    icon={customIcon}
                  >
                    <Popup>
                      <div className="font-playfair font-bold text-background">
                        {property.title}
                      </div>
                      <div className="text-xs text-background/80">
                        {property.location.area}, {property.location.city}
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </div>

          {/* Right Column - Agent & Contact */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 flex flex-col gap-8">
              {/* Agent Card */}
              <div className="bg-background-surface border border-border p-8 rounded-sm shadow-xl">
                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border">
                  <img
                    src={property.agent.photo}
                    alt={property.agent.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-primary-gold"
                  />
                  <div>
                    <h4 className="font-playfair font-bold text-xl text-text-primary mb-1">
                      {property.agent.name}
                    </h4>
                    <p className="label-caps text-[10px] text-primary-gold font-bold">
                      {property.agent.role || "Luxury Property Expert"}
                    </p>
                    {property.agent.social && (
                      <div className="flex items-center gap-3 mt-3">
                        {property.agent.social.instagram && (
                          <a
                            href={property.agent.social.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-text-secondary hover:text-primary-gold transition-colors"
                          >
                            <Instagram className="w-4 h-4" />
                          </a>
                        )}
                        {property.agent.social.twitter && (
                          <a
                            href={property.agent.social.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-text-secondary hover:text-primary-gold transition-colors"
                          >
                            <Twitter className="w-4 h-4" />
                          </a>
                        )}
                        {property.agent.social.facebook && (
                          <a
                            href={property.agent.social.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-text-secondary hover:text-primary-gold transition-colors"
                          >
                            <Facebook className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-4 mb-8">
                  <a
                    href={`tel:${property.agent.phone}`}
                    className="flex items-center justify-center gap-3 w-full py-4 bg-background border border-border text-text-primary hover:border-primary-gold transition-colors font-bold text-xs uppercase tracking-widest"
                  >
                    <Phone className="w-4 h-4" />
                    Call Agent
                  </a>
                  <a
                    href={`https://wa.me/${property.agent.whatsapp}`}
                    className="flex items-center justify-center gap-3 w-full py-4 bg-status-success text-background hover:opacity-90 transition-opacity font-bold text-xs uppercase tracking-widest"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                </div>

                {/* Contact Form */}
                <form className="flex flex-col gap-4">
                  <h5 className="font-playfair font-bold text-lg text-text-primary mb-2">
                    Request Information
                  </h5>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="bg-background border border-border p-3 text-sm font-inter text-text-primary outline-none focus:border-primary-gold rounded-sm"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="bg-background border border-border p-3 text-sm font-inter text-text-primary outline-none focus:border-primary-gold rounded-sm"
                  />
                  <textarea
                    rows="4"
                    placeholder="Your Message"
                    className="bg-background border border-border p-3 text-sm font-inter text-text-primary outline-none focus:border-primary-gold rounded-sm resize-none"
                    defaultValue={`I'm interested in the ${property.title} in ${property.location.city}. Please send more details.`}
                  ></textarea>
                  <button className="w-full py-4 bg-primary-gold text-background font-bold text-xs uppercase tracking-widest hover:bg-primary-lightGold transition-all">
                    Send Inquiry
                  </button>
                </form>
              </div>

              {/* Similar Listings Mini-section */}
              <div>
                <h4 className="label-caps text-primary-gold mb-6">
                  Similar Listings
                </h4>
                <div className="flex flex-col gap-6">
                  {similarListings.map((item) => (
                    <Link
                      key={item.id}
                      to={`/property/${item.id}`}
                      className="flex gap-4 group"
                      onClick={() => window.scrollTo(0, 0)}
                    >
                      <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-sm">
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h5 className="font-playfair font-bold text-text-primary group-hover:text-primary-gold transition-colors line-clamp-1">
                          {item.title}
                        </h5>
                        <p className="text-primary-gold font-bold text-sm">
                          ₦{item.price.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-text-secondary uppercase tracking-widest mt-1">
                          {item.location.city}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Section */}
      {similarListings.length > 0 && (
        <section className="py-20 md:py-32 px-6 md:px-12 bg-background-surface">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
              <div>
                <h4 className="label-caps text-primary-gold mb-4 tracking-[0.2em]">
                  Recommendations
                </h4>
                <h2 className="text-4xl font-playfair font-bold text-text-primary">
                  Curated for You
                </h2>
              </div>
              <Link
                to="/listings"
                className="text-primary-gold font-bold text-xs uppercase tracking-widest hover:text-primary-lightGold transition-colors"
              >
                View All Listings
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {similarListings.map((item) => (
                <PropertyCard key={item.id} property={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default PropertyDetail;
