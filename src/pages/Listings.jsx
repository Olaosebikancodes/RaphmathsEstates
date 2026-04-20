import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Filter,
  SlidersHorizontal,
  Search,
  X,
  ChevronDown,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProperties } from "../context/PropertyContext";
import PropertyCard from "../components/PropertyCard";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "../utils/cn";

const ITEMS_PER_PAGE = 6;

const Listings = () => {
  const { properties } = useProperties();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  const currentPage = parseInt(searchParams.get("page") || "1");

  // Filter States
  const [filters, setFilters] = useState({
    city: searchParams.get("city") || "all",
    type: "all",
    status: searchParams.get("status") || "all",
    minPrice: 0,
    maxPrice: 200000000,
    bedrooms: "all",
    query: searchParams.get("query") || "",
  });

  // Update filters when search params change
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      city: searchParams.get("city") || "all",
      status: searchParams.get("status") || "all",
      query: searchParams.get("query") || "",
    }));
  }, [searchParams]);

  const filteredProperties = useMemo(() => {
    let result = properties.filter((prop) => {
      const cityMatch =
        filters.city === "all" ||
        prop.location.city.toLowerCase() === filters.city.toLowerCase();
      const typeMatch =
        filters.type === "all" ||
        prop.type.toLowerCase() === filters.type.toLowerCase();
      const statusMatch =
        filters.status === "all" || prop.status === filters.status;
      const priceMatch =
        prop.price >= filters.minPrice && prop.price <= filters.maxPrice;
      const bedMatch =
        filters.bedrooms === "all" ||
        prop.bedrooms >= parseInt(filters.bedrooms);

      const queryLower = filters.query.toLowerCase();
      const queryMatch =
        !filters.query ||
        prop.title.toLowerCase().includes(queryLower) ||
        prop.location.city.toLowerCase().includes(queryLower) ||
        prop.location.area.toLowerCase().includes(queryLower) ||
        prop.id.toLowerCase().includes(queryLower);

      return (
        cityMatch &&
        typeMatch &&
        statusMatch &&
        priceMatch &&
        bedMatch &&
        queryMatch
      );
    });

    // Sorting
    if (sortBy === "price-low") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") result.sort((a, b) => b.price - a.price);
    if (sortBy === "newest")
      result.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));

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

    // Scroll to the top of the listings grid smoothly
    const gridElement = document.getElementById("listings-grid-top");
    if (gridElement) {
      gridElement.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const clearFilters = () => {
    setFilters({
      city: "all",
      type: "all",
      status: "all",
      minPrice: 0,
      maxPrice: 200000000,
      bedrooms: "all",
      query: "",
    });
    setSearchParams({ page: "1" });
  };

  return (
    <div className="pt-24 md:pt-32 pb-20 px-6 md:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        {(filters.query || filters.city !== "all") && (
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-text-secondary hover:text-primary-gold transition-colors font-inter text-sm font-medium mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        )}

        {/* Header */}
        <div
          id="listings-grid-top"
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-text-primary mb-4">
              Property Collection
            </h1>
            <p className="text-text-secondary font-inter">
              Discover {filteredProperties.length} exclusive properties across
              Anambra State.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-background-surface border border-border px-6 py-3 pr-12 text-sm font-inter text-text-primary focus:border-primary-gold outline-none cursor-pointer rounded-sm"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="price-low">Sort: Price Low to High</option>
                <option value="price-high">Sort: Price High to Low</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
            </div>

            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden flex items-center gap-2 bg-primary-gold text-background px-6 py-3 font-bold text-sm uppercase tracking-wider rounded-sm"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        <div className="flex gap-12">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-32 flex flex-col gap-10">
              {/* Buy/Rent Toggle */}
              <div className="flex p-1 bg-background-surface border border-border rounded-sm">
                <button
                  onClick={() => handleFilterChange("status", "sale")}
                  className={cn(
                    "flex-1 py-2 text-xs font-bold uppercase tracking-widest transition-all",
                    filters.status === "sale"
                      ? "bg-primary-gold text-background shadow-lg"
                      : "text-text-secondary hover:text-text-primary",
                  )}
                >
                  Buy
                </button>
                <button
                  onClick={() => handleFilterChange("status", "rent")}
                  className={cn(
                    "flex-1 py-2 text-xs font-bold uppercase tracking-widest transition-all",
                    filters.status === "rent"
                      ? "bg-primary-gold text-background shadow-lg"
                      : "text-text-secondary hover:text-text-primary",
                  )}
                >
                  Rent
                </button>
                <button
                  onClick={() => handleFilterChange("status", "all")}
                  className={cn(
                    "flex-1 py-2 text-xs font-bold uppercase tracking-widest transition-all",
                    filters.status === "all"
                      ? "bg-primary-gold text-background shadow-lg"
                      : "text-text-secondary hover:text-text-primary",
                  )}
                >
                  All
                </button>
              </div>

              {/* City Filter */}
              <div>
                <h4 className="label-caps text-primary-gold mb-6">Location</h4>
                <div className="flex flex-col gap-3">
                  {[
                    "All",
                    "Awka",
                    "Onitsha",
                    "Nnewi",
                    "Ekwulobia",
                    "Ihiala",
                    "Ozubulu",
                    "Obosi",
                    "Nkpor",
                    "Ogidi",
                    "Umunze",
                  ].map((city) => (
                      <label
                        key={city}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name="city"
                          checked={filters.city === city.toLowerCase()}
                          onChange={() =>
                            handleFilterChange("city", city.toLowerCase())
                          }
                          className="w-4 h-4 border-border bg-transparent text-primary-gold focus:ring-primary-gold"
                        />
                        <span
                          className={cn(
                            "text-sm font-inter transition-colors",
                            filters.city === city.toLowerCase()
                              ? "text-text-primary font-bold"
                              : "text-text-secondary group-hover:text-text-primary",
                          )}
                        >
                          {city}
                        </span>
                      </label>
                    ),
                  )}
                </div>
              </div>

              {/* Property Type */}
              <div>
                <h4 className="label-caps text-primary-gold mb-6">
                  Property Type
                </h4>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange("type", e.target.value)}
                  className="w-full bg-background-surface border border-border p-3 text-sm font-inter text-text-primary outline-none focus:border-primary-gold rounded-sm"
                >
                  <option value="all">All Types</option>
                  <option value="duplex">Duplex</option>
                  <option value="terrace">Terrace</option>
                  <option value="villa">Villa</option>
                  <option value="apartment">Apartment</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h4 className="label-caps text-primary-gold">Price Range</h4>
                  <span className="text-[10px] text-text-secondary">
                    Max: 200M
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200000000"
                  step="1000000"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    handleFilterChange("maxPrice", parseInt(e.target.value))
                  }
                  className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-primary-gold mb-4"
                />
                <div className="text-sm font-inter font-bold text-text-primary">
                  Up to ₦{filters.maxPrice.toLocaleString()}
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <h4 className="label-caps text-primary-gold mb-6">
                  Min Bedrooms
                </h4>
                <div className="flex gap-2">
                  {["all", "1", "2", "3", "4", "5+"].map((val) => (
                    <button
                      key={val}
                      onClick={() => handleFilterChange("bedrooms", val)}
                      className={cn(
                        "w-10 h-10 border border-border text-xs font-bold transition-all rounded-sm",
                        filters.bedrooms === val
                          ? "bg-primary-gold border-primary-gold text-background"
                          : "text-text-secondary hover:border-primary-gold hover:text-text-primary",
                      )}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={clearFilters}
                className="text-xs font-bold uppercase tracking-widest text-text-secondary hover:text-primary-gold transition-colors text-left"
              >
                Clear All Filters
              </button>
            </div>
          </aside>

          {/* Listings Grid */}
          <main className="flex-1">
            {paginatedProperties.length > 0 ? (
              <div className="flex flex-col gap-16">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8"
                  >
                    {paginatedProperties.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 pt-8 border-t border-border">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 border border-border text-text-secondary hover:text-primary-gold disabled:opacity-30 disabled:hover:text-text-secondary transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-2">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => handlePageChange(i + 1)}
                          className={cn(
                            "w-10 h-10 text-xs font-bold transition-all",
                            currentPage === i + 1
                              ? "bg-primary-gold text-background"
                              : "text-text-secondary hover:text-primary-gold border border-transparent hover:border-primary-gold",
                          )}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 border border-border text-text-secondary hover:text-primary-gold disabled:opacity-30 disabled:hover:text-text-secondary transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-border rounded-sm">
                <Search className="w-12 h-12 text-text-secondary mb-6" />
                <h3 className="text-2xl font-playfair font-bold text-text-primary mb-2">
                  No matching properties
                </h3>
                <p className="text-text-secondary mb-8 max-w-sm">
                  We couldn't find any listings that match your current search
                  criteria. Try adjusting your filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-8 py-3 bg-primary-gold text-background font-bold text-xs uppercase tracking-widest hover:bg-primary-lightGold transition-colors rounded-sm"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-background-surface z-[70] shadow-2xl p-8 overflow-y-auto md:hidden"
            >
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-2xl font-playfair font-bold text-text-primary">
                  Filters
                </h3>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 text-text-secondary hover:text-text-primary"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col gap-12">
                {/* Same filter controls as desktop, just stacked */}
                {/* (Duplicate logic here or extract to a FilterContent component) */}

                {/* Buy/Rent Toggle */}
                <div>
                  <h4 className="label-caps text-primary-gold mb-6">
                    Category
                  </h4>
                  <div className="flex p-1 bg-background border border-border rounded-sm">
                    {["sale", "rent", "all"].map((s) => (
                      <button
                        key={s}
                        onClick={() => handleFilterChange("status", s)}
                        className={cn(
                          "flex-1 py-2 text-[10px] font-bold uppercase tracking-widest transition-all",
                          filters.status === s
                            ? "bg-primary-gold text-background"
                            : "text-text-secondary",
                        )}
                      >
                        {s === "sale" ? "Buy" : s === "rent" ? "Rent" : "All"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* City Filter */}
                <div>
                  <h4 className="label-caps text-primary-gold mb-6">
                    Location
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {["All", "Awka", "Onitsha", "Nnewi", "Ekwulobia"].map(
                      (city) => (
                        <button
                          key={city}
                          onClick={() =>
                            handleFilterChange("city", city.toLowerCase())
                          }
                          className={cn(
                            "py-2 px-4 border border-border text-xs font-medium transition-all rounded-sm",
                            filters.city === city.toLowerCase()
                              ? "bg-primary-gold border-primary-gold text-background"
                              : "text-text-secondary",
                          )}
                        >
                          {city}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="label-caps text-primary-gold mb-6">
                    Max Price: ₦{filters.maxPrice.toLocaleString()}
                  </h4>
                  <input
                    type="range"
                    min="0"
                    max="200000000"
                    step="1000000"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      handleFilterChange("maxPrice", parseInt(e.target.value))
                    }
                    className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-primary-gold"
                  />
                </div>

                <button
                  onClick={() => {
                    clearFilters();
                    setIsSidebarOpen(false);
                  }}
                  className="w-full py-4 bg-background border border-border text-text-primary font-bold text-xs uppercase tracking-widest hover:border-primary-gold transition-colors mt-8"
                >
                  Clear All
                </button>

                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="w-full py-4 bg-primary-gold text-background font-bold text-xs uppercase tracking-widest hover:bg-primary-lightGold transition-colors"
                >
                  Apply Filters
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
