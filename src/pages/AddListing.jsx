import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, X, Upload } from "lucide-react";
import { useProperties } from "../context/PropertyContext";
import { cn } from "../utils/cn";
import { useToast } from "../context/ToastContext";

const AddListing = () => {
  const { addProperty, agents } = useProperties();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "Duplex",
    status: "sale",
    price: "",
    location: {
      city: "Awka",
      state: "Anambra",
      area: "",
      coordinates: { lat: 6.2104, lng: 7.0667 },
    },
    bedrooms: "",
    bathrooms: "",
    size: "",
    images: [],
    description: "",
    amenities: [],
    agent_id: "",
    featured: false,
    video_url: "",
  });

  const [newAmenity, setNewAmenity] = useState("");
  const [uploading, setUploading] = useState(false);

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

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()],
      }));
      setNewAmenity("");
    }
  };

  const removeAmenity = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((a) => a !== amenity),
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      // For now, let's create a local preview URL if storage isn't ready
      // In a real app, you'd upload to Supabase Storage here
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, reader.result],
        }));
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      showToast("Error uploading file: " + err.message, "error");
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Stricter Validation
    if (Number(formData.price) <= 0) {
      return showToast("Price must be a positive number", "error");
    }
    if (Number(formData.bedrooms) <= 0) {
      return showToast("Number of bedrooms must be at least 1", "error");
    }
    if (Number(formData.bathrooms) <= 0) {
      return showToast("Number of bathrooms must be at least 1", "error");
    }
    if (Number(formData.size) <= 0) {
      return showToast("Property size must be a positive number", "error");
    }
    if (formData.images.length === 0) {
      return showToast("At least one property image is required", "error");
    }
    if (!formData.agent_id) {
      return showToast("Please assign an agent to this property", "error");
    }

    setLoading(true);
    try {
      // Basic validation and data formatting
      const { ...propertyToSubmit } = formData;
      const propertyData = {
        ...propertyToSubmit,
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        size: Number(formData.size),
        id: `prop_${Date.now()}`,
        date_added: new Date().toISOString().split("T")[0],
      };
      await addProperty(propertyData);
      showToast("Property added successfully!", "success");
      navigate("/admin");
    } catch (err) {
      const errorMsg = err.message || "Unknown error occurred";
      showToast("Error adding property: " + errorMsg, "error");
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
        <div className="mb-10">
          <h1 className="text-4xl font-playfair font-bold mb-2">
            Add New Listing
          </h1>
          <p className="text-text-secondary text-sm">
            Fill in the details below to create a new luxury property listing.
          </p>
          <div className="w-8 h-px bg-primary-gold mt-6" />
        </div>

        <form onSubmit={handleSubmit}>
          {/* Section 01 — Basic Information */}
          <div className="py-10 border-b border-border">
            <div className="flex items-center gap-3 mb-8">
              <span className="font-cormorant text-xs font-bold text-primary-gold tracking-[0.25em]">01</span>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-primary font-inter">Basic Information</h2>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] label-caps text-text-secondary font-bold">
                  Property Title
                </label>
                <input
                  required
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., 5-Bedroom Luxury Duplex"
                  className="bg-background-surface border border-border px-4 py-3.5 text-sm font-inter outline-none focus:border-primary-gold transition-colors w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] label-caps text-text-secondary font-bold">
                  Property Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="bg-background-surface border border-border px-4 py-3.5 text-sm font-inter outline-none focus:border-primary-gold transition-colors w-full"
                >
                  <option value="Duplex">Duplex</option>
                  <option value="Terrace">Terrace</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Land">Land</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] label-caps text-text-secondary font-bold">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="bg-background-surface border border-border px-4 py-3.5 text-sm font-inter outline-none focus:border-primary-gold transition-colors w-full"
                >
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] label-caps text-text-secondary font-bold">
                  Price (₦)
                </label>
                <input
                  required
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g., 85000000"
                  className="bg-background-surface border border-border px-4 py-3.5 text-sm font-inter outline-none focus:border-primary-gold transition-colors w-full"
                />
              </div>
            </div>
          </div>

          {/* Section 02 — Location */}
          <div className="py-10 border-b border-border">
            <div className="flex items-center gap-3 mb-8">
              <span className="font-cormorant text-xs font-bold text-primary-gold tracking-[0.25em]">02</span>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-primary font-inter">Location</h2>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] label-caps text-text-secondary font-bold">
                  City
                </label>
                <select
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleChange}
                  className="bg-background-surface border border-border px-4 py-3.5 text-sm font-inter outline-none focus:border-primary-gold transition-colors w-full"
                >
                  <option value="Awka">Awka</option>
                  <option value="Onitsha">Onitsha</option>
                  <option value="Nnewi">Nnewi</option>
                  <option value="Ekwulobia">Ekwulobia</option>
                  <option value="Ihiala">Ihiala</option>
                  <option value="Ozubulu">Ozubulu</option>
                  <option value="Obosi">Obosi</option>
                  <option value="Nkpor">Nkpor</option>
                  <option value="Ogidi">Ogidi</option>
                  <option value="Umunze">Umunze</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] label-caps text-text-secondary font-bold">
                  Area
                </label>
                <input
                  required
                  type="text"
                  name="location.area"
                  value={formData.location.area}
                  onChange={handleChange}
                  placeholder="e.g., GRA"
                  className="bg-background-surface border border-border px-4 py-3.5 text-sm font-inter outline-none focus:border-primary-gold transition-colors w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] label-caps text-text-secondary font-bold">
                  State
                </label>
                <input
                  disabled
                  type="text"
                  value="Anambra"
                  className="bg-background-surface/50 border border-border px-4 py-3.5 text-sm font-inter outline-none w-full cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Section 03 — Property Features */}
          <div className="py-10 border-b border-border">
            <div className="flex items-center gap-3 mb-8">
              <span className="font-cormorant text-xs font-bold text-primary-gold tracking-[0.25em]">03</span>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-primary font-inter">Property Features</h2>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] label-caps text-text-secondary font-bold">
                  Bedrooms
                </label>
                <input
                  required
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  className="bg-background-surface border border-border px-4 py-3.5 text-sm font-inter outline-none focus:border-primary-gold transition-colors w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] label-caps text-text-secondary font-bold">
                  Bathrooms
                </label>
                <input
                  required
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  className="bg-background-surface border border-border px-4 py-3.5 text-sm font-inter outline-none focus:border-primary-gold transition-colors w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] label-caps text-text-secondary font-bold">
                  Size (sqm)
                </label>
                <input
                  required
                  type="number"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  className="bg-background-surface border border-border px-4 py-3.5 text-sm font-inter outline-none focus:border-primary-gold transition-colors w-full"
                />
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <label className="text-[10px] label-caps text-text-secondary font-bold">
                Amenities
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  placeholder="e.g., Swimming Pool"
                  className="flex-1 bg-background-surface border border-border px-4 py-3.5 text-sm font-inter outline-none focus:border-primary-gold transition-colors w-full"
                />
                <button
                  type="button"
                  onClick={addAmenity}
                  className="w-full sm:w-auto bg-primary-gold text-background px-6 py-3 font-bold text-xs uppercase tracking-widest hover:bg-primary-lightGold transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="flex items-center gap-2 bg-background border border-border px-3 py-1.5 text-xs font-inter"
                  >
                    {amenity}
                    <button
                      type="button"
                      onClick={() => removeAmenity(amenity)}
                      className="text-text-secondary hover:text-status-error transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 04 — Media & Agent */}
          <div className="py-10">
            <div className="flex items-center gap-3 mb-8">
              <span className="font-cormorant text-xs font-bold text-primary-gold tracking-[0.25em]">04</span>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-primary font-inter">Media & Agent</h2>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] label-caps text-text-secondary font-bold">
                  Property Images
                </label>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-border cursor-pointer hover:border-primary-gold transition-colors group">
                      <div className="flex flex-col items-center justify-center">
                        <Upload className="w-8 h-8 text-text-secondary group-hover:text-primary-gold transition-colors mb-3" />
                        <p className="text-sm text-text-secondary group-hover:text-primary-gold transition-colors font-bold">
                          Click to upload
                        </p>
                        <p className="text-[10px] text-text-secondary/60 mt-1">
                          PNG, JPG or WEBP (MAX. 5MB)
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
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {formData.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square border border-border overflow-hidden group"
                    >
                      <img
                        src={img}
                        alt={`Property ${idx}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-status-error text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {uploading && (
                    <div className="aspect-square border border-border flex items-center justify-center bg-background/50">
                      <div className="w-6 h-6 border-2 border-primary-gold border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  {formData.images.length === 0 && !uploading && (
                    <div className="aspect-square border border-dashed border-border flex flex-col items-center justify-center text-text-secondary text-[10px] label-caps">
                      <Upload className="w-4 h-4 mb-2 opacity-50" />
                      No Images
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] label-caps text-text-secondary font-bold">
                  Assigned Agent
                </label>
                <select
                  required
                  name="agent_id"
                  value={formData.agent_id}
                  onChange={handleChange}
                  className="bg-background-surface border border-border px-4 py-3.5 text-sm font-inter outline-none focus:border-primary-gold transition-colors w-full"
                >
                  <option value="">Select an Agent</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] label-caps text-text-secondary font-bold">
                  Description
                </label>
                <textarea
                  required
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="bg-background-surface border border-border px-4 py-3.5 text-sm font-inter outline-none focus:border-primary-gold transition-colors w-full resize-none"
                  placeholder="Detailed description of the property..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] label-caps text-text-secondary font-bold">
                  Video URL (Optional)
                </label>
                <input
                  type="url"
                  name="video_url"
                  value={formData.video_url}
                  onChange={handleChange}
                  placeholder="e.g., https://www.youtube.com/watch?v=..."
                  className="bg-background-surface border border-border px-4 py-3.5 text-sm font-inter outline-none focus:border-primary-gold transition-colors w-full"
                />
                <p className="text-[10px] text-text-secondary opacity-60">
                  YouTube, Vimeo or direct video link
                </p>
              </div>

              <div className="flex items-center gap-4 py-4 border border-border px-4">
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-text-primary">Featured Listing</p>
                  <p className="text-[10px] text-text-secondary mt-0.5">Appears prominently on the homepage and listings page</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, featured: !prev.featured }))}
                  className={`relative w-11 h-6 transition-colors flex-shrink-0 ${formData.featured ? 'bg-primary-gold' : 'bg-border'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white transition-transform ${formData.featured ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary-gold text-background font-bold text-xs uppercase tracking-widest hover:bg-primary-lightGold transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? "Creating Listing..." : "Create Listing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddListing;
