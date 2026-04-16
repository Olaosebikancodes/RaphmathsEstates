import React from 'react';
import { motion } from 'framer-motion';
import { useProperties } from '../context/PropertyContext';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Blog = () => {
  const { blogs } = useProperties();

  return (
    <div className="pt-32 pb-20 px-6 md:px-12 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h4 className="label-caps text-primary-gold mb-4 tracking-[0.2em]">Our Perspective</h4>
          <h1 className="text-5xl md:text-6xl font-playfair font-bold text-text-primary mb-6">Market Insights</h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
            Exploring the luxury real estate landscape in Anambra State. From investment tips to architectural trends.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {blogs.map((blog, idx) => (
            <motion.article
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group flex flex-col h-full border border-border bg-background-surface hover:border-primary-gold transition-colors duration-500 rounded-sm overflow-hidden"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img 
                  src={blog.image} 
                  alt={blog.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="label-caps px-3 py-1 bg-primary-gold text-background text-[10px] font-bold tracking-widest">
                    {blog.category}
                  </span>
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-4 text-text-secondary text-xs mb-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-primary-gold" />
                    <span>{new Date(blog.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="w-3 h-3 text-primary-gold" />
                    <span>Admin</span>
                  </div>
                </div>
                <h3 className="text-2xl font-playfair font-bold text-text-primary mb-4 group-hover:text-primary-gold transition-colors leading-tight">
                  {blog.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-8 flex-1">
                  {blog.excerpt}
                </p>
                <Link 
                  to={`/blog/${blog.id}`} 
                  className="flex items-center gap-2 text-primary-gold font-bold text-xs uppercase tracking-widest group/link"
                >
                  Read Article
                  <ArrowRight className="w-3 h-3 transition-transform group-hover/link:translate-x-2" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
