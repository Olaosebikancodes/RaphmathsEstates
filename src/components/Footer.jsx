import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background-surface border-t border-border pt-16 pb-8 px-6 md:px-12 w-full">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        {/* Brand */}
        <div className="flex flex-col gap-5 lg:col-span-1">
          <Link to="/" className="flex flex-col items-start group w-fit" aria-label="Raphmaths Estates home">
            <div className="flex items-center gap-2">
              <span className="text-xl font-playfair font-bold text-primary-gold tracking-tight">
                Raphmaths Estates
              </span>
              <div className="w-3 h-3 bg-primary-gold transform rotate-45 flex-shrink-0" />
            </div>
            <div className="w-full h-px bg-primary-gold mt-0.5 origin-left transition-transform duration-300 group-hover:scale-x-110" />
          </Link>
          <p className="text-text-secondary text-sm leading-relaxed max-w-[240px]">
            Redefining luxury real estate in Anambra State. Premium property, world-class service.
          </p>
          <div className="flex items-center gap-3">
            {[
              { Icon: Instagram, label: "Instagram" },
              { Icon: Facebook, label: "Facebook" },
              { Icon: Twitter, label: "Twitter" },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="p-2 border border-border text-text-secondary hover:text-primary-gold hover:border-primary-gold transition-colors duration-300"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="font-playfair font-bold text-text-primary mb-5 text-sm">
            Navigate
          </h4>
          <ul className="flex flex-col gap-3 text-sm text-text-secondary">
            {[
              { label: "Home", to: "/" },
              { label: "Property Listings", to: "/listings" },
              { label: "Our Story", to: "/about" },
              { label: "Contact", to: "/contact" },
            ].map(({ label, to }) => (
              <li key={to}>
                <Link to={to} className="hover:text-primary-gold transition-colors duration-200">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Locations */}
        <div>
          <h4 className="font-playfair font-bold text-text-primary mb-5 text-sm">
            Key Markets
          </h4>
          <ul className="flex flex-col gap-3 text-sm text-text-secondary">
            {[
              { label: "Awka", city: "Awka" },
              { label: "Onitsha", city: "Onitsha" },
              { label: "Nnewi", city: "Nnewi" },
              { label: "Ekwulobia", city: "Ekwulobia" },
              { label: "Ihiala", city: "Ihiala" },
            ].map(({ label, city }) => (
              <li key={city}>
                <Link
                  to={`/listings?city=${city}`}
                  className="hover:text-primary-gold transition-colors duration-200"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-playfair font-bold text-text-primary mb-5 text-sm">
            Contact
          </h4>
          <ul className="flex flex-col gap-4 text-sm text-text-secondary">
            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-primary-gold flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                Ifite Road, Awka, Anambra State
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-primary-gold flex-shrink-0" />
              <a href="tel:+2348001234567" className="hover:text-primary-gold transition-colors">
                +234 800 123 4567
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-primary-gold flex-shrink-0" />
              <a
                href="mailto:info@raphmathsestates.com"
                className="hover:text-primary-gold transition-colors break-all"
              >
                info@raphmathsestates.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-text-secondary">
        <p>
          &copy; {currentYear} Raphmaths Estates. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-text-primary transition-colors">Privacy</a>
          <a href="#" className="hover:text-text-primary transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
