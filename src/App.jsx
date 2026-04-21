import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { PropertyProvider } from "./context/PropertyContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { ToastProvider } from "./context/ToastContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PageTransition from "./components/PageTransition";
import ScrollToTop from "./components/ScrollToTop";
import ToastContainer from "./components/ToastContainer";
import { Analytics } from "@vercel/analytics/react";

import Home from "./pages/Home";
import Listings from "./pages/Listings";
import PropertyDetail from "./pages/PropertyDetail";
import Saved from "./pages/Saved";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import AdminAuth from "./pages/AdminAuth";
import AddListing from "./pages/AddListing";
import EditListing from "./pages/EditListing";
import AddAgent from "./pages/AddAgent";

function App() {
  const location = useLocation();

  return (
    <ToastProvider>
      <PropertyProvider>
        <FavoritesProvider>
          <ScrollToTop />
          <ToastContainer />
          <Analytics />
          <div className="min-h-screen w-full bg-background flex flex-col overflow-x-hidden relative">
            <main className="flex-grow w-full">
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                  <Route
                    path="/"
                    element={
                      <PageTransition>
                        <Home />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/listings"
                    element={
                      <PageTransition>
                        <Listings />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/property/:id"
                    element={
                      <PageTransition>
                        <PropertyDetail />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/saved"
                    element={
                      <PageTransition>
                        <Saved />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/about"
                    element={
                      <PageTransition>
                        <About />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/contact"
                    element={
                      <PageTransition>
                        <Contact />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <PageTransition>
                        <Admin />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/admin/auth"
                    element={
                      <PageTransition>
                        <AdminAuth />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/admin/add-listing"
                    element={
                      <PageTransition>
                        <AddListing />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/admin/edit-listing/:id"
                    element={
                      <PageTransition>
                        <EditListing />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/admin/add-agent"
                    element={
                      <PageTransition>
                        <AddAgent />
                      </PageTransition>
                    }
                  />
                </Routes>
              </AnimatePresence>
            </main>
            <Navbar />
            <Footer />
          </div>
        </FavoritesProvider>
      </PropertyProvider>
    </ToastProvider>
  );
}

export default App;
