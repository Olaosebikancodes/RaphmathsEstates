import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  BarChart2,
  LogOut,
  Search,
} from "lucide-react";
import { useProperties } from "../context/PropertyContext";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "../utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { getUser, signOut, supabase } from "../lib/supabase";

const Admin = () => {
  const { properties, fetchInitialData } = useProperties();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [clicksData, setClicksData] = useState({});
  const navigate = useNavigate();

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
      const { error } = await supabase.from("properties").delete().eq("id", id);
      if (error) throw error;
      fetchInitialData(); // Refresh context
    } catch (err) {
      alert("Error deleting property: " + err.message);
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

  if (loading) return null;

  return (
    <div className="flex min-h-screen bg-background text-text-primary pt-20 md:pt-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-playfair font-bold mb-2">
              Admin Dashboard
            </h1>
            <p className="text-text-secondary">
              Manage your luxury listings and track performance.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 border border-border px-6 py-3 font-bold text-xs uppercase tracking-widest hover:bg-status-error/10 hover:border-status-error/50 hover:text-status-error transition-all rounded-sm"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
            <button className="flex items-center gap-2 bg-primary-gold text-background px-8 py-3 font-bold text-sm uppercase tracking-widest hover:bg-primary-lightGold transition-all rounded-sm shadow-lg w-fit">
              <Plus className="w-4 h-4" />
              Add New Listing
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Total Listings", value: properties.length, icon: Eye },
            {
              label: "Total Clicks",
              value: Object.values(clicksData).reduce((a, b) => a + b, 0),
              icon: BarChart2,
            },
            { label: "Active Agents", value: "3", icon: Edit },
            {
              label: "Avg. Price",
              value: `₦${Math.round(properties.reduce((acc, p) => acc + p.price, 0) / (properties.length || 1) / 1000000)}M`,
              icon: Search,
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-background-surface border border-border p-6 rounded-sm shadow-sm hover:border-primary-gold transition-colors group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-primary-gold/10 flex items-center justify-center rounded-full group-hover:bg-primary-gold/20 transition-colors">
                  <stat.icon className="w-5 h-5 text-primary-gold" />
                </div>
                <span className="text-[10px] label-caps text-status-success">
                  +12%
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
              <p className="text-xs text-text-secondary uppercase tracking-widest">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary group-focus-within:text-primary-gold transition-colors" />
            <input
              type="text"
              placeholder="Search by title or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background-surface border border-border pl-12 pr-4 py-4 text-sm font-inter outline-none focus:border-primary-gold transition-all rounded-sm"
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-background-surface border border-border px-4 py-4 text-sm font-inter outline-none focus:border-primary-gold rounded-sm cursor-pointer">
              <option>All Status</option>
              <option>For Sale</option>
              <option>For Rent</option>
            </select>
            <select className="bg-background-surface border border-border px-4 py-4 text-sm font-inter outline-none focus:border-primary-gold rounded-sm cursor-pointer">
              <option>All Cities</option>
              <option>Awka</option>
              <option>Onitsha</option>
              <option>Nnewi</option>
            </select>
          </div>
        </div>

        {/* Property List Table */}
        <div className="bg-background-surface border border-border rounded-sm shadow-sm overflow-hidden mb-20">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background border-b border-border">
                  <th className="px-6 py-4 text-[10px] label-caps text-text-secondary font-bold">
                    Property
                  </th>
                  <th className="px-6 py-4 text-[10px] label-caps text-text-secondary font-bold">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[10px] label-caps text-text-secondary font-bold">
                    Price
                  </th>
                  <th className="px-6 py-4 text-[10px] label-caps text-text-secondary font-bold">
                    Clicks
                  </th>
                  <th className="px-6 py-4 text-[10px] label-caps text-text-secondary font-bold">
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
                          className="w-12 h-12 object-cover rounded-sm border border-border"
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
                        <span className="text-xs font-inter">
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
                        <button
                          className="p-2 hover:bg-background border border-transparent hover:border-border text-text-secondary hover:text-primary-gold transition-all rounded-sm"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
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
      </div>
    </div>
  );
};

export default Admin;
