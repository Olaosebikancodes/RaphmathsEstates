import React from "react";
import { Link } from "react-router-dom";
import { Heart, MapPin, Bed, Bath, Maximize } from "lucide-react";
import { motion } from "framer-motion";
import { useFavorites } from "../context/FavoritesContext";
import { cn } from "../utils/cn";

const PropertyCard = ({ property }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(property.id);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="group bg-background-surface border border-border overflow-hidden hover:border-primary-gold/50 transition-colors duration-500"
    >
      <Link
        to={`/property/${property.id}`}
        className="relative block h-60 overflow-hidden"
        onClick={() => window.scrollTo(0, 0)}
      >
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent opacity-70" />

        {/* Status badge */}
        <div className="absolute top-4 left-4">
          <span
            className={cn(
              "font-cormorant uppercase tracking-widest px-3 py-1 text-[10px] font-bold text-background",
              property.status === "sale" ? "bg-primary-gold" : "bg-status-success"
            )}
          >
            For {property.status === "sale" ? "Sale" : "Rent"}
          </span>
          {property.featured && (
            <span className="block mt-1.5 font-cormorant uppercase tracking-widest px-3 py-1 text-[10px] font-bold bg-background/80 text-primary-gold border border-primary-gold/60">
              Featured
            </span>
          )}
        </div>

        {/* Favorite */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(property.id);
          }}
          className="absolute top-4 right-4 p-2 bg-background/60 backdrop-blur-md text-text-primary hover:text-primary-gold transition-colors z-10 active:scale-[0.95]"
          aria-label={favorite ? "Remove from saved" : "Save property"}
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-all duration-300",
              favorite && "fill-primary-gold text-primary-gold"
            )}
          />
        </button>
      </Link>

      <div className="p-5 md:p-6">
        <div className="flex items-center gap-1.5 text-text-secondary text-[10px] uppercase tracking-widest font-cormorant mb-2">
          <MapPin className="w-3 h-3 text-primary-gold flex-shrink-0" />
          <span>
            {property.location.area}, {property.location.city}
          </span>
        </div>

        <Link
          to={`/property/${property.id}`}
          className="block mb-3"
          onClick={() => window.scrollTo(0, 0)}
        >
          <h3 className="font-playfair text-lg text-text-primary group-hover:text-primary-gold transition-colors duration-300 line-clamp-1">
            {property.title}
          </h3>
        </Link>

        <p className="font-inter font-bold text-primary-gold text-xl mb-5">
          {"₦"}{property.price.toLocaleString()}
          {property.status === "rent" && (
            <span className="text-xs font-normal text-text-secondary ml-1">
              / year
            </span>
          )}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-border text-text-secondary">
          <div className="flex items-center gap-1.5">
            <Bed className="w-3.5 h-3.5 text-primary-gold" />
            <span className="text-xs font-inter">{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="w-3.5 h-3.5 text-primary-gold" />
            <span className="text-xs font-inter">{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Maximize className="w-3.5 h-3.5 text-primary-gold" />
            <span className="text-xs font-inter">{property.size} sqm</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
