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
} from "lucide-react";
import { useProperties } from "../context/PropertyContext";
import PropertyCard from "../components/PropertyCard";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "../utils/cn";

const revealVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

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

  const getCityCount = (city) =>
    properties.filter(
      (p) => (p.location?.city?.toLowerCase() || "") === city.toLowerCase()
    ).length;

  const locations = [
    {
      name: "Awka1",
      count: getCityCount("Awka1"),
      image:
        "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?q=80&w=2070&auto=format&fit=crop",
    },
    {
      name: "Awka2",
      count: getCityCount("Awka2"),
      image:
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
    },
    {
      name: "Awka3",
      count: getCityCount("Awka3"),
      image:
        "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?q=80&w=2070&auto=format&fit=crop",
    },
    {
      name: "Nkwelle1",
      count: getCityCount("Nkwelle1"),
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Nkwelle2",
      count: getCityCount("Nkwelle2"),
      image:
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2070&auto=format&fit=crop",
    },
    {
      name: "2nd Niger Bridge Onitsha",
      count: getCityCount("2nd Niger Bridge Onitsha"),
      image:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Obosi",
      count: getCityCount("Obosi"),
      image:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
    },
    {
      name: "Asaba",
      count: getCityCount("Asaba"),
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
    },
  ];

  const testimonials = [
    {
      name: "Prince Ikechi",
      role: "Luxury Property Investor",
      text: "Raphmaths Estates doesn't just sell houses; they deliver lifestyles. Their attention to detail and commitment to luxury is unparalleled in Anambra State.",
    },
    {
      name: "Hon. Chuka Oladimeji",
      role: "Global Executive",
      text: "Trust and expertise are what I look for in a partner. Raphmaths Estates embodies both, providing world-class service every step of the way.",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Absolute Integrity",
      desc: "We build lasting relationships through transparency and unwavering professional ethics.",
    },
    {
      icon: Award,
      title: "Local Expertise",
      desc: "Deep-rooted knowledge of the Anambra luxury market ensures you make informed decisions.",
    },
    {
      icon: Users,
      title: "Bespoke Service",
      desc: "Your vision is our blueprint. We tailor our services to your unique requirements.",
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* ── Hero ── */}
      <section className="relative min-h-[100dvh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 pt-28 pb-20">
          <div className="max-w-xl">
            <motion.h1
              variants={revealVariant}
              initial="hidden"
              animate="visible"
              custom={0}
              className="text-5xl sm:text-6xl md:text-7xl font-playfair font-bold text-text-primary leading-[1.05] tracking-tight mb-6"
            >
              Where Luxury<br />
              <span className="text-primary-gold italic pb-1 block">Finds Home</span>
            </motion.h1>

            <motion.p
              variants={revealVariant}
              initial="hidden"
              animate="visible"
              custom={0.15}
              className="text-text-secondary text-base md:text-lg leading-relaxed mb-10 max-w-sm"
            >
              Premier properties across Anambra State. Verified listings, expert guidance.
            </motion.p>

            <motion.div
              variants={revealVariant}
              initial="hidden"
              animate="visible"
              custom={0.3}
              className="bg-background-surface/90 backdrop-blur-xl border border-border p-2 max-w-lg"
            >
              <div className="flex flex-col sm:flex-row gap-0">
                <div className="flex-1 flex items-center gap-3 px-4 py-3 border-b sm:border-b-0 sm:border-r border-border">
                  <Search className="text-primary-gold w-4 h-4 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Location or Property ID..."
                    className="bg-transparent border-none outline-none text-text-primary placeholder:text-text-secondary w-full text-sm font-inter"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    aria-label="Search properties"
                  />
                </div>
                <div className="flex sm:w-32 items-center px-4 py-3 border-b sm:border-b-0 sm:border-r border-border">
                  <select
                    className="bg-transparent border-none outline-none text-text-primary text-sm font-inter w-full cursor-pointer"
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    aria-label="Filter by city"
                  >
                    <option value="all" className="bg-background-surface">All Locations</option>
                    <option value="Awka1" className="bg-background-surface">Awka1</option>
                    <option value="Awka2" className="bg-background-surface">Awka2</option>
                    <option value="Awka3" className="bg-background-surface">Awka3</option>
                    <option value="Nkwelle1" className="bg-background-surface">Nkwelle1</option>
                    <option value="Nkwelle2" className="bg-background-surface">Nkwelle2</option>
                    <option value="2nd Niger Bridge Onitsha" className="bg-background-surface">2nd Niger Bridge Onitsha</option>
                    <option value="Obosi" className="bg-background-surface">Obosi</option>
                    <option value="Asaba" className="bg-background-surface">Asaba</option>
                  </select>
                </div>
                <button
                  onClick={handleSearch}
                  className="bg-primary-gold text-background px-6 py-3 font-inter font-bold text-xs uppercase tracking-widest hover:bg-primary-lightGold transition-colors active:scale-[0.98] whitespace-nowrap"
                >
                  Search
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Selected Residences ── */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <motion.h2
              variants={revealVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="text-4xl md:text-5xl font-playfair font-bold text-text-primary leading-tight"
            >
              Selected Residences
            </motion.h2>
            <Link
              to="/listings"
              className="flex items-center gap-2 text-primary-gold hover:text-primary-lightGold transition-colors font-inter text-xs font-bold uppercase tracking-widest group shrink-0"
            >
              All Listings
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featured.map((property, idx) => (
              <motion.div
                key={property.id}
                variants={revealVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                custom={idx * 0.08}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The Standard ── */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-background-surface">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28 items-start">
            {/* Left: Statement + image */}
            <motion.div
              variants={revealVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-text-primary leading-[1.2] mb-6">
                Excellence in Every Detail
              </h2>
              <p className="text-text-secondary text-base leading-relaxed mb-8 max-w-md">
                Anambra State's most trusted luxury property firm. We match families with the homes they deserve, guided by integrity and local knowledge.
              </p>
              <div className="h-px w-12 bg-primary-gold mb-10" />
              <div className="relative h-64 md:h-80 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop"
                  alt="Luxury property interior"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background-surface/50 to-transparent" />
              </div>
            </motion.div>

            {/* Right: Feature rows */}
            <div className="flex flex-col divide-y divide-border">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  variants={revealVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  custom={idx * 0.12}
                  className="py-8 flex items-start gap-6 group"
                >
                  <div className="w-12 h-12 flex items-center justify-center border border-border group-hover:border-primary-gold transition-colors duration-300 flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-primary-gold" />
                  </div>
                  <div>
                    <h3 className="font-playfair text-xl font-bold text-text-primary mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Locations ── */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={revealVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="mb-14"
          >
            <h4 className="font-cormorant uppercase tracking-[0.22em] text-primary-gold text-[11px] mb-4">
              Explore Locations
            </h4>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-text-primary">
              The Heart of Anambra
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 [grid-template-rows:auto]">
            {locations.map((loc, idx) => (
              <Link
                key={idx}
                to={`/listings?city=${loc.name}`}
                className={cn(
                  "group relative overflow-hidden",
                  idx === 0 ? "lg:col-span-2 h-80 md:h-[420px]" : "h-64 md:h-72"
                )}
              >
                <img
                  src={loc.image}
                  alt={loc.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-xl md:text-2xl font-playfair font-bold text-text-primary mb-1.5">
                    {loc.name}
                  </h3>
                  <div className="flex items-center gap-2 text-primary-gold">
                    <span className="font-cormorant uppercase text-[10px] tracking-widest font-bold">
                      {loc.count} {loc.count === 1 ? "Property" : "Properties"}
                    </span>
                    <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-background-surface overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-28 items-center"
            >
              {/* Quote */}
              <div className="relative">
                <span className="absolute -top-6 -left-2 text-primary-gold/10 font-playfair text-[140px] leading-none select-none pointer-events-none">
                  "
                </span>
                <p className="relative z-10 text-2xl md:text-3xl font-playfair italic text-text-primary leading-relaxed">
                  {testimonials[activeTestimonial].text}
                </p>
              </div>

              {/* Attribution + controls */}
              <div className="flex flex-col gap-8">
                <div>
                  <div className="h-px w-12 bg-primary-gold mb-6" />
                  <h5 className="font-playfair font-bold text-xl text-primary-gold mb-2">
                    {testimonials[activeTestimonial].name}
                  </h5>
                  <p className="font-cormorant uppercase text-[10px] tracking-widest text-text-secondary">
                    {testimonials[activeTestimonial].role}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() =>
                      setActiveTestimonial((prev) =>
                        prev === 0 ? testimonials.length - 1 : prev - 1
                      )
                    }
                    className="p-3 border border-border hover:border-primary-gold text-text-secondary hover:text-primary-gold transition-colors active:scale-[0.97]"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex gap-2 items-center">
                    {testimonials.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveTestimonial(idx)}
                        className={cn(
                          "h-0.5 transition-all duration-300",
                          activeTestimonial === idx
                            ? "w-8 bg-primary-gold"
                            : "w-3 bg-border"
                        )}
                        aria-label={`Testimonial ${idx + 1}`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() =>
                      setActiveTestimonial((prev) =>
                        prev === testimonials.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="p-3 border border-border hover:border-primary-gold text-text-secondary hover:text-primary-gold transition-colors active:scale-[0.97]"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-background">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={revealVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-text-primary leading-[1.1] mb-6">
              Find your next<br />
              <span className="text-primary-gold italic pb-1 block">dream home</span>
            </h2>
            <p className="text-text-secondary text-base leading-relaxed mb-10 max-w-md">
              Our agents are ready to guide you through Anambra's most exclusive properties.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/listings"
                className="px-8 py-4 bg-primary-gold text-background font-inter font-bold text-xs uppercase tracking-widest hover:bg-primary-lightGold transition-colors text-center active:scale-[0.98]"
              >
                Browse Properties
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 border border-primary-gold text-primary-gold font-inter font-bold text-xs uppercase tracking-widest hover:bg-primary-gold hover:text-background transition-colors text-center active:scale-[0.98]"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-80 lg:h-[500px] overflow-hidden"
          >
            <img
              src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=2040&auto=format&fit=crop"
              alt="Luxury property exterior"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-primary-gold/5" />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
