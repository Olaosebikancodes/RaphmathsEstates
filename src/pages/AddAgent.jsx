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
    <div className="min-h-screen bg-background text-text-primary pt-20 md:pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <button
          onClick={() => navigate("/admin")}
          className="flex items-center gap-2 text-text-secondary hover:text-primary-gold transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs uppercase tracking-widest font-bold">
            Back to Dashboard
          </span>
        </button>

        <div className="mb-12">
          <h1 className="text-4xl font-playfair font-bold mb-2">
            Add New Agent
          </h1>
          <p className="text-text-secondary">
            Register a new agent to manage luxury property listings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="bg-background-surface border border-border p-8 rounded-sm shadow-sm">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-primary-gold" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  className="w-full bg-background border border-border px-4 py-3 text-sm font-inter outline-none focus:border-primary-gold transition-all rounded-sm"
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
                  className="w-full bg-background border border-border px-4 py-3 text-sm font-inter outline-none focus:border-primary-gold transition-all rounded-sm"
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
                  className="w-full bg-background border border-border px-4 py-3 text-sm font-inter outline-none focus:border-primary-gold transition-all rounded-sm"
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
                  className="w-full bg-background border border-border px-4 py-3 text-sm font-inter outline-none focus:border-primary-gold transition-all rounded-sm"
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
                  className="w-full bg-background border border-border px-4 py-3 text-sm font-inter outline-none focus:border-primary-gold transition-all rounded-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] label-caps text-text-secondary font-bold">
                  Agent Photo
                </label>
                <div className="flex flex-col gap-4">
                  {formData.photo && (
                    <div className="relative w-24 h-24 border border-border rounded-sm overflow-hidden group">
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
                        className="absolute top-1 right-1 p-1 bg-status-error text-white rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-sm cursor-pointer hover:border-primary-gold transition-colors group">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 text-text-secondary group-hover:text-primary-gold transition-colors mb-2" />
                        <p className="text-xs text-text-secondary group-hover:text-primary-gold transition-colors">
                          <span className="font-bold">Click to upload</span>{" "}
                          agent photo
                        </p>
                        <p className="text-[10px] text-text-secondary opacity-60">
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
                  </div>
                  {uploading && (
                    <div className="w-full flex items-center justify-center py-4">
                      <div className="w-6 h-6 border-2 border-primary-gold border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Social & Bio */}
          <div className="bg-background-surface border border-border p-8 rounded-sm shadow-sm">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-primary-gold" />
              Social Media & Bio
            </h2>
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
                  className="w-full bg-background border border-border px-4 py-3 text-sm font-inter outline-none focus:border-primary-gold transition-all rounded-sm"
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
                  className="w-full bg-background border border-border px-4 py-3 text-sm font-inter outline-none focus:border-primary-gold transition-all rounded-sm"
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
                  className="w-full bg-background border border-border px-4 py-3 text-sm font-inter outline-none focus:border-primary-gold transition-all rounded-sm"
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
                className="w-full bg-background border border-border px-4 py-3 text-sm font-inter outline-none focus:border-primary-gold transition-all rounded-sm resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-gold text-background py-4 font-bold text-sm uppercase tracking-widest hover:bg-primary-lightGold transition-all rounded-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
        </form>
      </div>
    </div>
  );
};

export default AddAgent;
