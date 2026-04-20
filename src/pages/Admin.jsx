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
      console.error("Error fetching clicks:", err.message);
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

  const filteredProperties = properties.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredAgents = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) return null;

  return (
    <div className="flex min-h-screen bg-background text-text-primary pt-20">
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-50 bg-primary-gold text-background p-4 rounded-full shadow-2xl"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Admin Sidebar Overlay (Mobile) */}
      <AnimatePresence>
        {isSidebarOpen && window.innerWidth <= 768 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-[60] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Admin Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-20 bottom-0 bg-background-surface border-r border-border transition-all duration-300 z-[70] md:z-40",
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
        <div className="p-8 md:p-12 max-w-7xl mx-auto">
          {/* Header Area */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
            <div>
              <h1 className="text-4xl font-playfair font-bold mb-2">
                {activeTab === "properties"
                  ? "Property Inventory"
                  : "Elite Agents"}
              </h1>
              <p className="text-text-secondary text-sm">
                {activeTab === "properties"
                  ? "Manage your luxury listings and track engagement."
                  : "Manage your team of professional real estate experts."}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {activeTab === "agents" ? (
                <Link
                  to="/admin/add-agent"
                  className="flex items-center gap-3 bg-primary-gold text-background px-8 py-4 font-bold text-xs uppercase tracking-widest hover:bg-primary-lightGold transition-all rounded-sm shadow-xl"
                >
                  <UserPlus className="w-4 h-4" />
                  Register New Agent
                </Link>
              ) : (
                <Link
                  to="/admin/add-listing"
                  className="flex items-center gap-3 bg-primary-gold text-background px-8 py-4 font-bold text-xs uppercase tracking-widest hover:bg-primary-lightGold transition-all rounded-sm shadow-xl"
                >
                  <Plus className="w-4 h-4" />
                  Create New Listing
                </Link>
              )}
            </div>
          </div>

          {/* Stats Bar (Condensed) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                label: "Total Properties",
                value: properties.length,
                icon: Building2,
              },
              { label: "Total Agents", value: agents.length, icon: Users },
              {
                label: "Total Clicks",
                value: Object.values(clicksData).reduce((a, b) => a + b, 0),
                icon: BarChart2,
              },
              {
                label: "Avg. Price",
                value: `₦${Math.round(properties.reduce((acc, p) => acc + p.price, 0) / (properties.length || 1) / 1000000)}M`,
                icon: Search,
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-background-surface border border-border p-6 rounded-sm shadow-sm flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-primary-gold/10 flex items-center justify-center rounded-sm">
                  <stat.icon className="w-6 h-6 text-primary-gold" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{stat.value}</h3>
                  <p className="text-[10px] text-text-secondary uppercase tracking-widest font-medium">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Search & Filters */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary group-focus-within:text-primary-gold transition-colors" />
              <input
                type="text"
                placeholder={
                  activeTab === "properties"
                    ? "Search by title, location or ID..."
                    : "Search by name, role or ID..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background-surface border border-border pl-12 pr-4 py-4 text-sm font-inter outline-none focus:border-primary-gold transition-all rounded-sm shadow-sm"
              />
            </div>
            {activeTab === "properties" && (
              <div className="flex gap-2">
                <select className="bg-background-surface border border-border px-4 py-4 text-xs font-bold label-caps outline-none focus:border-primary-gold rounded-sm cursor-pointer shadow-sm">
                  <option>All Status</option>
                  <option>For Sale</option>
                  <option>For Rent</option>
                </select>
                <select className="bg-background-surface border border-border px-4 py-4 text-xs font-bold label-caps outline-none focus:border-primary-gold rounded-sm cursor-pointer shadow-sm">
                  <option>All Cities</option>
                  <option>Awka</option>
                  <option>Onitsha</option>
                  <option>Nnewi</option>
                  <option>Ekwulobia</option>
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
                <div className="bg-background-surface border border-border rounded-sm shadow-sm overflow-hidden mb-20">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-background border-b border-border">
                          <th className="px-6 py-5 text-[10px] label-caps text-text-secondary font-bold">
                            Property
                          </th>
                          <th className="px-6 py-5 text-[10px] label-caps text-text-secondary font-bold">
                            Status
                          </th>
                          <th className="px-6 py-5 text-[10px] label-caps text-text-secondary font-bold">
                            Price
                          </th>
                          <th className="px-6 py-5 text-[10px] label-caps text-text-secondary font-bold">
                            Clicks
                          </th>
                          <th className="px-6 py-5 text-[10px] label-caps text-text-secondary font-bold">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredProperties.map((p) => (
                          <tr
                            key={p.id}
                            className="hover:bg-background/50 transition-colors group"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                <img
                                  src={p.images[0]}
                                  alt={p.title}
                                  className="w-12 h-12 object-cover rounded-sm border border-border shadow-sm"
                                />
                                <div>
                                  <h4 className="font-bold text-sm text-text-primary group-hover:text-primary-gold transition-colors">
                                    {p.title}
                                  </h4>
                                  <p className="text-[10px] text-text-secondary uppercase tracking-widest mt-0.5">
                                    ID: {p.id} • {p.location.city}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={cn(
                                  "text-[10px] label-caps px-2 py-1 rounded-sm font-bold",
                                  p.status === "sale"
                                    ? "bg-primary-gold/10 text-primary-gold"
                                    : "bg-status-success/10 text-status-success",
                                )}
                              >
                                {p.status === "sale" ? "Sale" : "Rent"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm font-bold">
                                ₦{p.price.toLocaleString()}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2 text-text-secondary">
                                <BarChart2 className="w-4 h-4" />
                                <span className="text-xs font-inter font-medium">
                                  {clicksData[p.id] || 0}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Link
                                  to={`/property/${p.id}`}
                                  className="p-2 hover:bg-background border border-transparent hover:border-border text-text-secondary hover:text-primary-gold transition-all rounded-sm"
                                  title="View"
                                >
                                  <Eye className="w-4 h-4" />
                                </Link>
                                <Link
                                  to={`/admin/edit-listing/${p.id}`}
                                  className="p-2 hover:bg-background border border-transparent hover:border-border text-text-secondary hover:text-primary-gold transition-all rounded-sm"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </Link>
                                <button
                                  onClick={() => handleDelete(p.id)}
                                  className="p-2 hover:bg-background border border-transparent hover:border-border text-text-secondary hover:text-status-error transition-all rounded-sm"
                                  title="Delete"
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
                  {filteredProperties.length === 0 && (
                    <div className="py-20 text-center">
                      <Search className="w-12 h-12 text-text-secondary mx-auto mb-4 opacity-30" />
                      <p className="text-text-secondary italic">
                        No listings found matching your search.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-background-surface border border-border rounded-sm shadow-sm overflow-hidden mb-20">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-background border-b border-border">
                          <th className="px-6 py-5 text-[10px] label-caps text-text-secondary font-bold">
                            Agent
                          </th>
                          <th className="px-6 py-5 text-[10px] label-caps text-text-secondary font-bold">
                            Role
                          </th>
                          <th className="px-6 py-5 text-[10px] label-caps text-text-secondary font-bold">
                            Email
                          </th>
                          <th className="px-6 py-5 text-[10px] label-caps text-text-secondary font-bold">
                            Phone
                          </th>
                          <th className="px-6 py-5 text-[10px] label-caps text-text-secondary font-bold">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredAgents.map((a) => (
                          <tr
                            key={a.id}
                            className="hover:bg-background/50 transition-colors group"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                <img
                                  src={a.photo}
                                  alt={a.name}
                                  className="w-10 h-10 object-cover rounded-full border border-border shadow-sm"
                                />
                                <div>
                                  <h4 className="font-bold text-sm text-text-primary group-hover:text-primary-gold transition-colors">
                                    {a.name}
                                  </h4>
                                  <p className="text-[10px] text-text-secondary uppercase tracking-widest mt-0.5">
                                    ID: {a.id}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-xs font-inter font-medium">
                                {a.role}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-xs font-inter">{a.email}</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-xs font-inter">{a.phone}</p>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleDeleteAgent(a.id)}
                                  className="p-2 hover:bg-background border border-transparent hover:border-border text-text-secondary hover:text-status-error transition-all rounded-sm"
                                  title="Delete"
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
                  {filteredAgents.length === 0 && (
                    <div className="py-20 text-center">
                      <Search className="w-12 h-12 text-text-secondary mx-auto mb-4 opacity-30" />
                      <p className="text-text-secondary italic">
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
