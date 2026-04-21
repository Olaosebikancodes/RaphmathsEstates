import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Heart, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../utils/cn";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [shouldTransition, setShouldTransition] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Disable transitions during menu state change to prevent flickering
    setShouldTransition(false);
    const timer = setTimeout(() => setShouldTransition(true), 400);
    return () => clearTimeout(timer);
  }, [isMobileMenuOpen]);

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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Listings", path: "/listings" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-[1000] px-6 py-4 md:px-12",
        isMobileMenuOpen || isScrolled
          ? "bg-[#0A0A0A] border-b border-border py-3"
          : "bg-transparent",
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
                "text-sm font-inter font-medium tracking-wide transition-colors duration-300 hover:text-primary-gold",
                location.pathname === link.path
                  ? "text-primary-gold"
                  : "text-text-primary",
              )}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex items-center gap-4 ml-4 pl-4 border-l border-border">
            <Link to="/saved" className="relative group">
              <Heart className="w-5 h-5 text-text-primary group-hover:text-primary-gold transition-colors" />
            </Link>
            <Link
              to="/listings"
              className="p-2 bg-primary-gold text-background rounded-sm hover:bg-primary-lightGold transition-colors"
            >
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

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-[1100] md:hidden" // 100% opaque black
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-[#0A0A0A] z-[1200] shadow-2xl p-8 md:hidden border-l border-border"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-12">
                  <h2 className="text-xl font-playfair font-bold text-primary-gold">
                    Navigation
                  </h2>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-text-secondary hover:text-text-primary"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex flex-col gap-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={cn(
                        "text-xl font-inter font-medium tracking-wide transition-colors",
                        location.pathname === link.path
                          ? "text-primary-gold"
                          : "text-text-primary",
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>

                <div className="mt-auto pt-8 border-t border-border flex flex-col gap-6">
                  <Link
                    to="/saved"
                    className="flex items-center gap-4 text-text-primary group"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="w-10 h-10 bg-background flex items-center justify-center rounded-sm">
                      <Heart className="w-5 h-5 text-primary-gold" />
                    </div>
                    <span className="font-bold text-xs uppercase tracking-widest">
                      Saved Properties
                    </span>
                  </Link>
                  <Link
                    to="/listings"
                    className="flex items-center gap-4 text-background group"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex-1 bg-primary-gold flex items-center justify-center gap-3 py-4 rounded-sm shadow-lg shadow-primary-gold/20">
                      <Search className="w-4 h-4" />
                      <span className="font-bold text-xs uppercase tracking-widest">
                        Browse Listings
                      </span>
                    </div>
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
