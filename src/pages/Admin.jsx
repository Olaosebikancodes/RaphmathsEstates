import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  BarChart2,
  LogOut,
  Search,
  UserPlus,
  LayoutDashboard,
  Users,
  Building2,
  Menu,
  X,
} from "lucide-react";
import { useProperties } from "../context/PropertyContext";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "../utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { getUser, signOut, supabase } from "../lib/supabase";
import { useToast } from "../context/ToastContext";

const Admin = () => {
  const { properties, agents, fetchInitialData, deleteProperty, deleteAgent } =
    useProperties();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [cityFilter, setCityFilter] = useState("All Cities");
  const [activeTab, setActiveTab] = useState("properties");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [clicksData, setClicksData] = useState({});
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    // On desktop, open sidebar by default
    if (window.innerWidth > 768) {
      setIsSidebarOpen(true);
    }
  }, []);

  useEffect(() => {
    if (isSidebarOpen && window.innerWidth <= 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await getUser();
      if (!user) {
        navigate("/admin/auth");
      } else {
        fetchClicks();
        setLoading(false);
      }
    };
    checkUser();
  }, [navigate]);

  const fetchClicks = async () => {
    try {
      const { data, error } = await supabase
        .from("property_clicks")
        .select("property_id");
      if (error) throw error;

      const counts = data.reduce((acc, click) => {
        acc[click.property_id] = (acc[click.property_id] || 0) + 1;
        return acc;
      }, {});
      setClicksData(counts);
    } catch (err) {
      // Error is handled by UI toast if needed, but this is a background fetch
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?"))
      return;
    try {
      await deleteProperty(id);
      showToast("Listing deleted successfully", "success");
    } catch (err) {
      showToast("Error deleting property: " + err.message, "error");
    }
  };

  const handleDeleteAgent = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this agent? This may affect listings assigned to them.",
      )
    )
      return;
    try {
      await deleteAgent(id);
      showToast("Agent deleted successfully", "success");
    } catch (err) {
      showToast("Error deleting agent: " + err.message, "error");
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/auth");
  };

  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      (p.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (p.id?.toLowerCase() || "").includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All Status" ||
      (statusFilter === "For Sale" && p.status === "sale") ||
      (statusFilter === "For Rent" && p.status === "rent");

    const matchesCity =
      cityFilter === "All Cities" ||
      (p.location?.city?.toLowerCase() || "") === cityFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesCity;
  });

  const filteredAgents = agents.filter(
    (a) =>
      (a.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (a.id?.toLowerCase() || "").includes(searchTerm.toLowerCase()),
  );

  if (loading) return null;

  return (
    <div className="flex min-h-screen w-full bg-background text-text-primary pt-20 md:pt-24">
      {/* Mobile Header Bar - Joined to main Navbar */}
      <div className="md:hidden fixed top-[72px] left-0 right-0 h-14 bg-[#0A0A0A] border-b border-border z-[1001] flex items-center justify-between px-6">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="flex items-center gap-2 text-primary-gold font-bold text-xs uppercase tracking-widest"
        >
          <Menu className="w-5 h-5" />
          Menu
        </button>
        <span className="text-[10px] label-caps text-text-secondary font-bold">
          {activeTab === "properties" ? "Properties" : "Agents"}
        </span>
      </div>

      {/* Admin Sidebar Overlay (Mobile) with backdrop blur */}
      <AnimatePresence>
        {isSidebarOpen && window.innerWidth <= 768 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[1100] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Admin Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 md:top-20 bottom-0 bg-[#0A0A0A] border-r border-border transition-all duration-300 z-[1200] md:z-40",
          isSidebarOpen
            ? "w-64 translate-x-0"
            : "w-20 -translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full py-8">
          <div className="px-6 mb-10 flex items-center justify-between">
            {isSidebarOpen && (
              <span className="text-[10px] label-caps text-primary-gold font-bold">
                Management
              </span>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1 hover:bg-background rounded-sm text-text-secondary hidden md:block"
            >
              {isSidebarOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4 mx-auto" />
              )}
            </button>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 hover:bg-background rounded-sm text-text-secondary md:hidden"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 space-y-2 px-3">
            {[
              { id: "properties", label: "Properties", icon: Building2 },
              { id: "agents", label: "Agents", icon: Users },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth <= 768) setIsSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-4 rounded-sm transition-all group",
                  activeTab === item.id
                    ? "bg-primary-gold text-background font-bold shadow-lg shadow-primary-gold/20"
                    : "text-text-secondary hover:bg-background hover:text-text-primary",
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 flex-shrink-0",
                    activeTab === item.id
                      ? "text-background"
                      : "text-primary-gold group-hover:scale-110 transition-transform",
                  )}
                />
                {isSidebarOpen && (
                  <span className="text-xs uppercase tracking-widest">
                    {item.label}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="px-3 mt-auto">
            <button
              onClick={handleLogout}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-4 rounded-sm text-text-secondary hover:bg-status-error/10 hover:text-status-error transition-all group",
              )}
            >
              <LogOut className="w-5 h-5 flex-shrink-0 group-hover:rotate-12 transition-transform" />
              {isSidebarOpen && (
                <span className="text-xs uppercase tracking-widest font-bold">
                  Sign Out
                </span>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 transition-all duration-300",
          isSidebarOpen ? "md:ml-64" : "md:ml-20",
        )}
      >
        <div className="p-4 md:p-12 max-w-7xl mx-auto pt-36 md:pt-16">
          {/* Header Area */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
            <div>
              <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-3 tracking-tight">
                {activeTab === "properties"
                  ? "Property Inventory"
                  : "Elite Agents"}
              </h1>
              <p className="text-text-secondary text-sm font-inter tracking-wide">
                {activeTab === "properties"
                  ? "Manage your luxury listings and track engagement metrics."
                  : "Manage your team of professional real estate experts."}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {activeTab === "agents" ? (
                <Link
                  to="/admin/add-agent"
                  className="flex items-center gap-3 bg-primary-gold text-background px-8 py-4 font-bold text-xs uppercase tracking-widest hover:bg-primary-lightGold hover:scale-[1.02] active:scale-[0.98] transition-all rounded-sm shadow-xl"
                >
                  <UserPlus className="w-4 h-4" />
                  Register New Agent
                </Link>
              ) : (
                <Link
                  to="/admin/add-listing"
                  className="flex items-center gap-3 bg-primary-gold text-background px-8 py-4 font-bold text-xs uppercase tracking-widest hover:bg-primary-lightGold hover:scale-[1.02] active:scale-[0.98] transition-all rounded-sm shadow-xl"
                >
                  <Plus className="w-4 h-4" />
                  Create New Listing
                </Link>
              )}
            </div>
          </div>

          {/* Stats Bar - Fixed for mobile visibility */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-16 w-full">
            {[
              {
                label: "Properties",
                value: properties.length,
                icon: Building2,
                color: "bg-blue-500/10 text-blue-500",
              },
              {
                label: "Agents",
                value: agents.length,
                icon: Users,
                color: "bg-purple-500/10 text-purple-500",
              },
              {
                label: "Clicks",
                value: Object.values(clicksData).reduce((a, b) => a + b, 0),
                icon: BarChart2,
                color: "bg-primary-gold/10 text-primary-gold",
              },
              {
                label: "Avg. Price",
                value: `₦${Math.round(properties.reduce((acc, p) => acc + p.price, 0) / (properties.length || 1) / 1000000)}M`,
                icon: Search,
                color: "bg-emerald-500/10 text-emerald-500",
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-background-surface border border-border p-4 md:p-6 rounded-sm shadow-sm flex items-center gap-3 md:gap-5 hover:border-primary-gold/50 transition-all group relative overflow-hidden min-w-0"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary-gold/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500" />
                <div
                  className={cn(
                    "w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-sm shrink-0",
                    stat.color,
                  )}
                >
                  <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="relative z-10 min-w-0 flex-1">
                  <h3 className="text-lg md:text-2xl font-playfair font-bold truncate leading-none">
                    {stat.value}
                  </h3>
                  <p className="text-[8px] md:text-[10px] text-text-secondary uppercase tracking-widest font-bold mt-1 truncate">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Search & Filters */}
          <div className="mb-10 flex flex-col md:flex-row gap-6">
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary group-focus-within:text-primary-gold transition-colors" />
              <input
                type="text"
                placeholder={
                  activeTab === "properties"
                    ? "Search by title, location or ID..."
                    : "Search by name, role or ID..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background-surface/50 border border-border pl-14 pr-6 py-5 text-sm font-inter outline-none focus:border-primary-gold focus:bg-background-surface transition-all rounded-sm shadow-sm placeholder:text-text-secondary/50"
              />
            </div>
            {activeTab === "properties" && (
              <div className="flex gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-background-surface/50 border border-border px-6 py-5 text-[10px] font-bold label-caps outline-none focus:border-primary-gold focus:bg-background-surface rounded-sm cursor-pointer shadow-sm hover:border-text-secondary/30 transition-all"
                >
                  <option>All Status</option>
                  <option>For Sale</option>
                  <option>For Rent</option>
                </select>
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="bg-background-surface/50 border border-border px-6 py-5 text-[10px] font-bold label-caps outline-none focus:border-primary-gold focus:bg-background-surface rounded-sm cursor-pointer shadow-sm hover:border-text-secondary/30 transition-all"
                >
                  <option>All Cities</option>
                  <option>Awka</option>
                  <option>Onitsha</option>
                  <option>Nnewi</option>
                  <option>Ekwulobia</option>
                  <option>Ihiala</option>
                  <option>Ozubulu</option>
                  <option>Obosi</option>
                  <option>Nkpor</option>
                  <option>Ogidi</option>
                  <option>Umunze</option>
                  <option>Otuocha</option>
                  <option>Aguleri</option>
                  <option>Ichi</option>
                  <option>Oraifite</option>
                  <option>Ukpor</option>
                  <option>Umuoji</option>
                  <option>Okpoko</option>
                  <option>Atani</option>
                </select>
              </div>
            )}
          </div>

          {/* Main Table Area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "properties" ? (
                <div className="space-y-4 mb-20">
                  {/* Mobile Cards View */}
                  <div className="md:hidden space-y-4">
                    {filteredProperties.map((p) => (
                      <div
                        key={p.id}
                        className="bg-background-surface border border-border p-5 rounded-sm shadow-sm flex flex-col gap-5"
                      >
                        <div className="flex gap-4">
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            className="w-20 h-20 object-cover rounded-sm border border-border"
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="font-playfair font-bold text-base text-text-primary truncate">
                              {p.title}
                            </h4>
                            <p className="text-[10px] text-text-secondary uppercase tracking-widest mt-1">
                              {p.location.city}
                            </p>
                            <div className="mt-3 flex items-center gap-2">
                              <span
                                className={cn(
                                  "text-[8px] label-caps px-2 py-1 rounded-sm font-bold tracking-widest",
                                  p.status === "sale"
                                    ? "bg-primary-gold text-background"
                                    : "bg-emerald-500 text-white",
                                )}
                              >
                                {p.status === "sale" ? "Sale" : "Rent"}
                              </span>
                              <p className="text-sm font-playfair font-bold">
                                ₦{p.price.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div className="flex items-center gap-2 text-text-secondary">
                            <BarChart2 className="w-4 h-4" />
                            <span className="text-xs font-inter font-bold">
                              {clicksData[p.id] || 0} views
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/property/${p.id}`}
                              className="p-3 bg-background border border-border text-text-secondary hover:text-primary-gold transition-all rounded-sm"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              to={`/admin/edit-listing/${p.id}`}
                              className="p-3 bg-background border border-border text-text-secondary hover:text-primary-gold transition-all rounded-sm"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="p-3 bg-background border border-border text-text-secondary hover:text-status-error transition-all rounded-sm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden md:block bg-background-surface/30 backdrop-blur-sm border border-border rounded-sm shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-background/50 border-b border-border">
                            <th className="px-8 py-6 text-[10px] label-caps text-text-secondary font-bold tracking-[0.2em]">
                              Property Details
                            </th>
                            <th className="px-8 py-6 text-[10px] label-caps text-text-secondary font-bold tracking-[0.2em]">
                              Status
                            </th>
                            <th className="px-8 py-6 text-[10px] label-caps text-text-secondary font-bold tracking-[0.2em]">
                              Price
                            </th>
                            <th className="px-8 py-6 text-[10px] label-caps text-text-secondary font-bold tracking-[0.2em]">
                              Engagement
                            </th>
                            <th className="px-8 py-6 text-[10px] label-caps text-text-secondary font-bold tracking-[0.2em]">
                              Management
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                          {filteredProperties.map((p) => (
                            <tr
                              key={p.id}
                              className="hover:bg-primary-gold/[0.02] transition-colors group"
                            >
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-5">
                                  <div className="relative shrink-0">
                                    <img
                                      src={p.images[0]}
                                      alt={p.title}
                                      className="w-16 h-16 object-cover rounded-sm border border-border shadow-sm group-hover:border-primary-gold/30 transition-colors"
                                    />
                                    <div className="absolute inset-0 bg-primary-gold/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>
                                  <div className="min-w-0">
                                    <h4 className="font-playfair font-bold text-base text-text-primary group-hover:text-primary-gold transition-colors truncate">
                                      {p.title}
                                    </h4>
                                    <p className="text-[10px] text-text-secondary uppercase tracking-widest mt-1 font-inter">
                                      ID:{" "}
                                      <span className="text-primary-gold/70">
                                        {p.id.slice(0, 8)}...
                                      </span>{" "}
                                      • {p.location.city}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-6">
                                <span
                                  className={cn(
                                    "text-[9px] label-caps px-3 py-1.5 rounded-sm font-bold tracking-widest inline-block",
                                    p.status === "sale"
                                      ? "bg-primary-gold text-background shadow-lg shadow-primary-gold/10"
                                      : "bg-emerald-500 text-white shadow-lg shadow-emerald-500/10",
                                  )}
                                >
                                  {p.status === "sale"
                                    ? "For Sale"
                                    : "For Rent"}
                                </span>
                              </td>
                              <td className="px-8 py-6">
                                <p className="text-base font-playfair font-bold text-text-primary">
                                  ₦{p.price.toLocaleString()}
                                </p>
                              </td>
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-3 text-text-secondary group-hover:text-primary-gold transition-colors">
                                  <div className="p-2 bg-background/50 rounded-sm">
                                    <BarChart2 className="w-4 h-4" />
                                  </div>
                                  <span className="text-sm font-inter font-bold">
                                    {clicksData[p.id] || 0}{" "}
                                    <span className="text-[10px] font-normal uppercase tracking-tighter opacity-50">
                                      views
                                    </span>
                                  </span>
                                </div>
                              </td>
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-3">
                                  <Link
                                    to={`/property/${p.id}`}
                                    className="p-3 bg-background/50 border border-border hover:border-primary-gold text-text-secondary hover:text-primary-gold transition-all rounded-sm shadow-sm"
                                    title="View Public Page"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Link>
                                  <Link
                                    to={`/admin/edit-listing/${p.id}`}
                                    className="p-3 bg-background/50 border border-border hover:border-primary-gold text-text-secondary hover:text-primary-gold transition-all rounded-sm shadow-sm"
                                    title="Edit Listing"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Link>
                                  <button
                                    onClick={() => handleDelete(p.id)}
                                    className="p-3 bg-background/50 border border-border hover:border-status-error text-text-secondary hover:text-status-error transition-all rounded-sm shadow-sm"
                                    title="Delete Permanentely"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {filteredProperties.length === 0 && (
                    <div className="py-32 text-center bg-background/20">
                      <div className="w-20 h-20 bg-background-surface border border-border rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <Search className="w-8 h-8 text-text-secondary/30" />
                      </div>
                      <p className="text-text-secondary italic font-inter tracking-wide">
                        No properties found matching your criteria.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4 mb-20">
                  {/* Mobile Agents View */}
                  <div className="md:hidden space-y-4">
                    {filteredAgents.map((a) => (
                      <div
                        key={a.id}
                        className="bg-background-surface border border-border p-5 rounded-sm shadow-sm flex flex-col gap-5"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={a.photo}
                            alt={a.name}
                            className="w-16 h-16 object-cover rounded-full border-2 border-border"
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="font-playfair font-bold text-base text-text-primary">
                              {a.name}
                            </h4>
                            <p className="text-[10px] text-primary-gold uppercase tracking-widest mt-1">
                              {a.role}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2 text-xs font-inter text-text-secondary">
                          <p className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-primary-gold rounded-full" />
                            {a.email}
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-border rounded-full" />
                            {a.phone}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <span className="text-[8px] label-caps px-2 py-1 bg-background border border-border text-text-secondary font-bold tracking-widest rounded-sm">
                            Status: Active
                          </span>
                          <button
                            onClick={() => handleDeleteAgent(a.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-background border border-status-error/30 text-status-error hover:bg-status-error hover:text-white transition-all rounded-sm text-[10px] font-bold uppercase tracking-widest"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Revoke Access
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Agents View */}
                  <div className="hidden md:block bg-background-surface/30 backdrop-blur-sm border border-border rounded-sm shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-background/50 border-b border-border">
                            <th className="px-8 py-6 text-[10px] label-caps text-text-secondary font-bold tracking-[0.2em]">
                              Elite Agent
                            </th>
                            <th className="px-8 py-6 text-[10px] label-caps text-text-secondary font-bold tracking-[0.2em]">
                              Specialization
                            </th>
                            <th className="px-8 py-6 text-[10px] label-caps text-text-secondary font-bold tracking-[0.2em]">
                              Contact Details
                            </th>
                            <th className="px-8 py-6 text-[10px] label-caps text-text-secondary font-bold tracking-[0.2em]">
                              Status
                            </th>
                            <th className="px-8 py-6 text-[10px] label-caps text-text-secondary font-bold tracking-[0.2em]">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                          {filteredAgents.map((a) => (
                            <tr
                              key={a.id}
                              className="hover:bg-primary-gold/[0.02] transition-colors group"
                            >
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-5">
                                  <div className="relative shrink-0">
                                    <img
                                      src={a.photo}
                                      alt={a.name}
                                      className="w-14 h-14 object-cover rounded-full border-2 border-border group-hover:border-primary-gold/50 transition-colors shadow-sm"
                                    />
                                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-status-success border-2 border-background-surface rounded-full" />
                                  </div>
                                  <div className="min-w-0">
                                    <h4 className="font-playfair font-bold text-base text-text-primary group-hover:text-primary-gold transition-colors truncate">
                                      {a.name}
                                    </h4>
                                    <p className="text-[10px] text-text-secondary uppercase tracking-widest mt-1 font-inter">
                                      Agent ID: {a.id.slice(0, 8)}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-6">
                                <p className="text-xs font-inter font-bold text-primary-gold/80 bg-primary-gold/5 px-3 py-1 rounded-sm inline-block uppercase tracking-wider">
                                  {a.role}
                                </p>
                              </td>
                              <td className="px-8 py-6">
                                <div className="flex flex-col gap-1.5">
                                  <p className="text-xs font-inter text-text-primary/80 flex items-center gap-2">
                                    <span className="w-1 h-1 bg-primary-gold rounded-full" />
                                    {a.email}
                                  </p>
                                  <p className="text-xs font-inter text-text-secondary flex items-center gap-2">
                                    <span className="w-1 h-1 bg-border rounded-full" />
                                    {a.phone}
                                  </p>
                                </div>
                              </td>
                              <td className="px-8 py-6">
                                <span className="text-[9px] label-caps px-3 py-1.5 bg-background border border-border text-text-secondary font-bold tracking-widest inline-block rounded-sm group-hover:border-primary-gold/30 transition-colors">
                                  Active
                                </span>
                              </td>
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => handleDeleteAgent(a.id)}
                                    className="p-3 bg-background/50 border border-border hover:border-status-error text-text-secondary hover:text-status-error transition-all rounded-sm shadow-sm"
                                    title="Revoke Agent Access"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {filteredAgents.length === 0 && (
                    <div className="py-32 text-center bg-background/20">
                      <div className="w-20 h-20 bg-background-surface border border-border rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <Users className="w-8 h-8 text-text-secondary/30" />
                      </div>
                      <p className="text-text-secondary italic font-inter tracking-wide">
                        No agents found matching your search.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Admin;
