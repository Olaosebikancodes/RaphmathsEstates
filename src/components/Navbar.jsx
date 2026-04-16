import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Listings', path: '/listings' },
    { name: 'About', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 md:px-12',
        isScrolled ? 'bg-background/90 backdrop-blur-md border-b border-border py-3' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex flex-col items-start group">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-playfair font-bold text-primary-gold tracking-tight">
              Raphmaths Estates
            </h1>
            <div className="w-4 h-4 bg-primary-gold transform rotate-45" />
          </div>
          <div className="w-full h-[1px] bg-primary-gold mt-1 origin-left transition-transform duration-300 group-hover:scale-x-110" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'text-sm font-inter font-medium tracking-wide transition-colors duration-300 hover:text-primary-gold',
                location.pathname === link.path ? 'text-primary-gold' : 'text-text-primary'
              )}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex items-center gap-4 ml-4 pl-4 border-l border-border">
            <Link to="/saved" className="relative group">
              <Heart className="w-5 h-5 text-text-primary group-hover:text-primary-gold transition-colors" />
            </Link>
            <Link to="/listings" className="p-2 bg-primary-gold text-background rounded-sm hover:bg-primary-lightGold transition-colors">
              <Search className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-text-primary"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-background-surface border-b border-border p-6 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'text-lg font-inter font-medium',
                    location.pathname === link.path ? 'text-primary-gold' : 'text-text-primary'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center gap-6 pt-4 border-t border-border">
                <Link
                  to="/saved"
                  className="flex items-center gap-2 text-text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Heart className="w-5 h-5" />
                  <span>Saved</span>
                </Link>
                <Link
                  to="/listings"
                  className="flex items-center gap-2 text-primary-gold font-bold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Search className="w-5 h-5" />
                  <span>Search</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
