import React from "react";
import { motion } from "framer-motion";
import { Target, Heart, TrendingUp, Instagram, Twitter, Facebook } from "lucide-react";
import { useProperties } from "../context/PropertyContext";

const revealVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay },
  }),
};

const About = () => {
  const { agents } = useProperties();

  const stats = [
    { label: "Properties Listed", value: "500+" },
    { label: "Happy Clients", value: "1,200+" },
    { label: "Years Experience", value: "15+" },
    { label: "Award Wins", value: "12" },
  ];

  return (
    <div className="pt-24 md:pt-32 pb-20 bg-background min-h-screen">
      {/* Hero — asymmetric 2-col, no eyebrow */}
      <section className="px-6 md:px-12 py-20 md:py-0 mb-20 md:mb-32">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={revealVariant}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-playfair font-bold text-text-primary mb-8 leading-tight">
              Redefining Luxury in{" "}
              <span className="text-primary-gold italic">Anambra State</span>
            </h1>
            <div className="w-16 h-px bg-primary-gold mb-8" />
            <p className="text-text-secondary text-base md:text-lg font-inter leading-relaxed mb-6">
              Founded in 2010, Raphmaths Estates was born out of a vision to
              bring world-class luxury real estate standards to Nigeria's
              Anambra State. We believe that a home is more than just a
              structure — it's a sanctuary, an investment, and a legacy.
            </p>
            <p className="text-text-secondary text-base md:text-lg font-inter leading-relaxed">
              Our commitment to excellence, integrity, and bespoke service has
              made us the premier choice for high-net-worth individuals and
              corporate entities looking for the most exclusive properties in
              Awka1, Awka2, Awka3, Nkwelle1, Nkwelle2, 2nd Niger Bridge Onitsha, Obosi, and Asaba.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={revealVariant}
            custom={0.15}
            className="relative aspect-square md:aspect-video lg:aspect-square overflow-hidden"
          >
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop"
              alt="Luxury Architecture"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 border border-primary-gold/20 pointer-events-none" />
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 md:py-24 bg-background-surface border-y border-border px-6 md:px-12 mb-20 md:mb-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-0 divide-x-0 lg:divide-x divide-border">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={revealVariant}
                custom={idx * 0.08}
                className="text-center lg:px-12"
              >
                <h3 className="text-3xl md:text-5xl font-playfair font-bold text-primary-gold mb-2">
                  {stat.value}
                </h3>
                <p className="label-caps text-[10px] text-text-secondary tracking-widest">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission / Values / Vision — asymmetric, not 3-equal-cards */}
      <section className="px-6 md:px-12 mb-20 md:mb-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 border border-border">
            {/* Mission — occupies 3 of 5 columns */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={revealVariant}
              className="lg:col-span-3 bg-background-surface p-10 md:p-14 border-b lg:border-b-0 lg:border-r border-border hover:bg-primary-gold/[0.03] transition-colors duration-500"
            >
              <div className="w-12 h-12 bg-background flex items-center justify-center border border-border mb-10">
                <Target className="w-6 h-6 text-primary-gold" />
              </div>
              <h3 className="text-3xl md:text-4xl font-playfair font-bold text-text-primary mb-6 leading-tight">
                Our Mission
              </h3>
              <p className="text-text-secondary text-base leading-relaxed max-w-lg">
                To provide unparalleled real estate experiences that combine
                local expertise with international luxury standards — making
                premium property ownership accessible to those who demand the
                finest in Anambra State.
              </p>
            </motion.div>

            {/* Values + Vision stacked in the remaining 2 columns */}
            <div className="lg:col-span-2 flex flex-col divide-y divide-border">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={revealVariant}
                custom={0.1}
                className="p-8 md:p-10 hover:bg-primary-gold/[0.03] transition-colors duration-500 flex-1"
              >
                <div className="w-10 h-10 bg-background flex items-center justify-center border border-border mb-6">
                  <Heart className="w-5 h-5 text-primary-gold" />
                </div>
                <h3 className="text-xl font-playfair font-bold text-text-primary mb-3">
                  Our Values
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Integrity, transparency, and a relentless pursuit of
                  excellence in every property we represent.
                </p>
              </motion.div>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={revealVariant}
                custom={0.18}
                className="p-8 md:p-10 hover:bg-primary-gold/[0.03] transition-colors duration-500 flex-1"
              >
                <div className="w-10 h-10 bg-background flex items-center justify-center border border-border mb-6">
                  <TrendingUp className="w-5 h-5 text-primary-gold" />
                </div>
                <h3 className="text-xl font-playfair font-bold text-text-primary mb-3">
                  Our Vision
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  To be the most trusted name in Nigerian luxury real estate,
                  setting the benchmark for premium property services.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Team — no eyebrow, left-aligned */}
      <section className="px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={revealVariant}
            className="mb-16 md:mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-text-primary leading-tight">
              The Faces of Raphmaths Estates
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
            {agents.map((member, idx) => (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={revealVariant}
                custom={idx * 0.08}
                className="group"
              >
                <div className="aspect-[4/5] overflow-hidden mb-6 relative">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />

                  {/* Social Links on hover */}
                  <div className="absolute bottom-6 left-6 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {member.social?.instagram && (
                      <a
                        href={member.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 bg-primary-gold text-background hover:bg-primary-lightGold transition-colors"
                      >
                        <Instagram className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {member.social?.twitter && (
                      <a
                        href={member.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 bg-primary-gold text-background hover:bg-primary-lightGold transition-colors"
                      >
                        <Twitter className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {member.social?.facebook && (
                      <a
                        href={member.social.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 bg-primary-gold text-background hover:bg-primary-lightGold transition-colors"
                      >
                        <Facebook className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                <h4 className="text-xl font-playfair font-bold text-text-primary mb-1">
                  {member.name}
                </h4>
                <p className="label-caps text-[10px] text-primary-gold font-bold">
                  {member.role}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
