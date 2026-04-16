import React from "react";
import { motion } from "framer-motion";
import {
  Award,
  Target,
  Heart,
  Users,
  Briefcase,
  TrendingUp,
} from "lucide-react";

const About = () => {
  const stats = [
    { label: "Properties Listed", value: "500+" },
    { label: "Happy Clients", value: "1,200+" },
    { label: "Years Experience", value: "15+" },
    { label: "Award Wins", value: "12" },
  ];

  const team = [
    {
      name: "Chidi Okafor",
      role: "Principal Agent",
      photo:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop",
    },
    {
      name: "Sarah Emetulu",
      role: "Onitsha Regional Manager",
      photo:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop",
    },
    {
      name: "Benson Udoh",
      role: "Nnewi Property Consultant",
      photo:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop",
    },
  ];

  return (
    <div className="pt-32 pb-20 bg-background min-h-screen">
      {/* Hero */}
      <section className="px-6 md:px-12 mb-32">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h4 className="label-caps text-primary-gold mb-6 tracking-[0.2em]">
              Our Story
            </h4>
            <h1 className="text-5xl md:text-6xl font-playfair font-bold text-text-primary mb-8 leading-tight">
              Redefining Luxury in{" "}
              <span className="text-primary-gold italic">Anambra State</span>
            </h1>
            <p className="text-text-secondary text-lg font-inter leading-relaxed mb-8">
              Founded in 2010, Raphmaths Estates was born out of a vision to
              bring world-class luxury real estate standards to Nigeria's
              Anambra State. We believe that a home is more than just a
              structure; it's a sanctuary, an investment, and a legacy.
            </p>
            <p className="text-text-secondary text-lg font-inter leading-relaxed">
              Our commitment to excellence, integrity, and bespoke service has
              made us the premier choice for high-net-worth individuals and
              corporate entities looking for the most exclusive properties in
              Awka, Onitsha, Nnewi, and Ekwulobia.
            </p>
          </motion.div>
          <div className="relative aspect-square md:aspect-video lg:aspect-square overflow-hidden rounded-sm">
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop"
              alt="Luxury Architecture"
              className="w-full h-full object-cover shadow-2xl"
            />
            <div className="absolute inset-0 border-[20px] border-primary-gold/10 -m-4 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-background-surface border-y border-border px-6 md:px-12 mb-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <h3 className="text-4xl md:text-5xl font-playfair font-bold text-primary-gold mb-2">
                  {stat.value}
                </h3>
                <p className="label-caps text-[10px] text-text-secondary tracking-widest">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="px-6 md:px-12 mb-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: Target,
                title: "Our Mission",
                desc: "To provide unparalleled real estate experiences that combine local expertise with international luxury standards.",
              },
              {
                icon: Heart,
                title: "Our Values",
                desc: "Integrity, transparency, and a relentless pursuit of excellence in every property we represent.",
              },
              {
                icon: TrendingUp,
                title: "Our Vision",
                desc: "To be the most trusted name in Nigerian luxury real estate, setting the benchmark for premium property services.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-background-surface p-10 border border-border rounded-sm hover:border-primary-gold transition-colors duration-500"
              >
                <div className="w-12 h-12 bg-background flex items-center justify-center border border-border mb-8">
                  <item.icon className="w-6 h-6 text-primary-gold" />
                </div>
                <h3 className="text-2xl font-playfair font-bold text-text-primary mb-4">
                  {item.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <h4 className="label-caps text-primary-gold mb-6 tracking-[0.2em]">
            Our Experts
          </h4>
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-text-primary mb-20">
            The Faces of Raphmaths Estates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {team.map((member, idx) => (
              <div key={idx} className="group">
                <div className="aspect-[4/5] overflow-hidden rounded-sm mb-6 relative">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                </div>
                <h4 className="text-xl font-playfair font-bold text-text-primary mb-1">
                  {member.name}
                </h4>
                <p className="label-caps text-[10px] text-primary-gold font-bold">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
