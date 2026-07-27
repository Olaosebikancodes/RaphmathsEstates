import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus, X, Upload } from "lucide-react";
import { useProperties } from "../context/PropertyContext";
import { cn } from "../utils/cn";
import { useToast } from "../context/ToastContext";

const AddAgent = () => {
  const { addAgent } = useProperties();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "Luxury Property Expert",
    phone: "",
    whatsapp: "",
    email: "",
    photo: "",
    bio: "",
    social: {
      instagram: "",
      twitter: "",
      facebook: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          photo: reader.result,
        }));
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      showToast("Error uploading photo: " + err.message, "error");
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Stricter Validation
    if (!formData.photo) {
      return showToast("An agent photo is required", "error");
    }

    setLoading(true);
    try {
      const agentData = {
        ...formData,
        id: `agent_${Date.now()}`,
      };
      await addAgent(agentData);
      showToast("Agent registered successfully!", "success");
      navigate("/admin");
    } catch (err) {
      const errorMsg = err.message || "Unknown error occurred";
      showToast("Error adding agent: " + errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Admin top bar */}
      <div className="sticky top-0 z-50 bg-background border-b border-border px-6 h-14 flex items-center justify-between">
        <button
          onClick={() => navigate("/admin")}
          className="flex items-center gap-2 text-text-secondary hover:text-primary-gold transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs uppercase tracking-widest font-bold">Dashboard</span>
        </button>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-playfair font-bold text-primary-gold">Raphmaths Estates</span>
          <div className="w-2 h-2 bg-primary-gold rotate-45" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Page header */}
        <div className="mb-10">
          <h1 className="text-4xl font-playfair font-bold mb-2">
            Add New Agent
          </h1>
          <p className="text-text-secondary text-sm">
            Register a new agent to manage luxury property listings.
          </p>
          <div className="w-8 h-px bg-primary-gold mt-6" />
        </div>

        <form onSubmit={handleSubmit}>
          {/* Section 01 — Personal Information */}
          <div className="py-10 border-b border-border">
            <div className="flex items-center gap-3 mb-8">
              <span className="font-cormorant text-xs font-bold text-primary-gold tracking-[0.25em]">01</span>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-primary font-inter">Personal Information</h2>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* 2-col grid for the 5 text fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-[10px] label-caps text-text-secondary font-bold">
                  Full Name
                </label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Chidi Okafor"
                  className="bg-background-surface border border-border px-4 py-3.5 text-sm font-inter outline-none focus:border-primary-gold transition-colors w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] label-caps text-text-secondary font-bold">
                  Role / Title
                </label>
                <input
                  required
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="e.g., Luxury Property Expert"
                  className="bg-background-surface border border-border px-4 py-3.5 text-sm font-inter outline-none focus:border-primary-gold transition-colors w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] label-caps text-text-secondary font-bold">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g., chidi@raphmathsestates.com"
                  className="bg-background-surface border border-border px-4 py-3.5 text-sm font-inter outline-none focus:border-primary-gold transition-colors w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] label-caps text-text-secondary font-bold">
                  Phone Number
                </label>
                <input
                  required
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g., +234 801 234 5678"
                  className="bg-background-surface border border-border px-4 py-3.5 text-sm font-inter outline-none focus:border-primary-gold transition-colors w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] label-caps text-text-secondary font-bold">
                  WhatsApp Number
                </label>
                <input
                  required
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="e.g., +234 801 234 5678"
                  className="bg-background-surface border border-border px-4 py-3.5 text-sm font-inter outline-none focus:border-primary-gold transition-colors w-full"
                />
              </div>
            </div>

            {/* Agent Photo — full-width row below the grid */}
            <div className="space-y-2">
              <label className="text-[10px] label-caps text-text-secondary font-bold">
                Agent Photo
              </label>
              <div className="flex flex-col gap-4">
                {formData.photo && (
                  <div className="relative w-24 h-24 border border-border overflow-hidden group">
                    <img
                      src={formData.photo}
                      alt="Agent"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, photo: "" }))
                      }
                      className="absolute top-1 right-1 p-1 bg-status-error text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-border cursor-pointer hover:border-primary-gold transition-colors group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-text-secondary group-hover:text-primary-gold transition-colors mb-3" />
                    <p className="text-xs text-text-secondary group-hover:text-primary-gold transition-colors">
                      <span className="font-bold">Click to upload agent photo</span>
                    </p>
                    <p className="text-[10px] text-text-secondary opacity-60 mt-1">
                      PNG, JPG or WEBP (MAX. 2MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                </label>
                {uploading && (
                  <div className="w-full flex items-center justify-center py-4">
                    <div className="w-6 h-6 border-2 border-primary-gold border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 02 — Social Media & Bio */}
          <div className="py-10">
            <div className="flex items-center gap-3 mb-8">
              <span className="font-cormorant text-xs font-bold text-primary-gold tracking-[0.25em]">02</span>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-primary font-inter">Social Media & Bio</h2>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-[10px] label-caps text-text-secondary font-bold">
                  Instagram URL
                </label>
                <input
                  type="text"
                  name="social.instagram"
                  value={formData.social.instagram}
                  onChange={handleChange}
                  placeholder="https://instagram.com/..."
                  className="bg-background-surface border border-border px-4 py-3.5 text-sm font-inter outline-none focus:border-primary-gold transition-colors w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] label-caps text-text-secondary font-bold">
                  Twitter URL
                </label>
                <input
                  type="text"
                  name="social.twitter"
                  value={formData.social.twitter}
                  onChange={handleChange}
                  placeholder="https://twitter.com/..."
                  className="bg-background-surface border border-border px-4 py-3.5 text-sm font-inter outline-none focus:border-primary-gold transition-colors w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] label-caps text-text-secondary font-bold">
                  Facebook URL
                </label>
                <input
                  type="text"
                  name="social.facebook"
                  value={formData.social.facebook}
                  onChange={handleChange}
                  placeholder="https://facebook.com/..."
                  className="bg-background-surface border border-border px-4 py-3.5 text-sm font-inter outline-none focus:border-primary-gold transition-colors w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] label-caps text-text-secondary font-bold">
                Agent Biography
              </label>
              <textarea
                required
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                placeholder="Brief description of the agent's experience and expertise..."
                className="bg-background-surface border border-border px-4 py-3.5 text-sm font-inter outline-none focus:border-primary-gold transition-colors w-full resize-none"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-8 border-t border-border">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary-gold text-background font-bold text-xs uppercase tracking-widest hover:bg-primary-lightGold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                "Registering Agent..."
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Register Agent
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAgent;
