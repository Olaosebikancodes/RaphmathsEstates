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
  Users,
  Building2,
  Menu,
  X,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useProperties } from "../context/PropertyContext";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "../utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { getUser, signOut, supabase } from "../lib/supabase";
import { useToast } from "../context/ToastContext";

const Admin = () => {
  const { properties, agents, deleteProperty, deleteAgent } = useProperties();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [cityFilter, setCityFilter] = useState("All Cities");
  const [activeTab, setActiveTab] = useState("properties");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [clicksData, setClicksData] = useState({});
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (window.innerWidth < 768) setSidebarOpen(false);
  }, []);

  useEffect(() => {
    if (sidebarOpen && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await getUser();
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
    } catch (_) {}
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      await deleteProperty(id);
      showToast("Listing deleted successfully", "success");
    } catch (err) {
      showToast("Error deleting property: " + err.message, "error");
    }
  };

  const handleDeleteAgent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this agent? This may affect listings assigned to them.")) return;
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

  const navItems = [
    { id: "properties", label: "Properties", icon: Building2 },
    { id: "agents", label: "Agents", icon: Users },
  ];

  return (
    <div className="flex h-screen w-full bg-background text-text-primary overflow-hidden">

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-[#0D0D0D] border-r border-border flex flex-col z-[200] transition-all duration-300",
          sidebarOpen ? "w-64" : "w-0 md:w-[72px]",
          !sidebarOpen && "overflow-hidden md:overflow-visible",
        )}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-border flex-shrink-0">
          {sidebarOpen ? (
            <Link to="/" className="flex flex-col items-start group min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-playfair font-bold text-primary-gold tracking-tight truncate">
                  Raphmaths Estates
                </span>
                <div className="w-2 h-2 bg-primary-gold rotate-45 flex-shrink-0" />
              </div>
              <span className="text-[9px] label-caps text-text-secondary tracking-widest mt-0.5">
                Admin Panel
              </span>
            </Link>
          ) : (
            <div className="w-full flex items-center justify-center">
              <div className="w-5 h-5 bg-primary-gold rotate-45" />
            </div>
          )}

          {/* Toggle button — desktop only */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden md:flex items-center justify-center p-1.5 text-text-secondary hover:text-text-primary hover:bg-background transition-colors flex-shrink-0"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {/* Close button — mobile only */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1.5 text-text-secondary hover:text-text-primary transition-colors flex-shrink-0"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (window.innerWidth < 768) setSidebarOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-3 transition-all group",
                    sidebarOpen ? "justify-start" : "justify-center",
                    active
                      ? "bg-primary-gold text-background"
                      : "text-text-secondary hover:bg-background hover:text-text-primary",
                  )}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5 flex-shrink-0",
                      active ? "text-background" : "text-primary-gold",
                    )}
                  />
                  {sidebarOpen && (
                    <span className="text-xs font-bold uppercase tracking-widest">
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Bottom actions */}
        <div className="px-3 py-4 border-t border-border space-y-1 flex-shrink-0">
          <Link
            to="/"
            className={cn(
              "w-full flex items-center gap-3 px-3 py-3 text-text-secondary hover:text-primary-gold transition-colors",
              sidebarOpen ? "justify-start" : "justify-center",
            )}
            title={!sidebarOpen ? "Back to Site" : undefined}
          >
            <ArrowUpRight className="w-4 h-4 flex-shrink-0" />
            {sidebarOpen && (
              <span className="text-xs font-bold uppercase tracking-widest">
                Back to Site
              </span>
            )}
          </Link>
          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-3 text-text-secondary hover:bg-status-error/10 hover:text-status-error transition-all",
              sidebarOpen ? "justify-start" : "justify-center",
            )}
            title={!sidebarOpen ? "Sign Out" : undefined}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {sidebarOpen && (
              <span className="text-xs font-bold uppercase tracking-widest">
                Sign Out
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div
        className={cn(
          "flex flex-col flex-1 min-w-0 transition-all duration-300 h-full",
          sidebarOpen ? "md:ml-64" : "md:ml-[72px]",
        )}
      >
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-4 px-5 h-14 border-b border-border bg-background flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1 text-text-secondary hover:text-primary-gold transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-playfair font-bold text-primary-gold">
              Raphmaths Estates
            </span>
            <div className="w-2 h-2 bg-primary-gold rotate-45" />
          </div>
          <span className="ml-auto text-[10px] label-caps text-text-secondary">
            {activeTab === "properties" ? "Properties" : "Agents"}
          </span>
        </div>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-5 md:p-10 max-w-7xl mx-auto">

            {/* Page header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pt-2 md:pt-0">
              <div>
                <h1 className="text-3xl md:text-4xl font-playfair font-bold tracking-tight">
                  {activeTab === "properties" ? "Property Inventory" : "Elite Agents"}
                </h1>
                <p className="text-text-secondary text-sm mt-1">
                  {activeTab === "properties"
                    ? "Manage luxury listings and track engagement."
                    : "Manage your team of property experts."}
                </p>
              </div>
              {activeTab === "agents" ? (
                <Link
                  to="/admin/add-agent"
                  className="flex items-center gap-2 bg-primary-gold text-background px-6 py-3 font-bold text-xs uppercase tracking-widest hover:bg-primary-lightGold active:scale-[0.98] transition-all self-start md:self-auto"
                >
                  <UserPlus className="w-4 h-4" />
                  New Agent
                </Link>
              ) : (
                <Link
                  to="/admin/add-listing"
                  className="flex items-center gap-2 bg-primary-gold text-background px-6 py-3 font-bold text-xs uppercase tracking-widest hover:bg-primary-lightGold active:scale-[0.98] transition-all self-start md:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  New Listing
                </Link>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {[
                {
                  label: "Properties",
                  value: properties.length,
                  icon: Building2,
                  color: "text-blue-400",
                  bg: "bg-blue-500/10",
                },
                {
                  label: "Agents",
                  value: agents.length,
                  icon: Users,
                  color: "text-purple-400",
                  bg: "bg-purple-500/10",
                },
                {
                  label: "Total Clicks",
                  value: Object.values(clicksData).reduce((a, b) => a + b, 0),
                  icon: BarChart2,
                  color: "text-primary-gold",
                  bg: "bg-primary-gold/10",
                },
                {
                  label: "Avg. Price",
                  value: `₦${Math.round(
                    properties.reduce((acc, p) => acc + p.price, 0) /
                    (properties.length || 1) / 1000000,
                  )}M`,
                  icon: Search,
                  color: "text-emerald-400",
                  bg: "bg-emerald-500/10",
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-background-surface border border-border p-4 md:p-5 flex items-center gap-4 hover:border-primary-gold/40 transition-colors"
                >
                  <div className={cn("w-10 h-10 flex items-center justify-center flex-shrink-0", stat.bg)}>
                    <stat.icon className={cn("w-5 h-5", stat.color)} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xl md:text-2xl font-playfair font-bold leading-none">
                      {stat.value}
                    </p>
                    <p className="text-[10px] text-text-secondary uppercase tracking-widest mt-1">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input
                  type="text"
                  placeholder={
                    activeTab === "properties"
                      ? "Search by title, location or ID..."
                      : "Search by name or ID..."
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-background-surface border border-border pl-12 pr-4 py-3.5 text-sm font-inter outline-none focus:border-primary-gold transition-all placeholder:text-text-secondary/50"
                />
              </div>
              {activeTab === "properties" && (
                <div className="flex gap-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-background-surface border border-border px-4 py-3.5 text-[10px] font-bold label-caps outline-none focus:border-primary-gold cursor-pointer transition-all"
                  >
                    <option>All Status</option>
                    <option>For Sale</option>
                    <option>For Rent</option>
                  </select>
                  <select
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="bg-background-surface border border-border px-4 py-3.5 text-[10px] font-bold label-caps outline-none focus:border-primary-gold cursor-pointer transition-all"
                  >
                    <option>All Cities</option>
                    {["Awka","Onitsha","Nnewi","Ekwulobia","Ihiala","Ozubulu","Obosi","Nkpor","Ogidi","Umunze","Otuocha","Aguleri","Ichi","Oraifite","Ukpor","Umuoji","Okpoko","Atani"].map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                {activeTab === "properties" ? (
                  <div className="mb-20">
                    {/* Mobile card view */}
                    <div className="md:hidden space-y-3">
                      {filteredProperties.map((p) => (
                        <div
                          key={p.id}
                          className="bg-background-surface border border-border p-4 flex flex-col gap-4"
                        >
                          <div className="flex gap-4">
                            <img
                              src={p.images[0]}
                              alt={p.title}
                              className="w-18 h-18 w-[72px] h-[72px] object-cover border border-border flex-shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <h4 className="font-playfair font-bold text-sm text-text-primary truncate">
                                {p.title}
                              </h4>
                              <p className="text-[10px] text-text-secondary uppercase tracking-widest mt-1">
                                {p.location.city}
                              </p>
                              <div className="mt-2 flex items-center gap-2">
                                <span className={cn(
                                  "text-[8px] label-caps px-2 py-0.5 font-bold",
                                  p.status === "sale" ? "bg-primary-gold text-background" : "bg-status-success text-background",
                                )}>
                                  {p.status === "sale" ? "Sale" : "Rent"}
                                </span>
                                <span className="text-sm font-playfair font-bold">
                                  ₦{p.price.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-border">
                            <div className="flex items-center gap-1.5 text-text-secondary">
                              <BarChart2 className="w-3.5 h-3.5" />
                              <span className="text-xs font-inter">{clicksData[p.id] || 0} views</span>
                            </div>
                            <div className="flex gap-2">
                              <Link to={`/property/${p.id}`} className="p-2 border border-border text-text-secondary hover:text-primary-gold hover:border-primary-gold transition-all">
                                <Eye className="w-3.5 h-3.5" />
                              </Link>
                              <Link to={`/admin/edit-listing/${p.id}`} className="p-2 border border-border text-text-secondary hover:text-primary-gold hover:border-primary-gold transition-all">
                                <Edit className="w-3.5 h-3.5" />
                              </Link>
                              <button onClick={() => handleDelete(p.id)} className="p-2 border border-border text-text-secondary hover:text-status-error hover:border-status-error transition-all">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Desktop table */}
                    <div className="hidden md:block border border-border overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-background-surface border-b border-border">
                              {["Property Details", "Status", "Price", "Views", "Actions"].map(h => (
                                <th key={h} className="px-6 py-5 text-[10px] label-caps text-text-secondary font-bold tracking-[0.15em]">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {filteredProperties.map((p) => (
                              <tr key={p.id} className="hover:bg-primary-gold/[0.02] transition-colors group">
                                <td className="px-6 py-5">
                                  <div className="flex items-center gap-4">
                                    <img
                                      src={p.images[0]}
                                      alt={p.title}
                                      className="w-14 h-14 object-cover border border-border flex-shrink-0 group-hover:border-primary-gold/30 transition-colors"
                                    />
                                    <div className="min-w-0">
                                      <h4 className="font-playfair font-bold text-sm text-text-primary group-hover:text-primary-gold transition-colors truncate">
                                        {p.title}
                                      </h4>
                                      <p className="text-[10px] text-text-secondary uppercase tracking-widest mt-0.5">
                                        {p.id.slice(0, 8)}… · {p.location.city}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-5">
                                  <span className={cn(
                                    "text-[9px] label-caps px-2.5 py-1 font-bold inline-block",
                                    p.status === "sale" ? "bg-primary-gold text-background" : "bg-status-success text-background",
                                  )}>
                                    {p.status === "sale" ? "For Sale" : "For Rent"}
                                  </span>
                                </td>
                                <td className="px-6 py-5">
                                  <span className="font-playfair font-bold text-sm">
                                    ₦{p.price.toLocaleString()}
                                  </span>
                                </td>
                                <td className="px-6 py-5">
                                  <div className="flex items-center gap-2 text-text-secondary">
                                    <BarChart2 className="w-3.5 h-3.5" />
                                    <span className="text-sm font-inter font-bold">{clicksData[p.id] || 0}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-5">
                                  <div className="flex items-center gap-2">
                                    <Link
                                      to={`/property/${p.id}`}
                                      className="p-2 border border-border text-text-secondary hover:text-primary-gold hover:border-primary-gold transition-all"
                                      title="View"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                    </Link>
                                    <Link
                                      to={`/admin/edit-listing/${p.id}`}
                                      className="p-2 border border-border text-text-secondary hover:text-primary-gold hover:border-primary-gold transition-all"
                                      title="Edit"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                    </Link>
                                    <button
                                      onClick={() => handleDelete(p.id)}
                                      className="p-2 border border-border text-text-secondary hover:text-status-error hover:border-status-error transition-all"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
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
                      <div className="py-24 text-center border border-dashed border-border">
                        <Search className="w-8 h-8 text-text-secondary/20 mx-auto mb-4" />
                        <p className="text-text-secondary text-sm font-inter">
                          No properties match your criteria.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mb-20">
                    {/* Mobile card view */}
                    <div className="md:hidden space-y-3">
                      {filteredAgents.map((a) => (
                        <div key={a.id} className="bg-background-surface border border-border p-4 flex flex-col gap-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={a.photo}
                              alt={a.name}
                              className="w-14 h-14 object-cover rounded-full border-2 border-border flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <h4 className="font-playfair font-bold text-sm text-text-primary">{a.name}</h4>
                              <p className="text-[10px] text-primary-gold uppercase tracking-widest mt-0.5">{a.role}</p>
                            </div>
                          </div>
                          <div className="space-y-1.5 text-xs font-inter text-text-secondary">
                            <p>{a.email}</p>
                            <p>{a.phone}</p>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-border">
                            <span className="text-[8px] label-caps px-2 py-1 bg-background border border-border text-text-secondary font-bold">
                              Active
                            </span>
                            <button
                              onClick={() => handleDeleteAgent(a.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 border border-status-error/40 text-status-error hover:bg-status-error hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest"
                            >
                              <Trash2 className="w-3 h-3" />
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Desktop table */}
                    <div className="hidden md:block border border-border overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-background-surface border-b border-border">
                              {["Agent", "Role", "Contact", "Status", "Actions"].map(h => (
                                <th key={h} className="px-6 py-5 text-[10px] label-caps text-text-secondary font-bold tracking-[0.15em]">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {filteredAgents.map((a) => (
                              <tr key={a.id} className="hover:bg-primary-gold/[0.02] transition-colors group">
                                <td className="px-6 py-5">
                                  <div className="flex items-center gap-4">
                                    <div className="relative flex-shrink-0">
                                      <img
                                        src={a.photo}
                                        alt={a.name}
                                        className="w-12 h-12 object-cover rounded-full border-2 border-border group-hover:border-primary-gold/40 transition-colors"
                                      />
                                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-status-success border-2 border-background rounded-full" />
                                    </div>
                                    <div className="min-w-0">
                                      <h4 className="font-playfair font-bold text-sm text-text-primary group-hover:text-primary-gold transition-colors">
                                        {a.name}
                                      </h4>
                                      <p className="text-[10px] text-text-secondary uppercase tracking-widest mt-0.5">
                                        {a.id.slice(0, 8)}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-5">
                                  <span className="text-xs font-inter text-primary-gold/80 bg-primary-gold/5 px-2.5 py-1 uppercase tracking-wider font-bold">
                                    {a.role}
                                  </span>
                                </td>
                                <td className="px-6 py-5">
                                  <div className="flex flex-col gap-1">
                                    <span className="text-xs font-inter text-text-primary/80">{a.email}</span>
                                    <span className="text-xs font-inter text-text-secondary">{a.phone}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-5">
                                  <span className="text-[9px] label-caps px-2.5 py-1 bg-background border border-border text-text-secondary font-bold inline-block group-hover:border-primary-gold/20 transition-colors">
                                    Active
                                  </span>
                                </td>
                                <td className="px-6 py-5">
                                  <button
                                    onClick={() => handleDeleteAgent(a.id)}
                                    className="p-2 border border-border text-text-secondary hover:text-status-error hover:border-status-error transition-all"
                                    title="Remove agent"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {filteredAgents.length === 0 && (
                      <div className="py-24 text-center border border-dashed border-border">
                        <Users className="w-8 h-8 text-text-secondary/20 mx-auto mb-4" />
                        <p className="text-text-secondary text-sm font-inter">
                          No agents match your search.
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
    </div>
  );
};

export default Admin;
