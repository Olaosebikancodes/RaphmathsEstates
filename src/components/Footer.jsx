import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background-surface border-t border-border pt-20 pb-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Brand Info */}
        <div className="flex flex-col gap-6">
          <Link to="/" className="flex flex-col items-start group w-fit">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-playfair font-bold text-primary-gold tracking-tight">
                Raphmaths Estates
              </h1>
              <div className="w-4 h-4 bg-primary-gold transform rotate-45" />
            </div>
            <div className="w-full h-[1px] bg-primary-gold mt-1 origin-left transition-transform duration-300 group-hover:scale-x-110" />
          </Link>
          <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
            Redefining luxury real estate in Anambra State. Where premium
            property meets world-class service.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="p-2 border border-border rounded-full text-text-secondary hover:text-primary-gold hover:border-primary-gold transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="p-2 border border-border rounded-full text-text-secondary hover:text-primary-gold hover:border-primary-gold transition-colors"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="p-2 border border-border rounded-full text-text-secondary hover:text-primary-gold hover:border-primary-gold transition-colors"
            >
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-playfair font-bold text-text-primary mb-6">
            Quick Links
          </h4>
          <ul className="flex flex-col gap-4 text-sm text-text-secondary">
            <li>
              <Link
                to="/"
                className="hover:text-primary-gold transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/listings"
                className="hover:text-primary-gold transition-colors"
              >
                Property Listings
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-primary-gold transition-colors"
              >
                Our Story
              </Link>
            </li>
            <li>
              <Link
                to="/admin"
                className="hover:text-primary-gold transition-colors"
              >
                Agent Dashboard
              </Link>
            </li>
          </ul>
        </div>

        {/* Locations */}
        <div>
          <h4 className="font-playfair font-bold text-text-primary mb-6">
            Our Focus
          </h4>
          <ul className="flex flex-col gap-4 text-sm text-text-secondary">
            <li>
              <Link
                to="/listings?city=Awka"
                className="hover:text-primary-gold transition-colors"
              >
                Awka Properties
              </Link>
            </li>
            <li>
              <Link
                to="/listings?city=Onitsha"
                className="hover:text-primary-gold transition-colors"
              >
                Onitsha Listings
              </Link>
            </li>
            <li>
              <Link
                to="/listings?city=Nnewi"
                className="hover:text-primary-gold transition-colors"
              >
                Nnewi Estates
              </Link>
            </li>
            <li>
              <Link
                to="/listings?city=Ekwulobia"
                className="hover:text-primary-gold transition-colors"
              >
                Ekwulobia Luxury
              </Link>
            </li>
            <li>
              <Link
                to="/listings?city=Ihiala"
                className="hover:text-primary-gold transition-colors"
              >
                Ihiala Premium
              </Link>
            </li>
            <li>
              <Link
                to="/listings?city=Ozubulu"
                className="hover:text-primary-gold transition-colors"
              >
                Ozubulu Estates
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-playfair font-bold text-text-primary mb-6">
            Contact Us
          </h4>
          <ul className="flex flex-col gap-4 text-sm text-text-secondary">
            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-primary-gold flex-shrink-0 mt-0.5" />
              <span>
                123 Luxury Avenue, Ifite, Awka, Anambra State, Nigeria.
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-primary-gold flex-shrink-0" />
              <span>+234 800 123 4567</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-primary-gold flex-shrink-0" />
              <span>info@raphmathsestates.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-secondary">
        <div className="flex flex-col gap-1">
          <p>© {currentYear} Raphmaths Estates. All rights reserved.</p>
          <p className="text-[10px] opacity-70 italic">
            Developed by Prai Saac Code Firm
          </p>
        </div>
        <div className="flex items-center gap-8">
          <a href="#" className="hover:text-text-primary transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-text-primary transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-text-primary transition-colors">
            Site Map
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
