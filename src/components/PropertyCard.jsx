import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Bed, Bath, Maximize } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFavorites } from '../context/FavoritesContext';
import { cn } from '../utils/cn';

const PropertyCard = ({ property }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(property.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-background-surface border border-border overflow-hidden rounded-sm hover:border-primary-gold transition-all duration-500"
    >
      <Link 
        to={`/property/${property.id}`} 
        className="relative block h-64 overflow-hidden"
        onClick={() => window.scrollTo(0, 0)}
      >
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className={cn(
            "label-caps px-3 py-1 text-[10px] font-bold text-background",
            property.status === 'sale' ? "bg-primary-gold" : "bg-status-success"
          )}>
            For {property.status === 'sale' ? 'Sale' : 'Rent'}
          </span>
          {property.featured && (
            <span className="label-caps px-3 py-1 text-[10px] font-bold bg-background text-primary-gold border border-primary-gold">
              Featured
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(property.id);
          }}
          className="absolute top-4 right-4 p-2 bg-background/50 backdrop-blur-md rounded-full text-text-primary hover:text-primary-gold transition-colors z-10"
        >
          <Heart className={cn("w-4 h-4", favorite && "fill-primary-gold text-primary-gold")} />
        </button>
      </Link>

      <div className="p-6">
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center gap-1 text-text-secondary text-[10px] uppercase tracking-widest font-cormorant">
            <MapPin className="w-3 h-3 text-primary-gold" />
            <span>{property.location.area}, {property.location.city}</span>
          </div>
          <Link 
            to={`/property/${property.id}`} 
            className="block"
            onClick={() => window.scrollTo(0, 0)}
          >
            <h3 className="font-playfair text-xl text-text-primary group-hover:text-primary-gold transition-colors line-clamp-1">
              {property.title}
            </h3>
          </Link>
          <p className="price-tag text-2xl">
            ₦{property.price.toLocaleString()}
            {property.status === 'rent' && <span className="text-sm font-normal text-text-secondary ml-1">/ year</span>}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border text-text-secondary">
          <div className="flex items-center gap-1.5">
            <Bed className="w-4 h-4 text-primary-gold" />
            <span className="text-xs font-inter">{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="w-4 h-4 text-primary-gold" />
            <span className="text-xs font-inter">{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Maximize className="w-4 h-4 text-primary-gold" />
            <span className="text-xs font-inter">{property.size} sqm</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
