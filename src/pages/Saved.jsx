import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFavorites } from '../context/FavoritesContext';
import { useProperties } from '../context/PropertyContext';
import PropertyCard from '../components/PropertyCard';

const Saved = () => {
  const { favorites } = useFavorites();
  const { properties } = useProperties();

  const savedProperties = properties.filter(p => favorites.includes(p.id));

  return (
    <div className="pt-32 pb-20 px-6 md:px-12 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-border">
          <div>
            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-text-primary mb-4">
              Your Favorites
            </h1>
            <p className="text-text-secondary font-inter">
              {savedProperties.length} properties saved to your collection.
            </p>
          </div>
          <Link 
            to="/listings" 
            className="text-primary-gold hover:text-primary-lightGold transition-colors font-bold text-xs uppercase tracking-widest flex items-center gap-2 group"
          >
            Browse More
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
          </Link>
        </div>

        {savedProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-24 h-24 bg-background-surface border border-border flex items-center justify-center rounded-full mb-8">
              <Heart className="w-10 h-10 text-text-secondary opacity-30" />
            </div>
            <h2 className="text-3xl font-playfair font-bold text-text-primary mb-4">Your collection is empty</h2>
            <p className="text-text-secondary mb-12 max-w-sm leading-relaxed">
              Start exploring our premium listings and save the ones that catch your eye for later review.
            </p>
            <Link 
              to="/listings" 
              className="px-12 py-4 bg-primary-gold text-background font-bold text-xs uppercase tracking-widest hover:bg-primary-lightGold transition-all rounded-sm shadow-xl"
            >
              Start Browsing
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Saved;
