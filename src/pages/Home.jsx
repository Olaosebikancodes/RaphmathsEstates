import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowRight,
  Shield,
  Award,
  Users,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import { useProperties } from "../context/PropertyContext";
import PropertyCard from "../components/PropertyCard";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "../utils/cn";

const Home = () => {
  const { getFeaturedProperties, properties } = useProperties();
  const featured = getFeaturedProperties().slice(0, 6);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchCity, setSearchCity] = useState("all");

  const handleSearch = () => {
    let url = "/listings?";
    if (searchQuery) url += `query=${encodeURIComponent(searchQuery)}&`;
    if (searchCity !== "all") url += `city=${encodeURIComponent(searchCity)}`;
    navigate(url);
  };

  const getCityCount = (city) => {
    return properties.filter(
      (p) => p.location.city.toLowerCase() === city.toLowerCase(),
    ).length;
  };

  const locations = [
    {
      name: "Awka",
      count: getCityCount("Awka"),
      image: "/img/loc-asaba.jpg",
    },
    {
      name: "Onitsha",
      count: getCityCount("Onitsha"),
      image: "/img/loc-warri.jpg",
    },
    {
      name: "Nnewi",
      count: getCityCount("Nnewi"),
      image: "/img/loc-effurun.jpg",
    },
    {
      name: "Ekwulobia",
      count: getCityCount("Ekwulobia"),
      image: "/img/loc-sapele.jpg",
    },
  ];

  const testimonials = [
    {
      name: "Prince Ikechi",
      role: "Luxury Property Investor",
      image: "/img/agent-benson.jpg",
      text: "Raphmaths Estates doesn't just sell houses; they deliver lifestyles. Their attention to detail and commitment to luxury is unparalleled in Anambra State.",
      rating: 5,
    },
    {
      name: "Hon. Chuka Oladimeji",
      role: "Global Executive",
      image: "/img/agent-sarah.jpg",
      text: "Trust and expertise are what I look for in a partner. Raphmaths Estates embodies both, providing world-class service every step of the way.",
      rating: 5,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-background-surface">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat">
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.h4
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="label-caps text-primary-gold mb-6 tracking-[0.3em] font-bold"
          >
            Premier Real Estate
          </motion.h4>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-playfair font-bold text-text-primary mb-12 leading-tight"
          >
            Where Luxury <br /> Finds Home
          </motion.h1>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-background-surface/80 backdrop-blur-xl border border-border p-2 md:p-4 rounded-sm max-w-4xl mx-auto shadow-2xl"
          >
            <div className="flex flex-col md:flex-row items-stretch gap-4">
              <div className="flex-1 flex items-center gap-4 px-4 border-b md:border-b-0 md:border-r border-border py-2 md:py-0">
                <Search className="text-primary-gold w-5 h-5 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Location, Area, or Property ID..."
                  className="bg-transparent border-none outline-none text-text-primary placeholder:text-text-secondary w-full text-sm font-inter"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <div className="md:w-48 px-4 flex items-center gap-4 py-2 md:py-0">
                <select
                  className="bg-transparent border-none outline-none text-text-primary text-sm font-inter w-full cursor-pointer"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                >
                  <option value="all" className="bg-background-surface">
                    All Cities
                  </option>
                  <option value="awka" className="bg-background-surface">
                    Awka
                  </option>
                  <option value="onitsha" className="bg-background-surface">
                    Onitsha
                  </option>
                  <option value="nnewi" className="bg-background-surface">
                    Nnewi
                  </option>
                  <option value="ekwulobia" className="bg-background-surface">
                    Ekwulobia
                  </option>
                </select>
              </div>
              <button
                onClick={handleSearch}
                className="bg-primary-gold text-background px-8 py-3 font-inter font-bold text-sm tracking-wider uppercase hover:bg-primary-lightGold transition-all duration-300"
              >
                Search Properties
              </button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60"
        >
          <div className="w-[1px] h-12 bg-primary-gold" />
          <span className="label-caps text-[10px] text-primary-gold">
            Scroll
          </span>
        </motion.div>
      </section>

      {/* Featured Listings */}
      <section className="py-32 px-6 md:px-12 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <h4 className="label-caps text-primary-gold mb-4 tracking-[0.2em]">
                Our Collection
              </h4>
              <h2 className="text-4xl md:text-5xl font-playfair font-bold text-text-primary leading-tight">
                Featured Residences
              </h2>
            </div>
            <Link
              to="/listings"
              className="flex items-center gap-2 text-primary-gold hover:text-primary-lightGold transition-colors font-inter text-sm font-bold uppercase tracking-widest group"
            >
              View All Listings
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Raphmaths Estates */}
      <section className="py-32 px-6 md:px-12 bg-background-surface relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-gold/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h4 className="label-caps text-primary-gold mb-4 tracking-[0.2em]">
              The Raphmaths Estates Standard
            </h4>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-text-primary leading-tight">
              Excellence in Every Detail
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: Shield,
                title: "Absolute Integrity",
                desc: "We build lasting relationships through transparency and unwavering professional ethics.",
              },
              {
                icon: Award,
                title: "Local Expertise",
                desc: "Deep-rooted knowledge of the Anambra State luxury market ensures you make informed decisions.",
              },
              {
                icon: Users,
                title: "Bespoke Service",
                desc: "Your vision is our blueprint. We tailor our services to match your unique lifestyle requirements.",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-20 h-20 bg-background flex items-center justify-center border border-border group-hover:border-primary-gold transition-colors duration-500 mb-8 relative">
                  <feature.icon className="w-8 h-8 text-primary-gold" />
                  <div className="absolute inset-0 bg-primary-gold opacity-0 group-hover:opacity-5 transition-opacity" />
                </div>
                <h3 className="text-xl font-playfair font-bold text-text-primary mb-4">
                  {feature.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed max-w-[280px]">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-32 px-6 md:px-12 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h4 className="label-caps text-primary-gold mb-4 tracking-[0.2em]">
              Explore Locations
            </h4>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-text-primary">
              The Heart of Anambra State
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {locations.map((loc, idx) => (
              <Link
                key={idx}
                to={`/listings?city=${loc.name}`}
                className="group relative h-96 overflow-hidden rounded-sm"
              >
                <img
                  src={loc.image}
                  alt={loc.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-80" />
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-2xl font-playfair font-bold text-text-primary mb-1">
                    {loc.name}
                  </h3>
                  <div className="flex items-center gap-2 text-primary-gold">
                    <span className="label-caps text-[10px] font-bold">
                      {loc.count} Properties
                    </span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-2" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6 md:px-12 bg-background-surface">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h4 className="label-caps text-primary-gold mb-4 tracking-[0.2em]">
              Client Success
            </h4>
            <h2 className="text-4xl font-playfair font-bold text-text-primary">
              Whispers of Satisfaction
            </h2>
          </div>

          <div className="relative p-12 bg-background border border-border shadow-2xl overflow-hidden">
            {/* Background Quotes */}
            <span className="absolute top-0 right-0 text-primary-gold/10 font-playfair text-[200px] leading-none select-none pointer-events-none -translate-y-1/4 translate-x-1/4">
              "
            </span>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="flex items-center gap-1 mb-8 text-primary-gold">
                  {[...Array(testimonials[activeTestimonial].rating)].map(
                    (_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary-gold" />
                    ),
                  )}
                </div>
                <p className="text-xl md:text-2xl font-playfair italic text-text-primary leading-relaxed mb-10">
                  "{testimonials[activeTestimonial].text}"
                </p>
                <div>
                  <h5 className="font-playfair font-bold text-lg text-primary-gold">
                    {testimonials[activeTestimonial].name}
                  </h5>
                  <p className="label-caps text-[10px] text-text-secondary mt-1">
                    {testimonials[activeTestimonial].role}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Carousel Controls */}
            <div className="flex items-center justify-center gap-6 mt-12">
              <button
                onClick={() =>
                  setActiveTestimonial((prev) =>
                    prev === 0 ? testimonials.length - 1 : prev - 1,
                  )
                }
                className="p-2 border border-border rounded-full hover:border-primary-gold transition-colors text-text-secondary hover:text-primary-gold"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "w-1.5 h-1.5 rounded-full transition-all duration-300",
                      activeTestimonial === idx
                        ? "bg-primary-gold w-4"
                        : "bg-border",
                    )}
                  />
                ))}
              </div>
              <button
                onClick={() =>
                  setActiveTestimonial((prev) =>
                    prev === testimonials.length - 1 ? 0 : prev + 1,
                  )
                }
                className="p-2 border border-border rounded-full hover:border-primary-gold transition-colors text-text-secondary hover:text-primary-gold"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 md:px-12 bg-background border-t border-border overflow-hidden relative">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-playfair font-bold text-text-primary mb-8 leading-tight">
            Ready to find your <br />{" "}
            <span className="text-primary-gold italic">dream sanctuary?</span>
          </h2>
          <p className="text-text-secondary text-lg mb-12 max-w-2xl mx-auto leading-relaxed font-inter">
            Our agents are ready to provide you with a personalized tour of our
            most exclusive properties.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              to="/listings"
              className="w-full sm:w-auto px-10 py-4 bg-primary-gold text-background font-inter font-bold uppercase tracking-widest hover:bg-primary-lightGold transition-all duration-300"
            >
              Browse Properties
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-10 py-4 border border-primary-gold text-primary-gold font-inter font-bold uppercase tracking-widest hover:bg-primary-gold hover:text-background transition-all duration-300"
            >
              Contact an Agent
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
