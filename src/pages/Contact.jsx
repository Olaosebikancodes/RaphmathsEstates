import React from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Send,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const Contact = () => {
  const officeLocation = [6.2104, 7.0667]; // Awka, Anambra

  return (
    <div className="pt-32 pb-20 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-20">
          <h1 className="text-5xl md:text-6xl font-playfair font-bold text-text-primary mb-6">
            Let's Talk Luxury
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl leading-relaxed">
            Whether you're looking to acquire, lease, or list a premium
            property, our team of experts is ready to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-12">
              <h2 className="text-3xl font-playfair font-bold text-text-primary mb-8">
                Visit Our Office
              </h2>
              <div className="flex flex-col gap-8">
                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 bg-background-surface border border-border flex items-center justify-center flex-shrink-0 group-hover:border-primary-gold transition-colors">
                    <MapPin className="w-5 h-5 text-primary-gold" />
                  </div>
                  <div>
                    <h4 className="font-playfair font-bold text-xl text-text-primary mb-1">
                      Visit Us
                    </h4>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      Raphmaths Estates Office
                      <br />
                      123 Luxury Avenue, Ifite, Awka, Anambra State.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 bg-background-surface border border-border flex items-center justify-center flex-shrink-0 group-hover:border-primary-gold transition-colors">
                    <Phone className="w-5 h-5 text-primary-gold" />
                  </div>
                  <div>
                    <h4 className="font-playfair font-bold text-xl text-text-primary mb-1">
                      Call Us
                    </h4>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      +234 800 123 4567
                      <br />
                      +234 801 234 5678
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 bg-background-surface border border-border flex items-center justify-center flex-shrink-0 group-hover:border-primary-gold transition-colors">
                    <Mail className="w-5 h-5 text-primary-gold" />
                  </div>
                  <div>
                    <h4 className="font-playfair font-bold text-xl text-text-primary mb-1">
                      Email Us
                    </h4>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      info@raphmathsestates.com
                      <br />
                      sales@raphmathsestates.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-12">
              <h3 className="text-2xl font-playfair font-bold text-text-primary mb-6">
                Social Media
              </h3>
              <div className="flex gap-4">
                {[Facebook, Instagram, Twitter, MessageCircle].map(
                  (Icon, idx) => (
                    <a
                      key={idx}
                      href="#"
                      className="w-12 h-12 bg-background-surface border border-border flex items-center justify-center hover:border-primary-gold hover:text-primary-gold transition-all"
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  ),
                )}
              </div>
            </div>

            {/* Map Overlay */}
            <div className="h-64 w-full rounded-sm overflow-hidden border border-border">
              <MapContainer
                center={officeLocation}
                zoom={15}
                scrollWheelZoom={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={officeLocation} icon={customIcon}>
                  <Popup>
                    <div className="font-playfair font-bold">
                      Raphmaths Estates Office
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-background-surface border border-border p-10 rounded-sm shadow-2xl"
          >
            <h2 className="text-3xl font-playfair font-bold text-text-primary mb-8">
              Send a Message
            </h2>
            <form className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="label-caps text-[10px] text-text-secondary">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="bg-background border border-border p-4 text-sm font-inter text-text-primary outline-none focus:border-primary-gold rounded-sm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="label-caps text-[10px] text-text-secondary">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="bg-background border border-border p-4 text-sm font-inter text-text-primary outline-none focus:border-primary-gold rounded-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="label-caps text-[10px] text-text-secondary">
                  Subject
                </label>
                <select className="bg-background border border-border p-4 text-sm font-inter text-text-primary outline-none focus:border-primary-gold rounded-sm appearance-none cursor-pointer">
                  <option>General Inquiry</option>
                  <option>Buying Property</option>
                  <option>Renting Property</option>
                  <option>Listing My Property</option>
                  <option>Corporate Partnership</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="label-caps text-[10px] text-text-secondary">
                  Your Message
                </label>
                <textarea
                  rows="6"
                  placeholder="Tell us how we can help you..."
                  className="bg-background border border-border p-4 text-sm font-inter text-text-primary outline-none focus:border-primary-gold rounded-sm resize-none"
                ></textarea>
              </div>

              <button className="flex items-center justify-center gap-3 w-full py-5 bg-primary-gold text-background font-bold text-xs uppercase tracking-widest hover:bg-primary-lightGold transition-all rounded-sm shadow-xl">
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
