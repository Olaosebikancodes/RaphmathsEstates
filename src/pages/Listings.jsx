import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Filter,
  Search,
  X,
  ChevronDown,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProperties } from "../context/PropertyContext";
import PropertyCard from "../components/PropertyCard";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "../utils/cn";

const ITEMS_PER_PAGE = 6;

const CITIES = [
  "All", "Awka1", "Awka2", "Awka3", "Nkwelle1", "Nkwelle2",
  "2nd Niger Bridge Onitsha", "Obosi", "Asaba",
];

const revealVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 },
  }),
};

const Listings = () => {
  const { properties } = useProperties();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [localQuery, setLocalQuery] = useState(searchParams.get("query") || "");

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isSidebarOpen]);

  const currentPage = parseInt(searchParams.get("page") || "1");

  const [filters, setFilters] = useState({
    city: (searchParams.get("city") || "all").toLowerCase(),
    type: "all",
    status: (searchParams.get("status") || "all").toLowerCase(),
    minPrice: 0,
    maxPrice: 200000000,
    bedrooms: "all",
    query: searchParams.get("query") || "",
  });

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      city: (searchParams.get("city") || "all").toLowerCase(),
      status: (searchParams.get("status") || "all").toLowerCase(),
      query: searchParams.get("query") || "",
    }));
    setLocalQuery(searchParams.get("query") || "");
  }, [searchParams]);

  const handleQueryChange = (val) => {
    setLocalQuery(val);
    setFilters((prev) => ({ ...prev, query: val }));
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", "1");
    if (val) newParams.set("query", val);
    else newParams.delete("query");
    setSearchParams(newParams);
  };

  const filteredProperties = useMemo(() => {
    let result = properties.filter((prop) => {
      const cityMatch =
        filters.city === "all" ||
        (prop.location?.city?.toLowerCase() || "") === filters.city.toLowerCase();
      const typeMatch =
        filters.type === "all" ||
        (prop.type?.toLowerCase() || "") === filters.type.toLowerCase();
      const statusMatch =
        filters.status === "all" ||
        (prop.status || "").toLowerCase() === filters.status.toLowerCase();
      const priceMatch =
        (prop.price || 0) >= filters.minPrice &&
        (prop.price || 0) <= filters.maxPrice;
      const bedMatch =
        filters.bedrooms === "all" ||
        (prop.bedrooms || 0) >= parseInt(filters.bedrooms);
      const queryLower = filters.query.toLowerCase();
      const queryMatch =
        !filters.query ||
        (prop.title?.toLowerCase() || "").includes(queryLower) ||
        (prop.location?.city?.toLowerCase() || "").includes(queryLower) ||
        (prop.location?.area?.toLowerCase() || "").includes(queryLower) ||
        (prop.id?.toLowerCase() || "").includes(queryLower);
      return cityMatch && typeMatch && statusMatch && priceMatch && bedMatch && queryMatch;
    });
    if (sortBy === "price-low") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") result.sort((a, b) => b.price - a.price);
    if (sortBy === "newest") result.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    return result;
  }, [properties, filters, sortBy]);

  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProperties.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProperties, currentPage]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", "1");
    if (key === "city" || key === "status") {
      if (value === "all") newParams.delete(key);
      else newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    setSearchParams(newParams);
    document.getElementById("listings-top")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const clearFilters = () => {
    setFilters({ city: "all", type: "all", status: "all", minPrice: 0, maxPrice: 200000000, bedrooms: "all", query: "" });
    setLocalQuery("");
    setSearchParams({ page: "1" });
  };

  const hasActiveFilters =
    filters.city !== "all" ||
    filters.type !== "all" ||
    filters.status !== "all" ||
    filters.maxPrice < 200000000 ||
    filters.bedrooms !== "all" ||
    filters.query;

  const FilterContent = ({ isMobile = false }) => (
    <div className={cn("flex flex-col gap-8", isMobile && "gap-10")}>
      {/* Buy / Rent toggle */}
      <div>
        <p className="label-caps text-[10px] text-primary-gold mb-4">Category</p>
        <div className="flex border border-border">
          {[
            { label: "Buy", value: "sale" },
            { label: "Rent", value: "rent" },
            { label: "All", value: "all" },
          ].map(({ label, value }) => (
            <button
              key={value}
              onClick={() => handleFilterChange("status", value)}
              className={cn(
                "flex-1 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all",
                filters.status === value
                  ? "bg-primary-gold text-background"
                  : "text-text-secondary hover:text-text-primary",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <p className="label-caps text-[10px] text-primary-gold mb-4">Location</p>
        {isMobile ? (
          <div className="grid grid-cols-2 gap-2">
            {CITIES.map((city) => (
              <button
                key={city}
                onClick={() => handleFilterChange("city", city.toLowerCase())}
                className={cn(
                  "px-3 py-2.5 border text-[10px] font-bold uppercase tracking-widest transition-all",
                  filters.city === city.toLowerCase()
                    ? "bg-primary-gold border-primary-gold text-background"
                    : "border-border text-text-secondary hover:border-primary-gold/50",
                )}
              >
                {city}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2.5 max-h-64 overflow-y-auto pr-1">
            {CITIES.map((city) => (
              <label key={city} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="city"
                  checked={filters.city === city.toLowerCase()}
                  onChange={() => handleFilterChange("city", city.toLowerCase())}
                  className="w-3.5 h-3.5 accent-primary-gold"
                />
                <span className={cn(
                  "text-sm font-inter transition-colors",
                  filters.city === city.toLowerCase()
                    ? "text-text-primary font-semibold"
                    : "text-text-secondary group-hover:text-text-primary",
                )}>
                  {city}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Property Type */}
      <div>
        <p className="label-caps text-[10px] text-primary-gold mb-4">Property Type</p>
        {isMobile ? (
          <div className="grid grid-cols-2 gap-2">
            {["All", "Duplex", "Terrace", "Villa", "Apartment"].map((type) => (
              <button
                key={type}
                onClick={() => handleFilterChange("type", type.toLowerCase())}
                className={cn(
                  "px-3 py-2.5 border text-[10px] font-bold uppercase tracking-widest transition-all",
                  filters.type === type.toLowerCase()
                    ? "bg-primary-gold border-primary-gold text-background"
                    : "border-border text-text-secondary hover:border-primary-gold/50",
                )}
              >
                {type}
              </button>
            ))}
          </div>
        ) : (
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange("type", e.target.value)}
            className="w-full bg-background border border-border p-3 text-sm font-inter text-text-primary outline-none focus:border-primary-gold"
          >
            <option value="all">All Types</option>
            <option value="duplex">Duplex</option>
            <option value="terrace">Terrace</option>
            <option value="villa">Villa</option>
            <option value="apartment">Apartment</option>
          </select>
        )}
      </div>

      {/* Price Range */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="label-caps text-[10px] text-primary-gold">Price Range</p>
        </div>
        <input
          type="range"
          min="0"
          max="200000000"
          step="1000000"
          value={filters.maxPrice}
          onChange={(e) => handleFilterChange("maxPrice", parseInt(e.target.value))}
          className="w-full h-px bg-border appearance-none cursor-pointer accent-primary-gold mb-3"
        />
        <p className="text-sm font-inter font-bold text-text-primary">
          Up to ₦{filters.maxPrice.toLocaleString()}
        </p>
      </div>

      {/* Bedrooms */}
      <div>
        <p className="label-caps text-[10px] text-primary-gold mb-4">Min. Bedrooms</p>
        <div className="flex gap-2 flex-wrap">
          {["all", "1", "2", "3", "4", "5+"].map((val) => (
            <button
              key={val}
              onClick={() => handleFilterChange("bedrooms", val)}
              className={cn(
                "w-10 h-10 border text-xs font-bold transition-all",
                filters.bedrooms === val
                  ? "bg-primary-gold border-primary-gold text-background"
                  : "border-border text-text-secondary hover:border-primary-gold hover:text-text-primary",
              )}
            >
              {val}
            </button>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <button
          onClick={() => { clearFilters(); if (isMobile) setIsSidebarOpen(false); }}
          className="text-xs font-bold uppercase tracking-widest text-text-secondary hover:text-status-error transition-colors text-left"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div id="listings-top" className="pt-24 md:pt-32 pb-20 px-6 md:px-12 bg-background w-full">
      <div className="max-w-7xl mx-auto">

        {/* Back button (shown when filtered from home) */}
        {(filters.query || filters.city !== "all") && (
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-text-secondary hover:text-primary-gold transition-colors font-inter text-sm font-medium mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
        )}

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-text-primary mb-3 leading-tight">
              Property Collection
            </h1>
            <div className="flex items-center gap-3">
              <div className="w-8 h-px bg-primary-gold" />
              <p className="text-text-secondary font-inter text-sm">
                {filteredProperties.length} exclusive{" "}
                {filteredProperties.length === 1 ? "property" : "properties"} across Anambra State
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary group-focus-within:text-primary-gold transition-colors" />
              <input
                type="text"
                placeholder="Search properties…"
                value={localQuery}
                onChange={(e) => handleQueryChange(e.target.value)}
                className="bg-background-surface border border-border pl-11 pr-4 py-3 text-sm font-inter text-text-primary outline-none focus:border-primary-gold transition-all w-52 placeholder:text-text-secondary/50"
              />
              {localQuery && (
                <button
                  onClick={() => handleQueryChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="relative group">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-background-surface border border-border px-5 py-3 pr-10 text-sm font-inter text-text-primary focus:border-primary-gold outline-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
            </div>

            {/* Mobile filter button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-primary-gold text-background px-5 py-3 font-bold text-xs uppercase tracking-widest hover:bg-primary-lightGold transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-4 h-4 bg-background text-primary-gold text-[9px] font-bold flex items-center justify-center">
                  ✓
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex gap-12">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-32">
              <FilterContent />
            </div>
          </aside>

          {/* Listings Grid */}
          <main className="flex-1 min-w-0">
            {paginatedProperties.length > 0 ? (
              <div className="flex flex-col gap-14">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${currentPage}-${sortBy}-${JSON.stringify(filters)}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
                  >
                    {paginatedProperties.map((property, idx) => (
                      <motion.div
                        key={property.id}
                        variants={revealVariant}
                        initial="hidden"
                        animate="visible"
                        custom={idx}
                      >
                        <PropertyCard property={property} />
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-8 border-t border-border">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-secondary hover:text-primary-gold disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Prev
                    </button>

                    <div className="flex items-center gap-1">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => handlePageChange(i + 1)}
                          className={cn(
                            "w-9 h-9 text-xs font-bold transition-all",
                            currentPage === i + 1
                              ? "bg-primary-gold text-background"
                              : "text-text-secondary hover:text-primary-gold border border-transparent hover:border-border",
                          )}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-secondary hover:text-primary-gold disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-start py-24"
              >
                <div className="w-12 h-px bg-primary-gold mb-8" />
                <h3 className="text-3xl font-playfair font-bold text-text-primary mb-4">
                  No properties found
                </h3>
                <p className="text-text-secondary mb-10 max-w-sm leading-relaxed font-inter">
                  We couldn't find any listings that match your current criteria. Try adjusting your filters or clearing them entirely.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-8 py-3 bg-primary-gold text-background font-bold text-xs uppercase tracking-widest hover:bg-primary-lightGold transition-colors"
                >
                  Clear All Filters
                </button>
              </motion.div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="fixed top-0 right-0 h-full w-[88%] max-w-sm bg-[#0A0A0A] z-[70] shadow-2xl border-l border-border lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-border flex-shrink-0">
                <h3 className="text-xl font-playfair font-bold text-text-primary">
                  Filters
                </h3>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1.5 text-text-secondary hover:text-text-primary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-8">
                <FilterContent isMobile />
              </div>

              <div className="px-6 py-5 border-t border-border flex-shrink-0">
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="w-full bg-primary-gold text-background py-4 font-bold text-xs uppercase tracking-widest hover:bg-primary-lightGold transition-colors"
                >
                  Apply Filters
                  {filteredProperties.length > 0 && (
                    <span className="ml-2 opacity-70">
                      ({filteredProperties.length})
                    </span>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Listings;
