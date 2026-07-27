import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../utils/cn";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Listings", path: "/listings" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-[2000] transition-all duration-300",
        isMobileMenuOpen || isScrolled
          ? "bg-[#0A0A0A] border-b border-border py-4 px-6 md:px-12"
          : "bg-transparent py-6 px-6 md:px-12"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex flex-col items-start group" aria-label="Raphmaths Estates home">
          <div className="flex items-center gap-2">
            <span className="text-xl md:text-2xl font-playfair font-bold text-primary-gold tracking-tight">
              Raphmaths Estates
            </span>
            <div className="w-3 h-3 bg-primary-gold transform rotate-45 flex-shrink-0" />
          </div>
          <div className="w-full h-px bg-primary-gold mt-0.5 origin-left transition-transform duration-300 group-hover:scale-x-110" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "text-sm font-inter font-medium tracking-wide transition-colors duration-300 hover:text-primary-gold",
                location.pathname === link.path
                  ? "text-primary-gold"
                  : "text-text-primary"
              )}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex items-center gap-4 ml-4 pl-4 border-l border-border">
            <Link
              to="/saved"
              className="group"
              aria-label="Saved properties"
            >
              <Heart className="w-5 h-5 text-text-primary group-hover:text-primary-gold transition-colors" />
            </Link>
            <Link
              to="/listings"
              className="px-5 py-2 bg-primary-gold text-background font-inter font-bold text-xs uppercase tracking-widest hover:bg-primary-lightGold transition-colors active:scale-[0.98]"
            >
              Browse
            </Link>
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-text-primary p-1"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 z-[1100] md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              className="fixed top-0 right-0 h-full w-[80%] max-w-sm bg-[#0A0A0A] z-[1200] shadow-2xl p-8 md:hidden border-l border-border"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-14">
                  <span className="font-playfair font-bold text-primary-gold text-lg">
                    Menu
                  </span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-text-secondary hover:text-text-primary transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-col gap-7">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={cn(
                        "text-2xl font-playfair font-bold transition-colors",
                        location.pathname === link.path
                          ? "text-primary-gold"
                          : "text-text-primary hover:text-primary-gold"
                      )}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>

                <div className="mt-auto pt-8 border-t border-border flex flex-col gap-4">
                  <Link
                    to="/saved"
                    className="flex items-center gap-3 text-text-secondary hover:text-primary-gold transition-colors"
                  >
                    <Heart className="w-4 h-4 text-primary-gold" />
                    <span className="font-inter font-bold text-xs uppercase tracking-widest">
                      Saved Properties
                    </span>
                  </Link>
                  <Link
                    to="/listings"
                    className="flex items-center justify-center gap-2 bg-primary-gold text-background py-4 font-inter font-bold text-xs uppercase tracking-widest hover:bg-primary-lightGold transition-colors"
                  >
                    Browse Listings
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
