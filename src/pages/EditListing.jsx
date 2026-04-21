import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, X, Upload } from "lucide-react";
import { useProperties } from "../context/PropertyContext";
import { cn } from "../utils/cn";
import { useToast } from "../context/ToastContext";

const EditListing = () => {
  const {
    updateProperty,
    getPropertyById,
    agents,
    loading: contextLoading,
  } = useProperties();
  const navigate = useNavigate();
  const { id } = useParams();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(null);

  const [newAmenity, setNewAmenity] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!contextLoading) {
      const property = getPropertyById(id);
      if (property) {
        setFormData({
          ...property,
          agent_id:
            typeof property.agent === "object"
              ? property.agent.id
              : property.agent,
        });
      } else {
        navigate("/admin");
      }
    }
  }, [id, getPropertyById, contextLoading, navigate]);

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
      const { agent, dateAdded, ...propertyToUpdate } = formData;
      const finalProperty = {
        ...propertyToUpdate,
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        size: Number(formData.size),
      };
      await updateProperty(id, finalProperty);
      showToast("Listing updated successfully!", "success");
      navigate("/admin");
    } catch (err) {
      const errorMsg = err.message || "Unknown error occurred";
      showToast("Error updating property: " + errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  if (contextLoading || !formData) return null;

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
            Edit Listing
          </h1>
          <p className="text-text-secondary">
            Update the details for property ID: {id}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-background-surface border border-border p-8 rounded-sm shadow-sm">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-primary-gold" />
              Basic Information
            </h2>
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
                  className="w-full bg-background border border-border px-4 py-3 text-sm font-inter outline-none focus:border-primary-gold transition-all rounded-sm"
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
                  className="w-full bg-background border border-border px-4 py-3 text-sm font-inter outline-none focus:border-primary-gold transition-all rounded-sm"
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
                  className="w-full bg-background border border-border px-4 py-3 text-sm font-inter outline-none focus:border-primary-gold transition-all rounded-sm"
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
                  className="w-full bg-background border border-border px-4 py-3 text-sm font-inter outline-none focus:border-primary-gold transition-all rounded-sm"
                />
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="bg-background-surface border border-border p-8 rounded-sm shadow-sm">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-primary-gold" />
              Location Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] label-caps text-text-secondary font-bold">
                  City
                </label>
                <select
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleChange}
                  className="w-full bg-background border border-border px-4 py-3 text-sm font-inter outline-none focus:border-primary-gold transition-all rounded-sm"
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
                  className="w-full bg-background border border-border px-4 py-3 text-sm font-inter outline-none focus:border-primary-gold transition-all rounded-sm"
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
                  className="w-full bg-background/50 border border-border px-4 py-3 text-sm font-inter outline-none rounded-sm cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Property Features */}
          <div className="bg-background-surface border border-border p-8 rounded-sm shadow-sm">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-primary-gold" />
              Property Features
            </h2>
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
                  className="w-full bg-background border border-border px-4 py-3 text-sm font-inter outline-none focus:border-primary-gold transition-all rounded-sm"
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
                  className="w-full bg-background border border-border px-4 py-3 text-sm font-inter outline-none focus:border-primary-gold transition-all rounded-sm"
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
                  className="w-full bg-background border border-border px-4 py-3 text-sm font-inter outline-none focus:border-primary-gold transition-all rounded-sm"
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
                  placeholder="Add an amenity..."
                  className="flex-1 bg-background border border-border px-4 py-3 text-sm font-inter outline-none focus:border-primary-gold transition-all rounded-sm"
                />
                <button
                  type="button"
                  onClick={addAmenity}
                  className="w-full sm:w-auto bg-primary-gold text-background px-6 py-3 font-bold text-xs uppercase tracking-widest hover:bg-primary-lightGold transition-all rounded-sm"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="flex items-center gap-2 bg-background border border-border px-3 py-1.5 rounded-sm text-xs font-inter"
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

          {/* Media & Agent */}
          <div className="bg-background-surface border border-border p-8 rounded-sm shadow-sm">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-primary-gold" />
              Media & Agent
            </h2>
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] label-caps text-text-secondary font-bold">
                  Property Images
                </label>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-sm cursor-pointer hover:border-primary-gold transition-colors group">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 text-text-secondary group-hover:text-primary-gold transition-colors mb-2" />
                        <p className="text-xs text-text-secondary group-hover:text-primary-gold transition-colors">
                          <span className="font-bold">Click to upload</span> or
                          drag and drop
                        </p>
                        <p className="text-[10px] text-text-secondary opacity-60">
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
                      className="relative aspect-square border border-border rounded-sm overflow-hidden group"
                    >
                      <img
                        src={img}
                        alt={`Property ${idx}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-status-error text-white rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
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
                  className="w-full bg-background border border-border px-4 py-3 text-sm font-inter outline-none focus:border-primary-gold transition-all rounded-sm"
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
                  className="w-full bg-background border border-border px-4 py-3 text-sm font-inter outline-none focus:border-primary-gold transition-all rounded-sm resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] label-caps text-text-secondary font-bold">
                  Video URL (Optional)
                </label>
                <input
                  type="url"
                  name="video_url"
                  value={formData.video_url || ""}
                  onChange={handleChange}
                  placeholder="e.g., https://www.youtube.com/watch?v=..."
                  className="w-full bg-background border border-border px-4 py-3 text-sm font-inter outline-none focus:border-primary-gold transition-all rounded-sm"
                />
                <p className="text-[10px] text-text-secondary opacity-60">
                  YouTube, Vimeo or direct video link
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      featured: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 accent-primary-gold"
                />
                <label
                  htmlFor="featured"
                  className="text-xs font-bold uppercase tracking-widest text-text-secondary cursor-pointer"
                >
                  Mark as Featured Listing
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-gold text-background py-4 font-bold text-sm uppercase tracking-widest hover:bg-primary-lightGold transition-all rounded-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              "Saving Changes..."
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditListing;
